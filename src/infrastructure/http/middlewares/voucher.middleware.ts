import { NextFunction, Request, Response } from "express";
import { registerVoucherDTO, updateVoucherDTO } from "./dto/voucher.dto";
import ResponseService from "../../../application/services/response.service";
import validator from "validator";

class VoucherMiddleware {
  private responseService = new ResponseService();

  validateBody = (
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) => {
    try {
      const data = request.body;
      registerVoucherDTO.parse(data);
      nextFunction();
    } catch (error) {
      const customError = this.responseService.BadRequestException(
        "Error al validar campos",
        error
      );
      response.status(customError.statusCode).json(customError);
    }
  };

  validateUpdate = (
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) => {
    try {
      const bill_id = request.params.bill_id;
      const voucher_id = request.params.voucher_id;
      const data = request.body;

      updateVoucherDTO.parse(data);

      if (validator.isNumeric(voucher_id) && validator.isNumeric(bill_id)) {
        nextFunction();
      } else {
        throw new Error("Parametros no reconocidos");
      }
    } catch (error) {
      const customError = this.responseService.BadRequestException(
        "Error al validar campos",
        error
      );
      response.status(customError.statusCode).json(customError);
    }
  };
}

export default VoucherMiddleware;
