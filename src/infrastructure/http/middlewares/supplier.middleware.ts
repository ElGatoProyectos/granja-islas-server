import { NextFunction, Request, Response } from "express";
import { createSupplierDTo } from "./dto/supplier.dto";
import ResponseService from "../../../application/services/response.service";

class SupplierMiddleware {
  private responseService: ResponseService = new ResponseService();

  validateBody = (
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) => {
    try {
      createSupplierDTo.parse(request.body);
      nextFunction();
    } catch (error) {
      const customError = this.responseService.BadRequestException(
        "Error al validar esquema",
        error
      );
      response.status(customError.statusCode).json(customError);
    }
  };
}

export default SupplierMiddleware;
