import { Request, Response } from "express";
import BillService from "../services/bill.service";

class BillController {
  private billService: BillService;

  constructor() {
    this.billService = new BillService();
  }

  findAll = async (request: Request, response: Response) => {
    const body = request.body;

    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;

    const token = request.get("Authorization") as string;
    const ruc = request.get("ruc") as string;

    const format = {
      body,
      pagination: {
        page,
        limit,
      },
      header: {
        token,
        ruc,
      },
    };

    const result = await this.billService.findAll({ ...format });
    response.status(result.statusCode).json(result);
  };

  captureData = async (request: Request, response: Response) => {
    // necesitamos capturar todos los detalles y validarlo con los proveedores y facturas, en conclusion, primero registrar la factura y luego lo demas
  };

  //[message] este controlador simulara el registro manual de una factura
  create = async (request: Request, response: Response) => {
    const data = request.body;
    const token = request.get("Authorization") as string;
    const ruc = request.get("ruc") as string;
    const result = await this.billService.create(data, ruc, token);
    response.status(result.statusCode).json(result);
  };

  excelFindAll = async (request: Request, response: Response) => {};
}

export default BillController;
