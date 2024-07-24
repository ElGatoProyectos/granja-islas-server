import { NextFunction, Request, Response } from "express";
import ResponseService from "../../../application/services/response.service";
import { createUserDTO, editUserDTO } from "./dto/user.dto";

class UserMiddleware {
  private responseService: ResponseService = new ResponseService();

  validateBodyCreate = (
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) => {
    try {
      createUserDTO.parse(request.body);
      nextFunction();
    } catch (error) {
      const customError = this.responseService.BadRequestException(
        "Error al validar campos",
        error
      );
      response.status(customError.statusCode).json(customError);
    }
  };

  validateBodyEdit = (
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) => {
    try {
      editUserDTO.parse(request.body);
      nextFunction();
    } catch (error) {
      const customError = this.responseService.BadRequestException(
        "Error al validar campos",
        error
      );
      response.status(customError.statusCode).json(customError);
    }
  };
}

export default UserMiddleware;
