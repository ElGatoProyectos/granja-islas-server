import prisma from "../../infrastructure/database/prisma";
import ResponseService from "./response.service";

class BillService {
  private responseService: ResponseService;

  constructor() {
    this.responseService = new ResponseService();
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
}
export default BillService;
