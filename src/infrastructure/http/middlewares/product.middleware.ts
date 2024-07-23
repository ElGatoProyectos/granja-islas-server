import { NextFunction, Request, Response } from "express";
import ResponseService from "../../../application/services/response.service";
import { createProductDTO } from "./dto/product.dto";

class ProductMiddleware {
  private responseService: ResponseService;

  constructor() {
    this.responseService = new ResponseService();
  }

  validateBody = (
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) => {
    try {
      createProductDTO.parse(request.body);
      nextFunction();
    } catch (error) {
      const customError = this.responseService.BadRequestException(
        "Erro al validar producto"
      );
      response.status(customError.statusCode).json(customError);
    }
  };
}

export default ProductMiddleware;
