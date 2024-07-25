import prisma from "../../infrastructure/database/prisma";
import ResponseService from "./response.service";

class BillService {
  private responseService: ResponseService;

  constructor() {
    this.responseService = new ResponseService();
  }

  searchBillForCode = async (code: string) => {
    try {
      const bills = await prisma.bill.findFirst({ where: { code } });
    } catch (error) {
      return this.responseService.InternalServerErrorException();
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
      return this.responseService.InternalServerErrorException();
    }
  };

  findByCodCpe = async (code: string) => {};
}
export default BillService;
