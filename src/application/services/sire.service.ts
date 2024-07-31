import { Company, Supplier, User } from "@prisma/client";
import { environments } from "../../infrastructure/config/environments.constant";
import ApiService from "./api.service";
import AuthService from "./auth.service";
import BillService from "./bill.service";
import ResponseService from "./response.service";
import SunatService, { T_Config } from "./sunat.service";
import SupplierService from "./supplier.service";
import prisma from "../../infrastructure/database/prisma";
import InfoService from "./info.service";
import { I_CreateSupplier } from "../models/interfaces/supplier.interface";
import { I_CreateBill } from "../models/interfaces/bill.interface";
import { I_ItemsBill } from "../models/interfaces/company.interface";
import { I_CreateProduct } from "../models/interfaces/product.interface";
import slugify from "slugify";
import ProductService from "./product.service";
import { convertToDate } from "../../infrastructure/utils/convert-to-date";

class SireService {
  private responseService: ResponseService;
  private apiService: ApiService;
  private sunatService: SunatService;
  private supplierService: SupplierService;
  private billService: BillService;
  private authService: AuthService;
  private infoService: InfoService;
  private productService: ProductService;

  constructor() {
    this.responseService = new ResponseService();
    this.apiService = new ApiService();
    this.sunatService = new SunatService();
    this.supplierService = new SupplierService();
    this.billService = new BillService();
    this.authService = new AuthService();
    this.infoService = new InfoService();
    this.productService = new ProductService();
  }

  captureData = async () => {
    try {
      return this.responseService.SuccessResponse();
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  //[message]
  getBills = async () => {
    try {
      const queryParams = "?codTipoOpe=3&page=1&perPage=100";
      const path = environments.BASE_API_SIRE + queryParams;

      const responseToken = await this.sunatService.captureTokenSecurity();
      if (responseToken.error) return responseToken;
      const response = await this.apiService.getWAuthorization(
        environments.BASE_API_SIRE + queryParams,
        responseToken.payload.access_token
      );
      return this.responseService.SuccessResponse(
        "Listado de facturas",
        response.data
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  //[message] metodo para sincronizar la data con la de sunat
  synchronizeDataWithDatabase = async (
    data: T_Config,
    rucFromHeader: string,
    token: string
  ) => {
    try {
      // Validamos a la empresa y al usuario donde pertenece
      const responseInfo = await this.infoService.getCompanyAndUser(
        token,
        rucFromHeader
      );

      if (responseInfo.error) return responseInfo;

      const { company, user }: { company: Company; user: User } =
        responseInfo.payload;

      // Traemos los datos
      const { payload } = await this.sunatService.captureDataSire(data);

      const comprobantes = payload.comprobantes as any[];

      let numberActions = 0;

      await Promise.all(
        comprobantes.map(async (item) => {
          // Validamos si el comprobante ya fue registrado
          const code = item.numSerie + item.numCpe;
          const responseBill = await this.billService.findBillForCode(code);

          if (responseBill.error && responseBill.statusCode === 404) {
            // Si en caso no exista el proveedor para la empresa lo registramos
            const responseSupplier = await this.supplierService.findForRuc(
              item.datosEmisor.numRuc,
              rucFromHeader
            );

            let supplier: Supplier | null = null;
            if (responseSupplier.error && responseSupplier.statusCode === 404) {
              const formatDataSupplier: I_CreateSupplier = {
                business_direction: "",
                business_name: item.datosEmisor.desRazonSocialEmis,
                business_status: "",
                business_type: "",
                company_id: company.id,
                description: "",
                ruc: item.datosEmisor.numRuc,
                user_id_created: user.id,
              };

              const responseCreateSupplier = await this.supplierService.create(
                formatDataSupplier,
                token,
                rucFromHeader
              );

              if (responseCreateSupplier.error) return responseCreateSupplier;
              supplier = responseCreateSupplier.payload as Supplier;
              numberActions++;
            }

            // Registrar comprobante

            const formatDataBill: I_CreateBill = {
              num_serie: item.numSerie,
              num_cpe: item.numCpe,
              code,
              date: convertToDate(item.fecEmision),
              igv: item.procedenciaMasiva.mtoSumIGV,
              total: item.procedenciaMasiva.mtoImporteTotal,
              earring: 0,
              paid: 0,
              period: "",
              bill_status: "",
              supplier_id: supplier ? supplier.id : null,
              company_id: company.id,
              user_id_created: user.id,
            };

            const responseCreateBill = await this.billService.create(
              formatDataBill,
              rucFromHeader
            );

            if (responseCreateBill.error) return responseCreateBill;

            numberActions++;

            // Registrar productos
            const products = item.informacionItems as I_ItemsBill[];

            await Promise.all(
              products.map(async (product: I_ItemsBill) => {
                const slug = slugify(product.desItem, { lower: true });

                const formatProduct: I_CreateProduct = {
                  title: product.desItem,
                  amount: product.cntItems,
                  price: product.mtoValUnitario,
                  slug,
                  supplier_id: supplier ? supplier.id : null,
                  description: "",
                  unit_measure: product.desUnidadMedida,
                  code_measure: product.codUnidadMedida,
                };

                const responseCreateProduct = await this.productService.create(
                  formatProduct
                );

                console.log(responseCreateProduct);
                if (responseCreateProduct.error) return responseCreateProduct;
                numberActions++;
              })
            );
          }
        })
      );

      return this.responseService.SuccessResponse(
        `Actualización realizada con éxito, ${numberActions} operaciones realizadas`
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
}

export default SireService;
