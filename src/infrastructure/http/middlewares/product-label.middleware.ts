import { NextFunction, Request, Response } from "express";
import { assignLabel } from "./dto/product-label.dto";
import ResponseService from "../../../application/services/response.service";

class ProductLabelMiddleware {
  private responseService: ResponseService;

  constructor() {
    this.responseService = new ResponseService();
  }

  validateCreate = async (
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) => {
    try {
      assignLabel.parse(request.body);
      nextFunction();
    } catch (error) {
      const customError = this.responseService.BadRequestException(
        "Error al validar los campos",
        error
      );
      response.status(customError.statusCode).json(customError);
    }
  };
}

export default ProductLabelMiddleware;
