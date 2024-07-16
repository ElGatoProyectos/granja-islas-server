import ResponseService from "./response.service";

class SireService {
  private responseService: ResponseService;

  constructor() {
    this.responseService = new ResponseService();
  }

  captureData = async () => {
    try {
      return this.responseService.SuccessResponse();
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };
}

export default SireService;
