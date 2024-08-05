import { Request, Response } from "express";
import DocumentService from "../services/document.service";

class DocumentController {
  private documentService: DocumentService;

  constructor() {
    this.documentService = new DocumentService();
  }

  findAll = async (request: Request, response: Response) => {
    const token = request.get("Authorization") as string;
    const ruc = request.get("Ruc") as string;
    const year = Number(request.get("month"));
    const month = Number(request.get("month"));

    const result = await this.documentService.findAllByAccumulated({
      params: {
        year,
        month,
      },
      header: { ruc, token },
    });
    response.status(result.statusCode).json(result);
  };
}

export default DocumentController;
