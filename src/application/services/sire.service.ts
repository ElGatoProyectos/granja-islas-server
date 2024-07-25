import { User } from "@prisma/client";
import { environments } from "../../infrastructure/config/environments.constant";
import ApiService from "./api.service";
import AuthService from "./auth.service";
import BillService from "./bill.service";
import ResponseService from "./response.service";
import SunatService, { T_Config } from "./sunat.service";
import SupplierService from "./supplier.service";

class SireService {
  private responseService: ResponseService;
  private apiService: ApiService;
  private sunatService: SunatService;
  private supplierService: SupplierService;
  private billService: BillService;
  private authService: AuthService;

  constructor() {
    this.responseService = new ResponseService();
    this.apiService = new ApiService();
    this.sunatService = new SunatService();
    this.supplierService = new SupplierService();
    this.billService = new BillService();
    this.authService = new AuthService();
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
      const responseToken = await this.authService.getUserForToken(token);
      if (responseToken.error) return responseToken;

      const user: User = responseToken.payload;

      // validamos a la empresa donde pertenece

      const { payload } = await this.sunatService.captureDataSire(data);

      const comprobantes = payload.comprobantes as any[];

      Promise.all(
        comprobantes.map(async (item) => {
          // validamos si el comprobante ya fue registrado
          const code = item.numSerie + item.numCpe;
          const responseBill = await this.billService.findBillForCode(code);

          if (responseBill.error && responseBill.statusCode === 404) {
            // si en caso no exista el proveedor para la empresa lo registramos
            const responseSupplier = await this.supplierService.findForRuc(
              item.datosEmisor.numRuc,
              rucFromHeader
            );
            if (responseSupplier.error && responseSupplier.statusCode === 404) {
              const formatDataSupplier = {};
            }

            // registrar comprobante

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
