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

class SireService {
  private responseService: ResponseService;
  private apiService: ApiService;
  private sunatService: SunatService;
  private supplierService: SupplierService;
  private billService: BillService;
  private authService: AuthService;
  private infoService: InfoService;

  constructor() {
    this.responseService = new ResponseService();
    this.apiService = new ApiService();
    this.sunatService = new SunatService();
    this.supplierService = new SupplierService();
    this.billService = new BillService();
    this.authService = new AuthService();
    this.infoService = new InfoService();
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

  synchronizeDataWithDatabase = async (
    data: T_Config,
    rucFromHeader: string,
    token: string
  ) => {
    try {
      // validamos al usuario
      const responseInfo = await this.infoService.getCompanyAndUser(
        token,
        rucFromHeader
      );

      if (responseInfo.error) return responseInfo;

      const { company, user }: { company: Company; user: User } =
        responseInfo.payload;

      // validamos a la empresa donde pertenece

      const { payload } = await this.sunatService.captureDataSire(data);

      const comprobantes = payload.comprobantes as any[];

      Promise.all(
        comprobantes.map(async (item) => {
          //- validamos si el comprobante ya fue registrado
          const code = item.numSerie + item.numCpe;
          const responseBill = await this.billService.findBillForCode(code);

          if (responseBill.error && responseBill.statusCode === 404) {
            //- si en caso no exista el proveedor para la empresa lo registramos
            const responseSupplier = await this.supplierService.findForRuc(
              item.datosEmisor.numRuc,
              rucFromHeader
            );

            let supplier: Supplier;
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
              supplier = responseCreateSupplier.payload;
            }

            //- registrar comprobante
            const formatDataBill: I_CreateBill = {
              num_serie: item.numSerie,
              num_cpe: item.num_cpe,
              code,
              date: item.fecEmision,
              igv: item.procedenciaMasiva.mtoSumIGV,
              total: item.procedenciaMasiva.mtoImporteTotal,
              earring: 0,
              paid: 0,
              period: "",
              bill_status: "",
              supplier_id: company.id,
            };

            // registrar productos
          }
        })
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };
}

export default SireService;
