import { Request, Response } from "express";
import BillService from "../services/bill.service";

class BillController {
  private billService: BillService;

  constructor() {
    this.billService = new BillService();
  }

  findAll = async (request: Request, response: Response) => {
    // filtro por periodo
    const period = parseInt(request.query.period as string);
    // filtro por mes
    const month = parseInt(request.query.month as string);

    const result = await this.billService.findAll(period, month);
    response.status(result.statusCode).json(result);
  };

  excelFindAll = (request: Request, response: Response) => {};
}

export default BillController;
