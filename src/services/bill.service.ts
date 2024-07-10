import { responseService } from "./response.service";

class BillService {
  async searchBillForCode(code: string) {
    try {
    } catch (error) {
      return responseService.InternalServerErrorException();
    }
  }
}

export const billService = new BillService();
