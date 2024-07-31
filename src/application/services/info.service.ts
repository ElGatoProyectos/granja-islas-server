import AuthService from "./auth.service";
import CompanyService from "./company.service";
import ResponseService from "./response.service";

class InfoService {
  private responseService: ResponseService;
  private companyService: CompanyService;
  private authService: AuthService;

  constructor() {
    this.responseService = new ResponseService();
    this.authService = new AuthService();
    this.companyService = new CompanyService();
  }

  getCompany = async (ruc: string) => {
    try {
      const responseCompany = await this.companyService.findByRuc(ruc);

      if (responseCompany.error)
        return this.responseService.NotFoundException(
          "Error al validar empresa"
        );
      return this.responseService.SuccessResponse(
        undefined,
        responseCompany.payload
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  getCompanyAndUser = async (token: string, ruc: string) => {
    try {
      const responseGetUser = await this.authService.getUserForToken(token);
      if (responseGetUser.error) return responseGetUser;

      const responseCompany = await this.getCompany(ruc);
      if (responseCompany.error) return responseCompany;

      return this.responseService.SuccessResponse(undefined, {
        user: responseGetUser.payload,
        company: responseCompany.payload,
      });
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };
}

export default InfoService;
