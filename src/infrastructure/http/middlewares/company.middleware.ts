import { NextFunction, Request, Response } from "express";
import { createCompanyDTO, registerImageSchema } from "./dto/company.dto";
import ResponseService from "../../../application/services/response.service";
import validator from "validator";
import UserService from "../../../application/services/user.service";
import CompanyService from "../../../application/services/company.service";

class CompanyMiddleware {
  private responseService: ResponseService;
  private userService: UserService;
  private companyService: CompanyService;

  constructor() {
    this.responseService = new ResponseService();
    this.userService = new UserService();
    this.companyService = new CompanyService();
  }

  generateBadRequestException = (message: string) => {
    return this.responseService.BadRequestException(message);
  };

  //todo también validamos el id
  validateCompany = async (
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) => {
    try {
      const customError = this.generateBadRequestException(
        "Error al validar empresa"
      );
      if (!validator.isNumeric(request.params.id)) {
        response.status(customError.statusCode).json(customError);
      } else {
        const company = await this.companyService.findById(
          Number(request.params.id)
        );
        if (company.error) {
          response.status(customError.statusCode).json(customError);
        } else {
          nextFunction();
        }
      }
    } catch (error) {
      const customError = this.responseService.BadRequestException(
        "Error al validar empresa",
        error
      );
      response.status(customError.statusCode).json(customError);
    }
  };

  validateCreate = async (
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) => {
    try {
      createCompanyDTO.parse(request.body);
      nextFunction();
    } catch (error) {
      const customError = this.responseService.BadRequestException(
        "Error al validar campos",
        error
      );
      response.status(customError.statusCode).json(customError);
    }
  };

  validateUpdate = async (
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) => {
    try {
      createCompanyDTO.parse(request.body);
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

export default CompanyMiddleware;
