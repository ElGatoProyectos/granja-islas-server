import ResponseService from "./response.service";

class VoucherService {
  private responseService: ResponseService;

  constructor() {
    this.responseService = new ResponseService();
  }

  async registerVoucher(typeFile: string, data: any) {
    try {
    } catch (error) {
      this.responseService.InternalServerErrorException();
    }
  }
}

export default VoucherService;
