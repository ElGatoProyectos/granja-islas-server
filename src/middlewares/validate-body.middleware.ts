import { NextFunction, Request, Response } from "express";
import { authDTO } from "./dto/auth.dto";
import { responseService } from "../services/response.service";

class ValidateMiddleware {
  async validateAuth(
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) {
    try {
      authDTO.parse(request.body);
      nextFunction();
    } catch (error) {
      return responseService.BadRequestException(
        "Error al procesar la información"
      );
    }
  }
}

export const validateMiddleware = new ValidateMiddleware();
