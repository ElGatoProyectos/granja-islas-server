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

  captureData = async (request: Request, response: Response) => {
    // necesitamos capturar todos los detalles y validarlo con los proveedores y facturas, en conclusion, primero registrar la factura y luego lo demas
  };

  excelFindAll = (request: Request, response: Response) => {};
}

export default BillController;
