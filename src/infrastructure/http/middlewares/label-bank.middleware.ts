import { NextFunction, Request, Response } from "express";
import ResponseService from "../../../application/services/response.service";
import {
  createBankDTO,
  createLabelDTO,
  editBankDTO,
  editLabelDTO,
} from "./dto/label-bank.dto";

class Label_Bank_Middleware {
  private responseService: ResponseService;

  constructor() {
    this.responseService = new ResponseService();
  }

  createBank = (
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) => {
    try {
      const data = request.body;

      createBankDTO.parse(data);
      nextFunction();
    } catch (error) {
      const customError = this.responseService.BadRequestException(
        "Error al validar los campos",
        error
      );
      response.status(customError.statusCode).json(customError);
    }
  };

  createLabel = (
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) => {
    try {
      const data = request.body;

      createLabelDTO.parse(data);
      nextFunction();
    } catch (error) {
      const customError = this.responseService.BadRequestException(
        "Error al validar los campos",
        error
      );
      response.status(customError.statusCode).json(customError);
    }
  };

  editBank = (
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) => {
    try {
      const data = request.body;

      editBankDTO.parse(data);
      nextFunction();
    } catch (error) {
      const customError = this.responseService.BadRequestException(
        "Error al validar los campos",
        error
      );
      response.status(customError.statusCode).json(customError);
    }
  };

  editLabel = (
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) => {
    try {
      const data = request.body;

      editLabelDTO.parse(data);
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

export default Label_Bank_Middleware;
