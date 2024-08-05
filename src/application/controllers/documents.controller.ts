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
    console.log(request.get("year"));
    const year = Number(request.query.year);
    const month = Number(request.query.month);

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
