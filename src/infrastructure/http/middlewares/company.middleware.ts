import { NextFunction, Request, Response } from "express";
import { createCompanyDTO } from "./dto/company.dto";
import ResponseService from "../../../application/services/response.service";
import validator from "validator";
import UserService from "../../../application/services/user.service";
import CompanyService from "../../../application/services/company.service";

class CompanyMiddleware {
  private responseService: ResponseService;
  private companyService: CompanyService;

  constructor() {
    this.responseService = new ResponseService();
    this.companyService = new CompanyService();
  }

  generateBadRequestException = (message: string) => {
    return this.responseService.BadRequestException(message);
  };

  //* success
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
}

export default CompanyMiddleware;
