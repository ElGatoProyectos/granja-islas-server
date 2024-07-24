import { Request, Response } from "express";
import SireService from "../services/sire.service";

class SireController {
  private sireService: SireService;

  constructor() {
    this.sireService = new SireService();
  }

  captureDate = async (request: Request, response: Response) => {
    // codTipoOpe=3&page=1&perPage=100

    const codTipoOpe = parseInt(request.query.codTipoOpe as string);
    const page = parseInt(request.query.page as string);
    const perPage = parseInt(request.query.perPage as string);

    const result = await this.sireService.getBills();
    response.status(result.statusCode).json(result);
  };
}

export default SireController;
