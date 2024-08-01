import { NextFunction, Request, Response } from "express";
import ResponseService from "../../../application/services/response.service";
import { createBillDTO, getBillsDTO } from "./dto/bill.dto";

class BillMiddleware {
  private responseService: ResponseService;

  constructor() {
    this.responseService = new ResponseService();
  }

  create = (
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) => {
    try {
      const body = request.body;
      createBillDTO.parse(body);
      nextFunction();
    } catch (error) {
      const customError = this.responseService.BadRequestException(
        "Error al validar el formato",
        error
      );
      response.status(customError.statusCode).json(customError);
    }
  };

  findAll = (
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) => {
    try {
      const body = request.body;
      getBillsDTO.parse(body);
      nextFunction();
    } catch (error) {
      const customError = this.responseService.BadRequestException(
        "Error al validar el formato",
        error
      );
      response.status(customError.statusCode).json(customError);
    }
  };
}

export default BillMiddleware;
