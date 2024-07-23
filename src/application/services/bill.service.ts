import ResponseService from "./response.service";

class BillService {
  private responseService: ResponseService;

  constructor() {
    this.responseService = new ResponseService();
  }

  searchBillForCode = async (code: string) => {
    try {
    } catch (error) {
      return this.responseService.InternalServerErrorException();
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
