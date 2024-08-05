import { Company, TypeStatus, TypeStatusPayment, User } from "@prisma/client";
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
class CreditNoteService {
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
      const bill = await prisma.creditNote.findFirst({ where: { code } });
      if (!bill)
        return this.responseService.NotFoundException(
          "Nota de credito no encontrada"
        );
      return this.responseService.SuccessResponse(
        "Nota de credito encontrada",
        bill
      );
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

      const [creditNotes, total] = await prisma.$transaction([
        prisma.creditNote.findMany({
          where: { period, company_id: company.id },
          skip,
          take: pagination.limit,
        }),
        prisma.creditNote.count({
          where: { period, company_id: company.id },
        }),
      ]);

      const pageCount = Math.ceil(total / pagination.limit);

      const formatData = {
        total,
        page: pagination.page,
        perPage: pagination.limit,
        pageCount,
        data: creditNotes,
      };

      return this.responseService.SuccessResponse(
        "Lista de notas de credito",
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

      const creditNotes = await prisma.creditNote.findMany({
        where: { company_id: company.id, period },
      });

      return this.responseService.SuccessResponse(
        "Lista de notas de credito",
        creditNotes
      );
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

  create = async (data: I_CreateBill) => {
    try {
      const created = await prisma.creditNote.create({ data });

      return this.responseService.CreatedResponse(
        "Nota de credito creada",
        created
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  createFromBody = async (
    data: I_CreateBillFromBody,
    rucFromHeader: string,
    tokenFromHeader: string
  ) => {
    try {
      const responseInfo = await this.infoService.getCompanyAndUser(
        tokenFromHeader,
        rucFromHeader
      );
      if (responseInfo.error) return responseInfo;
      const { company, user }: { company: Company; user: User } =
        responseInfo.payload;

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

      const formData: I_CreateBill = {
        company_id: company.id,
        user_id_created: user.id,
        num_serie: data.code.split("-")[0],
        num_cpe: Number(data.code.split("-")[1]),
        code: data.code,
        issue_date: data.issue_date,
        expiration_date: data.expiration_date,
        period: data.period,
        amount_base: data.amount_base,
        igv,
        total,
        amount_paid: data.amount_paid,
        amount_pending: total - data.amount_paid,
        bill_status: TypeStatus.ACTIVO,
        bill_status_payment:
          data.bill_status_payment === "CONTADO"
            ? TypeStatusPayment.CONTADO
            : TypeStatusPayment.CREDITO,
        currency_code: data.currency_code,
        supplier_id: data.supplier_id,
        exchange_rate: data.exchange_rate,
      };

      const created = await prisma.creditNote.create({ data: formData });
      return this.responseService.CreatedResponse(
        "Nota de credito creada satisfactoriamente",
        created
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };
}
export default CreditNoteService;
