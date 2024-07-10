import "dotenv/config";
import { environments } from "../models/constants/environments.constant";
import { responseService } from "./response.service";
import { apiService } from "./api.service";
export const base_api_sunat = environments.BASE_API_SUNAT;
export const base_api_query_ruc = environments.BASE_API_QUERY_RUC;

class SunatService {
  private base_api_query_ruc_module = "ruc";
  async queryForRuc(ruc: string) {
    try {
      const { data } = await apiService.getParam(
        base_api_query_ruc,
        this.base_api_query_ruc_module,
        ruc
      );

      return responseService.SuccessResponse("Datos de usuario", data);
    } catch (error) {
      return responseService.InternalServerErrorException();
    }
  }

  async findBills(ruc: string, key: string) {
    try {
      const response = await apiService.post("", "", {});
    } catch (error) {
      return responseService.InternalServerErrorException();
    }
  }
}

export const sunatService = new SunatService();
