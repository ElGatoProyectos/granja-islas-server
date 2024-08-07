import { NextFunction, Request, Response } from "express";
import ResponseService from "../../../application/services/response.service";

class DocumentMiddleware {
  private responseService: ResponseService = new ResponseService();
  constructor() {}

  validateFindDetail = async (
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) => {
    try {
      const document_code = request.query.document_code as string;
      const document_id = Number(request.query.document_id);
      if (!document_code || !document_id) {
        const cutomError = this.responseService.BadRequestException(
          "Error al validar parametros"
        );
        response.status(cutomError.statusCode).json(cutomError);
      } else {
        nextFunction();
      }
    } catch (error) {
      const cutomError = this.responseService.BadRequestException(
        "Error al validar parametros"
      );
      response.status(cutomError.statusCode).json(cutomError);
    }
  };
}

export default DocumentMiddleware;
