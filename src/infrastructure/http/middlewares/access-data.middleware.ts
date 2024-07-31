import { NextFunction, Request, Response } from "express";
import ResponseService from "../../../application/services/response.service";
import validator from "validator";
import { validateCredentialsDTO } from "./dto/access-data.dto";

class AccessDataMiddleware {
  private responseService: ResponseService;

  constructor() {
    this.responseService = new ResponseService();
  }

  validateCredentials = (
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) => {
    try {
      // [message] solo deberia pasar el ruc, la key y el user se recupera consultando el ruc
      // [message] Aqui se valida los campos que debes pasar por el header
      const ruc = request.get("ruc") as string;
      const token = request.get("Authorization") as string;

      // const key = request.get("key");
      // const user = request.get("user");

      const customError = this.responseService.BadRequestException(
        "Error al validar las credenciales"
      );

      if (!validator.isNumeric(ruc))
        response.status(customError.statusCode).json(customError);

      const formatDataValidation = {
        ruc,
        token,
      };

      validateCredentialsDTO.parse(formatDataValidation);

      nextFunction();
    } catch (error) {
      const customError = this.responseService.BadRequestException(
        "Error al validar las credenciales",
        error
      );
      response.status(customError.statusCode).json(customError);
    }
  };
}

export default AccessDataMiddleware;
