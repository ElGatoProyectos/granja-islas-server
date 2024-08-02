import { Request, Response } from "express";
import SunatService from "../services/sunat.service";

class SunatController {
  private sunatService: SunatService;

  constructor() {
    this.sunatService = new SunatService();
  }

  queryForRuc = async (request: Request, response: Response) => {
    console.log("hereee");
    const ruc = request.params.ruc;

    console.log(ruc);
    const result = await this.sunatService.queryForRuc(ruc);
    console.log(result);
    response.status(result.statusCode).json(result);
  };
}

export default SunatController;
