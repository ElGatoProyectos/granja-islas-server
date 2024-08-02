import { Request, Response } from "express";
import SunatService, { T_DataSynchronize } from "../services/sunat.service";

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

  testDocuments = async (request: Request, response: Response) => {
    const token = request.get("Authorization") as string;
    const ruc = request.get("ruc") as string;

    // const result = await this.sunatService.findDocuments(ruc, token);
    response.status(200).json({});
  };

  synchronizeDataWithDatabase = async (
    request: Request,
    response: Response
  ) => {
    const token = request.get("Authorization") as string;
    const ruc = request.get("ruc") as string;

    const data = request.body as T_DataSynchronize;

    // [message] esto podria venir dinamicamente de un formulario
    //   {
    //     "period": "2024-06",
    //     "page": "1",
    //     "perPage": 100
    // }

    const result = await this.sunatService.synchronizeDataWithDatabase(
      data,
      ruc,
      token
    );

    response.status(result.statusCode).json(result);
  };
}

export default SunatController;
