import { NextFunction, Request, Response } from "express";
import ResponseService from "../../../application/services/response.service";
import { validateRuc } from "./dto/company.dto";
import validator from "validator";

/**
 * Validador para el ruc, este tiene que pasar el ruc para consultar facturas, vouchers, etc...
 */
class RucMiddleware {
  private responseService: ResponseService = new ResponseService();

  private customError = this.responseService.BadRequestException(
    "Error al traer la información"
  );

  validateRuc = (
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) => {
    try {
      const ruc = request.get("ruc");

      if (!ruc)
        response.status(this.customError.statusCode).json(this.customError);
      else {
        validateRuc.parse({ ruc });

        if (!validator.isNumeric(ruc))
          response.status(this.customError.statusCode).json(this.customError);

        nextFunction();
      }
    } catch (error) {
      response.status(this.customError.statusCode).json(this.customError);
    }
  };
}

export default RucMiddleware;
