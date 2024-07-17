import ResponseService from "./response.service";

class BillService {
  private responseService: ResponseService;

  constructor() {
    this.responseService = new ResponseService();
  }
  async searchBillForCode(code: string) {
    try {
    } catch (error) {
      return this.responseService.InternalServerErrorException();
    }
  }
}

export const billService = new BillService();
