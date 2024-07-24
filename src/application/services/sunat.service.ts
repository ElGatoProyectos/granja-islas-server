import "dotenv/config";
import { environments } from "../../infrastructure/config/environments.constant";
import ApiService from "./api.service";
import ResponseService from "./response.service";
const base_api_sunat = environments.BASE_API_SUNAT;
const base_api_query = environments.BASE_API_QUERY;

class SunatService {
  private base_api_query_module = "ruc";
  private responseService: ResponseService;
  private apiService: ApiService;

  constructor() {
    this.responseService = new ResponseService();
    this.apiService = new ApiService();
  }

  queryForRuc = async (ruc: string) => {
    try {
      const { data: response } = await this.apiService.getParam(
        base_api_query,
        this.base_api_query_module,
        ruc
      );
      const data = response.data;

      const formatData = {
        ruc: data.ruc.split("-")[0].trim(),
        business_name: data.nombre_comercial,
        business_type: data.tipo_contribuyente,
        business_status: data.estado_contribuyente,
        business_direction_fiscal: data.domicilio_fiscal,
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
}

export default SunatService;
