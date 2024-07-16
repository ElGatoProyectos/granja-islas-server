import { Request, Response } from "express";
import SireService from "../services/sire.service";

class SireController {
  private sireService: SireService;

  constructor() {
    this.sireService = new SireService();
  }

  captureDate = async (request: Request, response: Response) => {
    const result = await this.sireService.captureData();
    response.status(result.statusCode).json(result);
  };
}

export default SireController;
