import { environments } from "../../infrastructure/config/environments.constant";
import ApiService from "./api.service";
import ResponseService from "./response.service";
import SunatSecurityService from "./sunat-security.service";
import { T_Config } from "./sunat.service";
const base_api_query = environments.BASE_API_QUERY;

class SireService {
  private responseService: ResponseService;
  private apiService: ApiService;
  private sunatSecurityService: SunatSecurityService;

  constructor() {
    this.responseService = new ResponseService();
    this.apiService = new ApiService();
    this.sunatSecurityService = new SunatSecurityService();
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

      const responseToken = await this.captureTokenSecurity();
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

  captureTokenSecurity = async () => {
    try {
      const data = {
        grant_type: "password",
        scope: "https://api-cpe.sunat.gob.pe",
        client_id: environments.CLIENT_ID,
        client_secret: environments.CLIENT_SECRET,
        username: environments.USERNAME_SUNAT,
        password: environments.PASSWORD_SUNAT,
      };
      const response = await this.apiService.post_x_www_urlencoded(
        environments.BASE_API_GET_TOKEN,
        data
      );
      return this.responseService.SuccessResponse("", response.data);
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  captureDataSire = async (config: T_Config) => {
    try {
      const responseToken = await this.captureTokenSecurity();
      if (responseToken.error) return responseToken;
      const headers = {
        Authorization: "Bearer " + responseToken.payload.access_token,
      };
      const response = await this.apiService.post(
        base_api_query,
        "api/v1/comprobantes/detalle",
        config,
        headers
      );

      return this.responseService.SuccessResponse(undefined, response.data);
    } catch (error) {
      error;
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };
}

export default SireService;
