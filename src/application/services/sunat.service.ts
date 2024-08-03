import "dotenv/config";
import { environments } from "../../infrastructure/config/environments.constant";
import ApiService from "./api.service";
import ResponseService from "./response.service";
import InfoService from "./info.service";
import { Company, Supplier, TypeCurrency, User } from "@prisma/client";
import BillService from "./bill.service";
import SupplierService from "./supplier.service";
import { I_CreateSupplier } from "../models/interfaces/supplier.interface";
import { I_CreateBill } from "../models/interfaces/bill.interface";
import { I_ItemsBill } from "../models/interfaces/company.interface";
import slugify from "slugify";
import { I_CreateProduct } from "../models/interfaces/product.interface";
import ProductService from "./product.service";
import prisma from "../../infrastructure/database/prisma";
import {
  convertStringToDate,
  convertToDate,
} from "../../infrastructure/utils/convert-to-date";
import SireService from "./sire.service";
import SunatSecurityService from "./sunat-security.service";
import { typeDocumentSunat } from "../models/constants/type_document.constant";
import { I_Document_Item } from "../models/interfaces/document.interface";
import { extractCompanyDetails } from "../../infrastructure/utils/sunat.util";
import CreditNoteService from "./credit-note.service";
import TicketService from "./ticket.service";
const base_api_sunat = environments.BASE_API_SUNAT;
const base_api_query = environments.BASE_API_QUERY;

export type T_Config = {
  type: string;
  payment_type: string;
  ruc: number;
  serie: string;
  number: number;
};

export type T_DataSynchronize = {
  period: string;
  page: number;
  perPage: number;
};

let suppliers: Supplier[] = [];
class SunatService {
  private base_api_query_module = "v1/consulta-ruc";

  private responseService: ResponseService = new ResponseService();
  private apiService: ApiService = new ApiService();
  private infoService: InfoService = new InfoService();
  private billService: BillService = new BillService();
  private supplierService: SupplierService = new SupplierService();
  private productService: ProductService = new ProductService();
  private sireService: SireService = new SireService();
  private sunatSecurityService: SunatSecurityService =
    new SunatSecurityService();
  private creditNoteService: CreditNoteService = new CreditNoteService();
  private ticketService: TicketService = new TicketService();

  // [success]
  queryForRuc = async (ruc: string) => {
    try {
      const { data: response } = await this.apiService.getParam(
        base_api_query,
        this.base_api_query_module,
        ruc
      );
      const data = response.data;

      let phone_number;

      if (data.contacto.telefono_3 !== "-") {
        phone_number = data.contacto.telefono_3;
      } else if (data.contacto.telefono_2 !== "-") {
        phone_number = data.contacto.telefono_2;
      } else if (data.contacto.telefono_1 !== "-") {
        phone_number = data.contacto.telefono_1;
      } else {
        phone_number = "";
      }
      const formatData = {
        ruc: data.ruc.split("-")[0].trim() || "",
        business_name: extractCompanyDetails(data.razon_social).businessName,
        business_type: extractCompanyDetails(data.razon_social).businessType,
        business_status: data.estado_contribuyente || "",
        business_direction_fiscal: data.domicilio_fiscal || "",
        country_code: "+51",
        phone_number,
      };

      return this.responseService.SuccessResponse(
        "Datos de usuario",
        formatData
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  findBills = async (ruc: string, key: string) => {
    try {
      const response = await this.apiService.post("", "", {});
    } catch (error) {
      return this.responseService.InternalServerErrorException();
    }
  };

  // [success]
  findDocuments = async (
    data: T_DataSynchronize,
    rucFromHeader: string,
    tokenFromHeader: string
  ) => {
    try {
      // necesitamos crear el token de sunat
      const responseToken =
        await this.sunatSecurityService.captureTokenSecurity(
          rucFromHeader,
          tokenFromHeader
        );
      if (responseToken.error) return responseToken;

      const token = responseToken.payload.access_token;

      // hacer la peticion

      const dataForDocuments = {
        period: "2024-06",
        page: "1",
        perPage: 100,
      };
      const headers = {
        Authorization: "Bearer " + token,
      };
      const responseDocuments = await this.apiService.post(
        environments.BASE_API_QUERY,
        "v1/comprobantes",
        data,
        headers
      );
      // tipar la respuesta
      //  retornar la respuesta

      return this.responseService.SuccessResponse("", responseDocuments.data);
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  findProducts = async (rucFromHeader: string, tokenFromHeader: string) => {};

  //- Por aquí deberían pasar todas las credenciales, client_id, client_secret, username, password

  synchronizeDataWithDatabase = async (
    data: T_DataSynchronize,
    rucFromHeader: string,
    tokenFromHeader: string
  ) => {
    try {
      // Validamos a la empresa y al usuario donde pertenece

      // [message] debemos recuperar todos los comprabantes tipo boleta, factura, nota de credio y nota de debito

      const { payload } = await this.findDocuments(
        data,
        rucFromHeader,
        tokenFromHeader
      );

      const comprobantes = payload.registros as I_Document_Item[];

      for (const item of comprobantes) {
        // [pending] en este caso tenemos que validar los 4 tipos de documentos
        const typeDocument = item.codTipoCDP;

        // [note] se evalua a cada uno porque cada uno tiene una logica diferente

        if (typeDocument === typeDocumentSunat.FACTURA.code) {
          await this.synchronizeBill(item, rucFromHeader, tokenFromHeader);
        } else if (typeDocument === typeDocumentSunat.BOLETA_DEV_VENTA.code) {
          await this.synchronizeTicket(item, rucFromHeader, tokenFromHeader);
        } else if (typeDocument === typeDocumentSunat.NOTA_DE_CREDITO.code) {
          await this.synchronizeCreditNote(
            item,
            rucFromHeader,
            tokenFromHeader
          );
        } else if (typeDocument === typeDocumentSunat.NOTA_DE_DEBITO.code) {
          await this.synchronizeDebitNote(item, rucFromHeader, tokenFromHeader);
        }
      }

      return this.responseService.SuccessResponse(
        `Actualización realizada con éxito`
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
  synchronizeBill = async (
    item: I_Document_Item,
    rucFromHeader: string,
    tokenFromHeader: string
  ) => {
    try {
      // [note] data de usuario y empresa actual
      const responseInfo = await this.infoService.getCompanyAndUser(
        tokenFromHeader,
        rucFromHeader
      );

      if (responseInfo.error) return responseInfo;

      const { company, user }: { company: Company; user: User } =
        responseInfo.payload;

      // [note] validamos el comprobante
      const code = item.numSerieCDP + "-" + item.numCDP;
      const responseBill = await this.billService.findBillForCode(code);

      if (responseBill.error && responseBill.statusCode === 404) {
        // [message] Si en caso no exista el proveedor para la empresa lo registramos
        const responseSupplier = await this.supplierService.findForRuc(
          item.numDocIdentidadProveedor,
          rucFromHeader
        );

        let supplier: Supplier | null = responseSupplier.payload;
        if (responseSupplier.error && responseSupplier.statusCode === 404) {
          const formatDataSupplier: I_CreateSupplier = {
            business_direction: "",
            business_name: extractCompanyDetails(item.nomRazonSocialProveedor)
              .businessName,
            business_status: "",
            business_type: extractCompanyDetails(item.nomRazonSocialProveedor)
              .businessType,
            company_id: company.id,
            description: "",
            ruc: item.numDocIdentidadProveedor,
            user_id_created: user.id,
            phone: null,
            country_code: null,
          };

          const responseCreateSupplier = await this.supplierService.create(
            formatDataSupplier,
            tokenFromHeader,
            rucFromHeader
          );

          if (responseCreateSupplier.error) return responseCreateSupplier;

          supplier = responseCreateSupplier.payload as Supplier;
        }

        // [message] Registrar comprobante

        const formatDataBill: I_CreateBill = {
          num_serie: item.numSerieCDP,
          num_cpe: Number(item.numCDP),
          code,
          issue_date: convertStringToDate(item.fecEmision),
          expiration_date: convertStringToDate(item.fecVencPag),
          amount_base: item.montos.mtoBIGravadaDG || 0,
          igv: item.montos.mtoIgvIpmDG || 0,
          total: item.montos.mtoBIGravadaDG || 0,
          amount_pending: 0,
          amount_paid: 0,
          period:
            item.perTributario.slice(0, 4) +
            "-" +
            item.perTributario.slice(4, 6),
          bill_status: "",
          supplier_id: supplier ? supplier.id : null,
          company_id: company.id,
          user_id_created: user.id,
          currency_code:
            item.codMoneda === "PEN" ? TypeCurrency.PE : TypeCurrency.USD,
        };

        // [note] paso esto porque el metodo puede ser que no necesite de el ruc header y el token
        const responseCreateBill = await this.billService.create(
          formatDataBill
        );

        if (responseCreateBill.error) return responseCreateBill;

        //[pending] Registrar productos - pendiente porque es otra api

        const formatFetchDetail = {
          type: "RECIBIDO",
          payment_type: typeDocumentSunat.FACTURA.description,
          ruc: rucFromHeader,
          serie: item.numSerieCDP,
          number: Number(item.numCDP),
        };
      }
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  synchronizeTicket = async (
    item: I_Document_Item,
    rucFromHeader: string,
    tokenFromHeader: string
  ) => {
    try {
      // [note] data de usuario y empresa actual
      const responseInfo = await this.infoService.getCompanyAndUser(
        tokenFromHeader,
        rucFromHeader
      );

      if (responseInfo.error) return responseInfo;

      const { company, user }: { company: Company; user: User } =
        responseInfo.payload;

      // [note] validamos el comprobante
      const code = item.numSerieCDP + "-" + item.numCDP;
      const responseBill = await this.ticketService.findForCode(code);

      if (responseBill.error && responseBill.statusCode === 404) {
        // [message] Si en caso no exista el proveedor para la empresa lo registramos
        const responseSupplier = await this.supplierService.findForRuc(
          item.numDocIdentidadProveedor,
          rucFromHeader
        );

        let supplier: Supplier | null = responseSupplier.payload;
        if (responseSupplier.error && responseSupplier.statusCode === 404) {
          const formatDataSupplier: I_CreateSupplier = {
            business_direction: "",
            business_name: extractCompanyDetails(item.nomRazonSocialProveedor)
              .businessName,
            business_status: "",
            business_type: extractCompanyDetails(item.nomRazonSocialProveedor)
              .businessType,
            company_id: company.id,
            description: "",
            ruc: item.numDocIdentidadProveedor,
            user_id_created: user.id,
            phone: null,
            country_code: null,
          };

          const responseCreateSupplier = await this.supplierService.create(
            formatDataSupplier,
            tokenFromHeader,
            rucFromHeader
          );

          if (responseCreateSupplier.error) return responseCreateSupplier;

          supplier = responseCreateSupplier.payload as Supplier;
        }

        // [message] Registrar comprobante

        const formatDataBill: I_CreateBill = {
          num_serie: item.numSerieCDP,
          num_cpe: Number(item.numCDP),
          code,
          issue_date: convertStringToDate(item.fecEmision),
          expiration_date: convertStringToDate(item.fecVencPag),
          amount_base: item.montos.mtoBIGravadaDG || 0,
          igv: item.montos.mtoIgvIpmDG || 0,
          total: item.montos.mtoBIGravadaDG || 0,
          amount_pending: 0,
          amount_paid: 0,
          period:
            item.perTributario.slice(0, 4) +
            "-" +
            item.perTributario.slice(4, 6),
          bill_status: "",
          supplier_id: supplier ? supplier.id : null,
          company_id: company.id,
          user_id_created: user.id,
          currency_code:
            item.codMoneda === "PEN" ? TypeCurrency.PE : TypeCurrency.USD,
        };

        // [note] paso esto porque el metodo puede ser que no necesite de el ruc header y el token
        const responseCreateTicket = await this.ticketService.create(
          formatDataBill
        );

        if (responseCreateTicket.error) return responseCreateTicket;

        //[pending] Registrar productos - pendiente porque es otra api

        const formatFetchDetail = {
          type: "RECIBIDO",
          payment_type: typeDocumentSunat.FACTURA.description,
          ruc: rucFromHeader,
          serie: item.numSerieCDP,
          number: Number(item.numCDP),
        };
      }
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  synchronizeCreditNote = async (
    item: I_Document_Item,
    rucFromHeader: string,
    tokenFromHeader: string
  ) => {
    try {
      // [note] data de usuario y empresa actual
      const responseInfo = await this.infoService.getCompanyAndUser(
        tokenFromHeader,
        rucFromHeader
      );

      if (responseInfo.error) return responseInfo;

      const { company, user }: { company: Company; user: User } =
        responseInfo.payload;

      // [note] validamos el comprobante
      const code = item.numSerieCDP + "-" + item.numCDP;
      const responseBill = await this.creditNoteService.findForCode(code);

      if (responseBill.error && responseBill.statusCode === 404) {
        // [message] Si en caso no exista el proveedor para la empresa lo registramos
        // [message] no podemos sacar la logica del registro de proveedor afuera porque es el id dinamico de cada documento
        const responseSupplier = await this.supplierService.findForRuc(
          item.numDocIdentidadProveedor,
          rucFromHeader
        );

        let supplier: Supplier | null = responseSupplier.payload;
        if (responseSupplier.error && responseSupplier.statusCode === 404) {
          const formatDataSupplier: I_CreateSupplier = {
            business_direction: "",
            business_name: extractCompanyDetails(item.nomRazonSocialProveedor)
              .businessName,
            business_status: "",
            business_type: extractCompanyDetails(item.nomRazonSocialProveedor)
              .businessType,
            company_id: company.id,
            description: "",
            ruc: item.numDocIdentidadProveedor,
            user_id_created: user.id,
            phone: null,
            country_code: null,
          };

          const responseCreateSupplier = await this.supplierService.create(
            formatDataSupplier,
            tokenFromHeader,
            rucFromHeader
          );

          if (responseCreateSupplier.error) return responseCreateSupplier;
          supplier = responseCreateSupplier.payload as Supplier;
        }

        // [message] Registrar comprobante

        const formatDataBill: I_CreateBill = {
          num_serie: item.numSerieCDP,
          num_cpe: Number(item.numCDP),
          code,
          issue_date: convertStringToDate(item.fecEmision),
          expiration_date: convertStringToDate(item.fecVencPag),
          amount_base: item.montos.mtoBIGravadaDG || 0,
          igv: item.montos.mtoIgvIpmDG || 0,
          total: item.montos.mtoBIGravadaDG || 0,
          amount_pending: 0,
          amount_paid: 0,
          period:
            item.perTributario.slice(0, 4) +
            "-" +
            item.perTributario.slice(4, 6),
          bill_status: "",
          supplier_id: supplier ? supplier.id : null,
          company_id: company.id,
          user_id_created: user.id,
          currency_code:
            item.codMoneda === "PEN" ? TypeCurrency.PE : TypeCurrency.USD,
        };

        // [note] paso esto porque el metodo puede ser que no necesite de el ruc header y el token
        const responseCreateCreditNote = await this.creditNoteService.create(
          formatDataBill
        );

        if (responseCreateCreditNote.error) return responseCreateCreditNote;

        //[pending] Registrar productos - pendiente porque es otra api

        const formatFetchDetail = {
          type: "RECIBIDO",
          payment_type: typeDocumentSunat.FACTURA.description,
          ruc: rucFromHeader,
          serie: item.numSerieCDP,
          number: Number(item.numCDP),
        };

        // const products = item.informacionItems as I_ItemsBill[];

        // await Promise.all(
        //   products.map(async (product: I_ItemsBill) => {
        //     const slug = slugify(product.desItem, { lower: true });

        //     const formatProduct: I_CreateProduct = {
        //       title: product.desItem,
        //       amount: product.cntItems,
        //       price: product.mtoValUnitario,
        //       slug,
        //       supplier_id: supplier ? supplier.id : null,
        //       description: "",
        //       unit_measure: product.desUnidadMedida,
        //       code_measure: product.codUnidadMedida,
        //     };

        //     const responseCreateProduct = await this.productService.create(
        //       formatProduct
        //     );

        //     responseCreateProduct;
        //     if (responseCreateProduct.error) return responseCreateProduct;
        //     numberActions++;
        //   })
        // );
      }
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  synchronizeDebitNote = async (
    item: I_Document_Item,
    rucFromHeader: string,
    tokenFromHeader: string
  ) => {
    try {
      // [note] data de usuario y empresa actual
      const responseInfo = await this.infoService.getCompanyAndUser(
        tokenFromHeader,
        rucFromHeader
      );

      if (responseInfo.error) return responseInfo;

      const { company, user }: { company: Company; user: User } =
        responseInfo.payload;

      // [note] validamos el comprobante
      const code = item.numSerieCDP + "-" + item.numCDP;
      const responseBill = await this.ticketService.findForCode(code);

      if (responseBill.error && responseBill.statusCode === 404) {
        // [message] Si en caso no exista el proveedor para la empresa lo registramos
        const responseSupplier = await this.supplierService.findForRuc(
          item.numDocIdentidadProveedor,
          rucFromHeader
        );

        let supplier: Supplier | null = responseSupplier.payload;
        if (responseSupplier.error && responseSupplier.statusCode === 404) {
          const formatDataSupplier: I_CreateSupplier = {
            business_direction: "",
            business_name: extractCompanyDetails(item.nomRazonSocialProveedor)
              .businessName,
            business_status: "",
            business_type: extractCompanyDetails(item.nomRazonSocialProveedor)
              .businessType,
            company_id: company.id,
            description: "",
            ruc: item.numDocIdentidadProveedor,
            user_id_created: user.id,
            phone: null,
            country_code: null,
          };

          const responseCreateSupplier = await this.supplierService.create(
            formatDataSupplier,
            tokenFromHeader,
            rucFromHeader
          );

          if (responseCreateSupplier.error) return responseCreateSupplier;

          supplier = responseCreateSupplier.payload as Supplier;
        }

        // [message] Registrar comprobante

        const formatDataBill: I_CreateBill = {
          num_serie: item.numSerieCDP,
          num_cpe: Number(item.numCDP),
          code,
          issue_date: convertStringToDate(item.fecEmision),
          expiration_date: convertStringToDate(item.fecVencPag),

          amount_base: item.montos.mtoBIGravadaDG || 0,
          igv: item.montos.mtoIgvIpmDG || 0,
          total: item.montos.mtoBIGravadaDG || 0,
          amount_pending: 0,
          amount_paid: 0,
          period:
            item.perTributario.slice(0, 4) +
            "-" +
            item.perTributario.slice(4, 6),
          bill_status: "",
          supplier_id: supplier ? supplier.id : null,
          company_id: company.id,
          user_id_created: user.id,
          currency_code:
            item.codMoneda === "PEN" ? TypeCurrency.PE : TypeCurrency.USD,
        };

        // [note] paso esto porque el metodo puede ser que no necesite de el ruc header y el token
        const responseCreateTicket = await this.ticketService.create(
          formatDataBill
        );

        if (responseCreateTicket.error) return responseCreateTicket;

        //[pending] Registrar productos - pendiente porque es otra api

        const formatFetchDetail = {
          type: "RECIBIDO",
          payment_type: typeDocumentSunat.FACTURA.description,
          ruc: rucFromHeader,
          serie: item.numSerieCDP,
          number: Number(item.numCDP),
        };
      }
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };
}

export default SunatService;
