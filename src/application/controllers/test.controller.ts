import { Request, Response } from "express";
import SunatService from "../services/sunat.service";

class TestController {
  private sunatService: SunatService;

  constructor() {
    this.sunatService = new SunatService();
  }

  // método para testear la carga automática
  testSire = async (request: Request, response: Response) => {
    const data = request.body;
    console.log(data);
    const result = await this.sunatService.captureDataSire(data);

    response.status(result.statusCode).json(result);
  };
}

export default TestController;
