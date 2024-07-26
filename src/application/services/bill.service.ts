import prisma from "../../infrastructure/database/prisma";
import { I_CreateBill } from "../models/interfaces/bill.interface";
import AuthService from "./auth.service";
import CompanyService from "./company.service";
import ResponseService from "./response.service";

class BillService {
  private responseService: ResponseService;
  private authService: AuthService;
  private companyService: CompanyService;

  constructor() {
    this.responseService = new ResponseService();
    this.authService = new AuthService();
    this.companyService = new CompanyService();
  }

  findBillForCode = async (code: string) => {
    try {
      const bill = await prisma.bill.findFirst({ where: { code } });
      if (!bill)
        return this.responseService.NotFoundException(
          "Comprobante no encontrado"
        );
      return this.responseService.SuccessResponse(
        "Comprobante encontrado",
        bill
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    } finally {
      prisma.$disconnect();
    }
  };

  findAll = async (period: number, month: number) => {
    try {
      let bills;

      if (period && !month) {
      } else if (month && !period) {
      } else if (period && month) {
      }

      return this.responseService.SuccessResponse("Lista de facturas", bills);
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  create = async (data: I_CreateBill, rucFromHeader: string) => {
    try {
      const responseCompany = await this.companyService.findByRuc(
        rucFromHeader
      );
      if (responseCompany.error) return responseCompany;

      const created = await prisma.bill.create({ data });
      return this.responseService.CreatedResponse(
        "Comprobante creado",
        created
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };
}
export default BillService;
