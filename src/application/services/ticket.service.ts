import { Company, User } from "@prisma/client";
import prisma from "../../infrastructure/database/prisma";
import {
  I_CreateBill,
  I_CreateBillFromBody,
} from "../models/interfaces/bill.interface";
import AuthService from "./auth.service";
import CompanyService from "./company.service";
import InfoService from "./info.service";
import ResponseService from "./response.service";
import SupplierService from "./supplier.service";

type T_FindAll = {
  body: {
    year: number | undefined;
    month: number | undefined;
  };
  pagination: {
    page: number;
    limit: number;
  };
  header: {
    ruc: string;
    token: string;
  };
};

type T_FindAllNoPagination = {
  body: {
    year: number | undefined;
    month: number | undefined;
  };
  header: {
    ruc: string;
    token: string;
  };
};

class TicketService {
  private responseService: ResponseService;
  private authService: AuthService;
  private companyService: CompanyService;
  private infoService: InfoService;
  private supplierService: SupplierService;

  constructor() {
    this.responseService = new ResponseService();
    this.authService = new AuthService();
    this.companyService = new CompanyService();
    this.infoService = new InfoService();
    this.supplierService = new SupplierService();
  }

  findForCode = async (code: string) => {
    try {
      const bill = await prisma.ticket.findFirst({ where: { code } });
      if (!bill)
        return this.responseService.NotFoundException("Boleta no encontrada");
      return this.responseService.SuccessResponse("Boleta encontrada", bill);
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    } finally {
      prisma.$disconnect();
    }
  };

  // [success]
  findAll = async ({ body, pagination, header }: T_FindAll) => {
    try {
      const responseValidation = await this.infoService.getCompanyAndUser(
        header.token,
        header.ruc
      );

      if (responseValidation.error) return responseValidation;

      const {
        user,
        company,
      }: {
        user: User;
        company: Company;
      } = responseValidation.payload;

      let period: string;
      if (body.year && body.month) {
        const formattedMonth = body.month.toString().padStart(2, "0");
        period = `${body.year}-${formattedMonth}`;
      } else {
        const date = new Date();
        const formattedMonth = (date.getMonth() + 1)
          .toString()
          .padStart(2, "0");
        period = `${date.getFullYear()}-${formattedMonth}`;
      }

      const skip = (pagination.page - 1) * pagination.limit;

      const [tickets, total] = await prisma.$transaction([
        prisma.ticket.findMany({
          where: { period, company_id: company.id },
          skip,
          take: pagination.limit,
        }),
        prisma.ticket.count({
          where: { period, company_id: company.id },
        }),
      ]);

      const pageCount = Math.ceil(total / pagination.limit);

      const formatData = {
        total,
        page: pagination.page,
        perPage: pagination.limit,
        pageCount,
        data: tickets,
      };

      return this.responseService.SuccessResponse(
        "Lista de boletas",
        formatData
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  findAllByAccumulated = async ({ body, header }: T_FindAllNoPagination) => {
    try {
      const responseValidation = await this.infoService.getCompanyAndUser(
        header.token,
        header.ruc
      );

      if (responseValidation.error) return responseValidation;

      const {
        user,
        company,
      }: {
        user: User;
        company: Company;
      } = responseValidation.payload;

      let period: string;
      if (body.year && body.month) {
        const formattedMonth = body.month.toString().padStart(2, "0");
        period = `${body.year}-${formattedMonth}`;
      } else {
        const date = new Date();
        const formattedMonth = (date.getMonth() + 1)
          .toString()
          .padStart(2, "0");
        period = `${date.getFullYear()}-${formattedMonth}`;
      }

      const tickets = await prisma.ticket.findMany({
        where: { period, company_id: company.id },
      });

      return this.responseService.SuccessResponse("Lista de boletas", tickets);
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  // [message] para el dasboard
  findAllTargets = async (rucFromHeader: string, token: string) => {
    try {
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    } finally {
      prisma.$disconnect();
    }
  };

  create = async (
    data: I_CreateBillFromBody | I_CreateBill,
    rucFromHeader?: string,
    tokenFromHeader?: string
  ) => {
    try {
      let formData: I_CreateBill;
      let created;

      if (rucFromHeader && tokenFromHeader) {
        // [note] en caso se cree por el body

        const responseInfo = await this.infoService.getCompanyAndUser(
          tokenFromHeader,
          rucFromHeader
        );
        if (responseInfo.error) return responseInfo;
        const { company, user }: { company: Company; user: User } =
          responseInfo.payload;

        // [note] validamos si el proveedor pertenece o no a la empresa donde estamos
        const responseSupplier = await this.supplierService.findById(
          Number(data.supplier_id),
          rucFromHeader
        );
        if (responseSupplier.error) return responseSupplier;

        if (responseSupplier.payload.company_id !== company.id)
          return this.responseService.BadRequestException(
            "El proveedor seleccionado no pertenece a la empresa"
          );

        const igv = data.amount_base * 0.18;
        const total = data.amount_base + igv;

        data.amount_paid = data.amount_paid | 0;

        formData = {
          ...data,
          igv,
          total,
          amount_paid: data.amount_paid,
          amount_pending: total - data.amount_paid,
          user_id_created: user.id,
          company_id: company.id,
        };

        created = await prisma.ticket.create({ data: formData });
      } else {
        // [note] en caso se cree por el sire
        // [NOTE] en el caso del sire, creo que ya valida si el supplier o proveedor a quien va dirigido ya existe (si lo valida)
        created = await prisma.ticket.create({ data });
      }

      return this.responseService.CreatedResponse("Boleta creada", created);
    } catch (error) {
      error;
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };
}
export default TicketService;
