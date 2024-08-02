import "dotenv/config";
import { environments } from "../../infrastructure/config/environments.constant";
import ApiService from "./api.service";
import ResponseService from "./response.service";
const base_api_sunat = environments.BASE_API_SUNAT;
const base_api_query = environments.BASE_API_QUERY;

export type T_Config = {
  type: string;
  payment_type: string;
  ruc: number;
  serie: string;
  number: number;
};

class SunatService {
  private base_api_query_module = "v1/consulta-ruc";

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
      console.log(response.data);
      const data = response.data;

      const destructString = data.razon_social.split(" ");

      destructString.pop();

      const companyName = destructString.join(" ");

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
        business_name: companyName || "",
        business_type: destructString[destructString.length - 1] || "",
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
      console.log(error);
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

  //- Por aquí deberían pasar todas las credenciales, client_id, client_secret, username, password
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
