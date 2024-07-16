import { NextFunction, Request, Response } from "express";
import validator from "validator";
import ResponseService from "../../../application/services/response.service";

class SunatMiddleware {
  private responseService: ResponseService;

  constructor() {
    this.responseService = new ResponseService();
  }

  validateParamRuc = (
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) => {
    const ruc = request.params.ruc;

    if (!validator.isNumeric(ruc) || ruc.length !== 11) {
      const customError = this.responseService.BadRequestException(
        "Error al validar formato ruc"
      );
      response.status(customError.statusCode).json(customError);
    } else {
      nextFunction();
    }
  };
}

export default SunatMiddleware;
