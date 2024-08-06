import {
  Company,
  TypeCurrency,
  TypeDocument,
  TypeStatus,
  TypeStatusCreated,
  TypeStatusPayment,
  User,
} from "@prisma/client";
import prisma from "../../infrastructure/database/prisma";
import {
  I_CreateBill,
  I_CreateBillFromBody,
  T_ProductInBill,
} from "../models/interfaces/bill.interface";
import AuthService from "./auth.service";
import CompanyService from "./company.service";
import InfoService from "./info.service";
import ResponseService from "./response.service";
import SupplierService from "./supplier.service";
import { T_Header, T_Pagination } from "../models/types/methods.type";
import {
  I_CreateProduct,
  I_CreateProductWithSlug,
} from "../models/interfaces/product.interface";
import slugify from "slugify";

type T_FindAll = {
  body: {
    year: number | undefined;
    month: number | undefined;
    supplier_group_id: string | undefined;
    filter: string | undefined;
  };
  header: T_Header;
};

type T_FindAllNoPagination = {
  body: {
    year: number | undefined;
    month: number | undefined;
  };
  header: T_Header;
};

type T_FindProducts = {
  info: {
    document_id: number;
  };
  header: T_Header;
};

class BillService {
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

  // [success]
  findBillForCode = async (code: string) => {
    try {
      const bill = await prisma.bill.findFirst({ where: { code } });
      if (!bill)
        return this.responseService.NotFoundException(
          "Comprobante no encontrado"
        );
      return this.responseService.SuccessResponse(
        "Comprobante encontrado",
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
  findAll = async ({ body, header }: T_FindAll) => {
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

      let dynamicFilter: any = {};

      let period: string;
      if (body.year && body.month) {
        const formattedMonth = body.month.toString().padStart(2, "0");
        period = `${body.year}-${formattedMonth}`;
        dynamicFilter.period = period;
      }

      if (body.supplier_group_id) {
        const supplier_ids = body.supplier_group_id.split(",").map(Number);
        dynamicFilter.supplier_id = {
          in: supplier_ids,
        };
      }
      if (body.filter) {
        dynamicFilter.code = {
          contains: body.filter,
          mode: "insensitive",
        };
      }

      const response = await prisma.bill.findMany({
        where: { company_id: company.id, ...dynamicFilter },
        include: { Supplier: true },
      });

      return this.responseService.SuccessResponse(
        "Lista de facturas",
        response
      );
    } catch (error) {
      console.log(error);
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  // [success]
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

      console.log("body===", body);

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

      const bills = await prisma.bill.findMany({
        where: { company_id: company.id, period },
      });

      return this.responseService.SuccessResponse("Lista de facturas", bills);
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  // [success]
  create = async (data: I_CreateBill) => {
    try {
      const created = await prisma.bill.create({ data });

      return this.responseService.CreatedResponse(
        "Comprobante creado",
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

      let amount_base;

      if (data.currency_code === "USD") {
        amount_base = data.products.reduce(
          (total: number, product: T_ProductInBill) =>
            total + product.amount * product.price * data.exchange_rate,
          0
        );
      } else {
        amount_base = data.products.reduce(
          (total: number, product: T_ProductInBill) =>
            total + product.amount * product.price,
          0
        );
      }

      const igv = amount_base * 0.18;
      const total = amount_base + igv;

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
        amount_base,
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
        exchange_rate: data.exchange_rate, //[error] evaluar esto, porque debe salir de la api de consulta ruc
        created_status: TypeStatusCreated.LOCAL,
      };

      console.log(formData);

      // de aqui deberia crear todos los productos

      const created = await prisma.bill.create({ data: formData });

      // [message] Ahora creamos los productos que llegaron por la factura

      const products: I_CreateProductWithSlug[] = data.products.map(
        (product: T_ProductInBill) => {
          const slug = slugify(product.title, { lower: true });

          const formatProduct = {
            title: product.title,
            description: product.description || "",
            amount: product.amount,
            document_id: created.id,
            document_type: TypeDocument.BILL,
            price: product.price,
            supplier_id: data.supplier_id,
            unit_measure: product.unit_measure,
            slug,
          };
          return formatProduct;
        }
      );

      const createdProducts = await prisma.product.createMany({
        data: products,
      });

      return this.responseService.CreatedResponse(
        "Factura creada satisfactoriamente",
        created
      );
    } catch (error) {
      console.log(error);
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  // [pending]
  findProducts = async (data: T_FindProducts) => {
    try {
      const responseInfo = await this.infoService.getCompanyAndUser(
        data.header.token,
        data.header.ruc
      );

      if (responseInfo.error) return responseInfo;
      const { company, user }: { company: Company; user: User } =
        responseInfo.payload;

      const products = await prisma.product.findMany({
        where: {
          document_type: TypeDocument.BILL,
          document_id: data.info.document_id,
          status_deleted: false,
        },
        include: {
          Supplier: true,
        },
      });
      return this.responseService.SuccessResponse(
        "Lista de productos",
        products
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };
}
export default BillService;
