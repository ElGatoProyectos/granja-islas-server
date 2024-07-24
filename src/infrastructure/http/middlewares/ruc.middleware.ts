import { NextFunction, Request, Response } from "express";
import ResponseService from "../../../application/services/response.service";
import { validateRuc } from "./dto/company.dto";
import validator from "validator";

/**
 * Validador para el ruc, este tiene que pasar el ruc para consultar facturas, vouchers, etc...
 */
class RucMiddleware {
  private responseService: ResponseService = new ResponseService();

  validateRuc = (
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) => {
    try {
      const ruc = request.get("ruc");

      const customError = this.responseService.BadRequestException(
        "Error al solicitar la información"
      );

      if (!ruc) response.status(customError.statusCode).json(customError);
      else {
        validateRuc.parse({ ruc });

        if (!validator.isNumeric(ruc))
          response.status(customError.statusCode).json(customError);

        nextFunction();
      }
    } catch (error) {
      const customError = this.responseService.BadRequestException(
        "Error al traer la información",
        error
      );
      response.status(customError.statusCode).json(customError);
    }
  };
}

export default RucMiddleware;
