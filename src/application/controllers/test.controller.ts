import { Request, Response } from "express";
import SunatService from "../services/sunat.service";
import SireService from "../services/sire.service";

class TestController {
  private sunatService: SunatService;
  private sireService: SireService;

  constructor() {
    this.sunatService = new SunatService();
    this.sireService = new SireService();
  }

  // método para testear la carga automática
  testSire = async (request: Request, response: Response) => {
    const data = request.body;
    data;
    const result = await this.sireService.captureDataSire(data);

    response.status(result.statusCode).json(result);
  };
}

export default TestController;
