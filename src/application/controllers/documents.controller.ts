import { Request, Response } from "express";
import DocumentService from "../services/document.service";

class DocumentController {
  private documentService: DocumentService;

  constructor() {
    this.documentService = new DocumentService();
  }

  findAllAccumulated = async (request: Request, response: Response) => {
    const token = request.get("Authorization") as string;
    const ruc = request.get("ruc") as string;
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

  findAll = async (request: Request, response: Response) => {
    const token = request.get("Authorization") as string;
    const ruc = request.get("ruc") as string;
    const year = Number(request.query.year);
    const month = Number(request.query.month);
    const supplier_group_id = request.query.supplier_group_id as string;
    const filter = request.query.filter as string;

    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;

    const result = await this.documentService.findAll({
      params: {
        year,
        month,
        supplier_group_id,
        filter,
      },
      pagination: {
        page,
        limit,
      },
      header: { ruc, token },
    });
    response.status(result.statusCode).json(result);
  };

  findDetail = async (request: Request, response: Response) => {
    const token = request.get("Authorization") as string;
    const ruc = request.get("ruc") as string;
    const document_code = request.query.document_code as string;
    const document_id = Number(request.query.document_id);

    const result = await this.documentService.findDetail({
      params: {
        document_code,
        document_id,
      },
      header: { ruc, token },
    });
    response.status(result.statusCode).json(result);
  };
}

export default DocumentController;
