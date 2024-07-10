import prisma from "../prisma";
import { responseService } from "./response.service";

class CompanyService {
  async findCompanies() {
    try {
      const companies = await prisma.company.findMany();
      return responseService.SuccessResponse("Listado de empresas", companies);
    } catch (error) {
      return responseService.InternalServerErrorException();
    }
  }

  async findOneCompany(companyId: number) {
    try {
      const company = await prisma.company.findFirst({
        where: { id: companyId },
      });
      if (!company)
        return responseService.NotFoundException("Empresa no encontrada");
      return responseService.SuccessResponse(
        "Empresa encontrada con éxito",
        company
      );
    } catch (error) {
      return responseService.InternalServerErrorException();
    }
  }
}

export const companyService = new CompanyService();
