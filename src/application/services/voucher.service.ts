import ResponseService from "./response.service";

export default class VoucherService extends ResponseService {
  constructor() {
    super();
  }

  async registerVoucher(typeFile: string, data: any) {
    try {
    } catch (error) {
      this.InternalServerErrorException();
    }
  }
}
