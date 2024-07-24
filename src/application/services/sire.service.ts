import { environments } from "../../infrastructure/config/environments.constant";
import ApiService from "./api.service";
import ResponseService from "./response.service";
import SunatService from "./sunat.service";

class SireService {
  private responseService: ResponseService;
  private apiService: ApiService;
  private sunatService: SunatService;

  constructor() {
    this.responseService = new ResponseService();
    this.apiService = new ApiService();
    this.sunatService = new SunatService();
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
}

export default SireService;
