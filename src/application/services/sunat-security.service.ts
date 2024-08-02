import { Company, User } from "@prisma/client";
import { environments } from "../../infrastructure/config/environments.constant";
import ApiService from "./api.service";
import InfoService from "./info.service";
import ResponseService from "./response.service";

const base_api_query = environments.BASE_API_QUERY;

class SunatSecurityService {
  private apiService: ApiService;
  private responseService: ResponseService;
  private infoService: InfoService;

  constructor() {
    this.apiService = new ApiService();
    this.responseService = new ResponseService();
    this.infoService = new InfoService();
  }

  captureTokenSecurity = async (
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

      // [note] por ahora sacaremos de frente la data de la base de datos, pero es recomendable que se encripte

      const data = {
        grant_type: "client_credentials",
        scope: "https://api.sunat.gob.pe/v1/contribuyente/contribuyentes",
        client_id: company.client_id,
        client_secret: company.client_secret,
        // username: company.user,
        // password: company.key,
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

export default SunatSecurityService;
