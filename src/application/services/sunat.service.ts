import "dotenv/config";
import { environments } from "../../infrastructure/config/environments.constant";
import ApiService from "./api.service";
import ResponseService from "./response.service";
import InfoService from "./info.service";
import {
  Company,
  CreditNoteDocuments,
  Supplier,
  TypeCurrency,
  TypeDocument,
  TypeStatus,
  TypeStatusCreated,
  TypeStatusPayment,
  User,
} from "@prisma/client";
import BillService from "./bill.service";
import SupplierService from "./supplier.service";
import { I_CreateSupplier } from "../models/interfaces/supplier.interface";
import { I_CreateBill } from "../models/interfaces/bill.interface";
import { I_ItemsBill } from "../models/interfaces/company.interface";
import slugify from "slugify";
import {
  I_CreateProduct,
  I_CreateProductWithSlug,
  I_ResponseDetail,
} from "../models/interfaces/product.interface";
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

      let phone_number = "-";
      if (data.contacto) {
        if (data.contacto.telefono_3 !== "-") {
          phone_number = data.contacto.telefono_3;
        } else if (data.contacto.telefono_2 !== "-") {
          phone_number = data.contacto.telefono_2;
        } else if (data.contacto.telefono_1 !== "-") {
          phone_number = data.contacto.telefono_1;
        } else {
          phone_number = "";
        }
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

  // [success] para el calcula de la tasa de cambio
  currencyRateDollar = async () => {
    try {
      const { data } = await this.apiService.getWithoutModule(
        environments.BASE_API_CURRENCY_RANGE
      );

      const values = data.split("|");
      const buying = Number(values[1]);

      const selling = Number(values[2]);

      return this.responseService.SuccessResponse("", { buying, selling });
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
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

      const { payload } = await this.findDocuments(
        data,
        rucFromHeader,
        tokenFromHeader
      );

      const exchange_range = await this.currencyRateDollar();
      const { buying, selling } = exchange_range.payload;

      const comprobantes = payload.registros as I_Document_Item[];

      if (comprobantes) {
        for (const item of comprobantes) {
          const typeDocument = item.codTipoCDP;

          if (typeDocument === typeDocumentSunat.FACTURA.code) {
            await this.synchronizeBill(
              item,
              rucFromHeader,
              tokenFromHeader,
              selling
            );
          } else if (typeDocument === typeDocumentSunat.BOLETA_DEV_VENTA.code) {
            await this.synchronizeTicket(
              item,
              rucFromHeader,
              tokenFromHeader,
              selling
            );
          } else if (typeDocument === typeDocumentSunat.NOTA_DE_CREDITO.code) {
            await this.synchronizeCreditNote(
              item,
              rucFromHeader,
              tokenFromHeader,
              selling
            );
          } else if (typeDocument === typeDocumentSunat.NOTA_DE_DEBITO.code) {
            await this.synchronizeDebitNote(
              item,
              rucFromHeader,
              tokenFromHeader
            );
          }
        }
      }

      return this.responseService.SuccessResponse(
        `Actualización realizada con éxito`
      );
    } catch (error) {
      console.log(error);
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    } finally {
      prisma.$disconnect();
    }
  };

  registerProductsInSynchronize = async (
    documents: I_ResponseDetail[],
    supplier: Supplier,
    document_type: TypeDocument,
    document_id: number
  ) => {
    try {
      for (const document of documents) {
        const items = document.informacionItems;

        for (const product of items) {
          const slug = slugify(product.desItem, { lower: true });
          const formatProduct: I_CreateProductWithSlug = {
            title: product.desItem,
            amount: product.cntItems,
            price: product.mtoValUnitario,
            slug,
            supplier_id: supplier ? supplier.id : null,
            description: "",
            unit_measure: product.desUnidadMedida,
            document_type,
            document_id,
          };

          const responseCreateProduct = await this.productService.create(
            formatProduct
          );
          if (responseCreateProduct.error) return responseCreateProduct;
        }
      }

      return this.responseService.SuccessResponse();
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  // [success]
  synchronizeBill = async (
    item: I_Document_Item,
    rucFromHeader: string,
    tokenFromHeader: string,
    selling: number
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

        let supplier: Supplier = responseSupplier.payload;

        if (responseSupplier.error && responseSupplier.statusCode === 404) {
          const formatDataSupplier: I_CreateSupplier = {
            business_direction: "",
            business_name: extractCompanyDetails(item.nomRazonSocialProveedor)
              .businessName,
            business_status: "ACTIVO",
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
          total: item.montos.mtoTotalCp || 0,
          amount_pending: 0,
          amount_paid:
            item.fecVencPag === "" ? Number(item.montos.mtoTotalCp) : 0,
          period:
            item.perTributario.slice(0, 4) +
            "-" +
            item.perTributario.slice(4, 6),
          bill_status: TypeStatus.ACTIVO,
          bill_status_payment: TypeStatusPayment.CONTADO,
          supplier_id: supplier ? supplier.id : null,
          company_id: company.id,
          user_id_created: user.id,
          currency_code:
            item.codMoneda === "PEN" ? TypeCurrency.PEN : TypeCurrency.USD,
          exchange_rate: selling,
          created_status: TypeStatusCreated.SUNAT,
        };

        const responseCreateBill = await this.billService.create(
          formatDataBill
        );

        if (responseCreateBill.error) return responseCreateBill;

        const formatFetchDetail = {
          type: "RECIBIDO",
          payment_type: typeDocumentSunat.FACTURA.description,
          ruc: item.numDocIdentidadProveedor,
          serie: item.numSerieCDP,
          number: Number(item.numCDP),
        };

        const response = await this.apiService.post(
          environments.BASE_API_QUERY,
          "v1/comprobantes/detalle",
          formatFetchDetail
        );
        const products = response.data.comprobantes as I_ResponseDetail[];

        const createdProducts = await this.registerProductsInSynchronize(
          products,
          supplier,
          TypeDocument.BILL,
          responseCreateBill.payload.id
        );
        if (createdProducts?.error)
          return this.responseService.BadRequestException(
            "Error al registrar los productos, por favor verifique los campos"
          );
        return this.responseService.SuccessResponse(
          "Sincronizacion realizada con exito, verifique los productos registrados"
        );
      } else {
        // [note] si ya esta registrado lo que debemos hacer es eliminar todas las referencias con respecto a la factura

        // verificamos si es de estado local o sunat, solo eliminamos si es de estado local

        if (responseBill.payload.created_status === TypeStatusCreated.LOCAL) {
          // boramos la factura si esta en modo local

          const supplier = await prisma.supplier.findFirst({
            where: { id: responseBill.payload.supplier_id },
          });

          if (!supplier)
            return this.responseService.NotFoundException(
              "Proveedor no encontrado"
            );

          await prisma.bill.delete({
            where: { id: responseBill.payload.id },
          });

          const products = await prisma.product.findMany({
            where: { document_id: responseBill.payload.id },
          });
          for (const product of products) {
            await prisma.product.delete({ where: { id: product.id } });
          }

          // boramos los productos registrados

          await prisma.detailProductLabel.deleteMany({
            where: {
              product_id: { in: products.map((product) => product.id) },
            },
          });

          // [note] una vez borrado todas las referencias, procedemos a hacer un nuevo registro

          const formatDataBill: I_CreateBill = {
            num_serie: item.numSerieCDP,
            num_cpe: Number(item.numCDP),
            code,
            issue_date: convertStringToDate(item.fecEmision),
            expiration_date: convertStringToDate(item.fecVencPag),
            amount_base: item.montos.mtoBIGravadaDG || 0,
            igv: item.montos.mtoIgvIpmDG || 0,
            total: item.montos.mtoTotalCp || 0,
            amount_pending: 0,
            amount_paid:
              item.fecVencPag === "" ? Number(item.montos.mtoTotalCp) : 0,
            period:
              item.perTributario.slice(0, 4) +
              "-" +
              item.perTributario.slice(4, 6),
            bill_status: TypeStatus.ACTIVO,
            bill_status_payment: TypeStatusPayment.CONTADO,
            supplier_id: responseBill.payload.supplier_id,
            company_id: company.id,
            user_id_created: user.id,
            currency_code:
              item.codMoneda === "PEN" ? TypeCurrency.PEN : TypeCurrency.USD,
            exchange_rate: selling,
            created_status: TypeStatusCreated.SUNAT,
          };

          const responseCreateBill = await this.billService.create(
            formatDataBill
          );

          if (responseCreateBill.error) return responseBill;

          const formatFetchDetail = {
            type: "RECIBIDO",
            payment_type: typeDocumentSunat.FACTURA.description,
            ruc: item.numDocIdentidadProveedor,
            serie: item.numSerieCDP,
            number: Number(item.numCDP),
          };

          const response = await this.apiService.post(
            environments.BASE_API_QUERY,
            "v1/comprobantes/detalle",
            formatFetchDetail
          );
          const productsRestore = response.data
            .comprobantes as I_ResponseDetail[];

          await this.registerProductsInSynchronize(
            productsRestore,
            supplier,
            TypeDocument.BILL,
            responseCreateBill.payload.id
          );

          return this.responseService.SuccessResponse(
            "Sincronizacion realizada con exito, verifique los productos registrados"
          );
        }
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
    tokenFromHeader: string,
    selling: number
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
            business_status: "ACTIVO",

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
          total: item.montos.mtoTotalCp || 0,
          amount_pending: 0,
          amount_paid: 0,
          period:
            item.perTributario.slice(0, 4) +
            "-" +
            item.perTributario.slice(4, 6),
          bill_status: TypeStatus.ACTIVO,
          bill_status_payment: TypeStatusPayment.CONTADO,
          supplier_id: supplier ? supplier.id : null,
          company_id: company.id,
          user_id_created: user.id,
          currency_code:
            item.codMoneda === "PEN" ? TypeCurrency.PEN : TypeCurrency.USD,
          exchange_rate: 0, //[error] evaluar esto, porque debe salir de la api de consulta ruc
          created_status: TypeStatusCreated.SUNAT,
        };

        // [note] paso esto porque el metodo puede ser que no necesite de el ruc header y el token
        const responseCreateCreditNote = await this.creditNoteService.create(
          formatDataBill
        );

        if (responseCreateCreditNote.error) return responseCreateCreditNote;

        //[pending] Registrar productos - pendiente porque es otra api
        //[pending] En este caso, los productos que se reciben son de devolucion, como eso no se contemplo, no procedemos a evaluarlo

        const formatFetchDetail = {
          type: "RECIBIDO",
          payment_type: typeDocumentSunat.FACTURA.description,
          ruc: rucFromHeader,
          serie: item.numSerieCDP,
          number: Number(item.numCDP),
        };

        // [note] registramos los documentos relacionados
        const itemDocuments = item.lisDocumentosMod;

        await Promise.all(
          itemDocuments.map(async (itemD) => {
            const formatCreditNotedocument = {
              credit_note_id: responseCreateCreditNote.payload.id,
              issue_date: convertStringToDate(itemD.fecEmisionMod),
              code_type_document: itemD.codTipoCDPMod,
              num_serie: itemD.numSerieCDPMod,
              num_cpe: Number(itemD.numCDPMod),
            };
            const responseCreateCreditNoteDocument =
              await prisma.creditNoteDocuments.create({
                data: formatCreditNotedocument,
              });

            const creditNoteDocument: CreditNoteDocuments =
              responseCreateCreditNoteDocument;

            const billCode =
              creditNoteDocument.num_serie + "-" + creditNoteDocument.num_cpe;

            const billInstance = await this.billService.findBillForCode(
              billCode
            );

            if (billInstance.error) return billInstance;

            await prisma.bill.update({
              where: { code },
              data: {
                amount_paid: {
                  increment: Number(item.montos.mtoBIGravadaDG),
                },
                amount_pending: {
                  decrement: Number(item.montos.mtoBIGravadaDG),
                },
              },
            });
          })
        );
      } else {
        // verificamos si es de estado local o sunat, solo eliminamos si es de estado local

        if (responseBill.payload.created_status === TypeStatusCreated.LOCAL) {
          // boramos la factura si esta en modo local

          const supplier = await prisma.supplier.findFirst({
            where: { id: responseBill.payload.supplier_id },
          });

          if (!supplier)
            return this.responseService.NotFoundException(
              "Proveedor no encontrado"
            );

          await prisma.bill.delete({
            where: { id: responseBill.payload.id },
          });

          // [message] dudo que en una nota de credito haya productos, asi que no necesitamos borrar nada
          // const products = await prisma.product.findMany({
          //   where: { document_id: responseBill.payload.id },
          // });
          // for (const product of products) {
          //   await prisma.product.delete({ where: { id: product.id } });
          // }

          // // boramos los productos registrados

          // await prisma.detailProductLabel.deleteMany({
          //   where: {
          //     product_id: { in: products.map((product) => product.id) },
          //   },
          // });

          // [note] una vez borrado todas las referencias, procedemos a hacer un nuevo registro

          const formatDataCreditNote: I_CreateBill = {
            num_serie: item.numSerieCDP,
            num_cpe: Number(item.numCDP),
            code,
            issue_date: convertStringToDate(item.fecEmision),
            expiration_date: convertStringToDate(item.fecVencPag),
            amount_base: item.montos.mtoBIGravadaDG || 0,
            igv: item.montos.mtoIgvIpmDG || 0,
            total: item.montos.mtoTotalCp || 0,
            amount_pending: 0,
            amount_paid:
              item.fecVencPag === "" ? Number(item.montos.mtoTotalCp) : 0,
            period:
              item.perTributario.slice(0, 4) +
              "-" +
              item.perTributario.slice(4, 6),
            bill_status: TypeStatus.ACTIVO,
            bill_status_payment: TypeStatusPayment.CONTADO,
            supplier_id: responseBill.payload.supplier_id,
            company_id: company.id,
            user_id_created: user.id,
            currency_code:
              item.codMoneda === "PEN" ? TypeCurrency.PEN : TypeCurrency.USD,
            exchange_rate: selling,
            created_status: TypeStatusCreated.SUNAT,
          };

          const responseCreateCreditNote = await this.creditNoteService.create(
            formatDataCreditNote
          );

          if (responseCreateCreditNote.error) return responseBill;

          // [note] en este caso no necesitamos registrar los productos porque es una nota de credito, esta tiene unos items que debemos revisar

          const itemDocuments = item.lisDocumentosMod;

          await Promise.all(
            itemDocuments.map(async (itemD) => {
              const formatCreditNotedocument = {
                credit_note_id: responseCreateCreditNote.payload.id,
                issue_date: convertStringToDate(itemD.fecEmisionMod),
                code_type_document: itemD.codTipoCDPMod,
                num_serie: itemD.numSerieCDPMod,
                num_cpe: Number(itemD.numCDPMod),
              };
              const responseCreateCreditNoteDocument =
                await prisma.creditNoteDocuments.create({
                  data: formatCreditNotedocument,
                });

              const creditNoteDocument: CreditNoteDocuments =
                responseCreateCreditNoteDocument;

              const billCode =
                creditNoteDocument.num_serie + "-" + creditNoteDocument.num_cpe;

              const billInstance = await this.billService.findBillForCode(
                billCode
              );

              if (billInstance.error) return billInstance;

              await prisma.bill.update({
                where: { code },
                data: {
                  amount_paid: {
                    increment: Number(item.montos.mtoBIGravadaDG),
                  },
                  amount_pending: {
                    decrement: Number(item.montos.mtoBIGravadaDG),
                  },
                },
              });
            })
          );

          return this.responseService.SuccessResponse(
            "Sincronizacion realizada con exito, verifique los productos registrados"
          );
        }
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
    tokenFromHeader: string,
    selling: number
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

        let supplier: Supplier = responseSupplier.payload;
        if (responseSupplier.error && responseSupplier.statusCode === 404) {
          const formatDataSupplier: I_CreateSupplier = {
            business_direction: "",
            business_name: extractCompanyDetails(item.nomRazonSocialProveedor)
              .businessName,
            business_status: "ACTIVO",
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
          total: item.montos.mtoTotalCp || 0,
          amount_pending: 0,
          amount_paid: 0,
          period:
            item.perTributario.slice(0, 4) +
            "-" +
            item.perTributario.slice(4, 6),
          bill_status: TypeStatus.ACTIVO,
          bill_status_payment: TypeStatusPayment.CONTADO,
          supplier_id: supplier ? supplier.id : null,
          company_id: company.id,
          user_id_created: user.id,
          currency_code:
            item.codMoneda === "PEN" ? TypeCurrency.PEN : TypeCurrency.USD,
          exchange_rate: selling, //[error] evaluar esto, porque debe salir de la api de consulta ruc
          created_status: TypeStatusCreated.SUNAT,
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

        const response = await this.apiService.post(
          environments.BASE_API_QUERY,
          "v1/comprobante/detalle",
          formatFetchDetail
        );

        const products = response.data.informacionItems as I_ResponseDetail[];

        const createdProducts = await this.registerProductsInSynchronize(
          products,
          supplier,
          TypeDocument.TICKET,
          responseCreateTicket.payload.id
        );
        if (createdProducts?.error)
          return this.responseService.BadRequestException(
            "Error al registrar los productos, por favor verifique los campos"
          );
        return this.responseService.SuccessResponse(
          "Sincronizacion realizada con exito, verifique los productos registrados"
        );
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
            business_status: "ACTIVO",

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
          total: item.montos.mtoTotalCp || 0,
          amount_pending: 0,
          amount_paid: 0,
          period:
            item.perTributario.slice(0, 4) +
            "-" +
            item.perTributario.slice(4, 6),
          bill_status: TypeStatus.ACTIVO,
          bill_status_payment: TypeStatusPayment.CONTADO,
          supplier_id: supplier ? supplier.id : null,
          company_id: company.id,
          user_id_created: user.id,
          currency_code:
            item.codMoneda === "PEN" ? TypeCurrency.PEN : TypeCurrency.USD,
          exchange_rate: 0, //[error] evaluar esto, porque debe salir de la api de consulta ruc
          created_status: TypeStatusCreated.SUNAT,
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
