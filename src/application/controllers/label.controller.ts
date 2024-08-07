import { Request, Response } from "express";
import ProductLabelService from "../services/product-label.service";

class LabelController {
  private labelService: ProductLabelService;

  constructor() {
    this.labelService = new ProductLabelService();
  }

  findAllWithDeleted = async (request: Request, response: Response) => {
    const ruc = request.get("ruc") as string;
    const token = request.get("Authorization") as string;
    const result = await this.labelService.findAllWithDeleted(ruc, token);
    response.status(result.statusCode).json(result);
  };

  findAll = async (request: Request, response: Response) => {
    const ruc = request.get("ruc") as string;
    const token = request.get("Authorization") as string;
    const result = await this.labelService.findAll(ruc, token);
    response.status(result.statusCode).json(result);
  };

  findById = async (request: Request, response: Response) => {
    const ruc = request.get("ruc") as string;
    const token = request.get("Authorization") as string;
    const id = Number(request.params.id);
    const result = await this.labelService.findById(id, ruc, token);
    response.status(result.statusCode).json(result);
  };

  create = async (request: Request, response: Response) => {
    const ruc = request.get("ruc") as string;
    const token = request.get("Authorization") as string;
    const data = request.body;
    const result = await this.labelService.createLabel(data, ruc, token);
    response.status(result.statusCode).json(result);
  };

  editById = async (request: Request, response: Response) => {
    const ruc = request.get("ruc") as string;
    const token = request.get("Authorization") as string;
    const data = request.body;
    const id = Number(request.params.id);

    const result = await this.labelService.updateLabel(data, id, ruc, token);
    response.status(result.statusCode).json(result);
  };

  deleteById = async (request: Request, response: Response) => {
    const ruc = request.get("ruc") as string;
    const token = request.get("Authorization") as string;
    const id = Number(request.params.id);

    const result = await this.labelService.deleteById(id, ruc, token);
    response.status(result.statusCode).json(result);
  };

  findDocuments = async (request: Request, response: Response) => {
    const ruc = request.get("ruc") as string;
    const token = request.get("Authorization") as string;
    const id = Number(request.params.id);
    const year = Number(request.query.year);
    const month = Number(request.query.month);
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 20;
    const supplier_group_id = request.query.supplier_group_id as string;

    const format = {
      params: {
        product_label_id: id,
        year,
        month,
        supplier_group_id,
      },
      pagination: {
        page,
        limit,
      },
      headers: {
        ruc,
        token,
      },
    };

    const result = await this.labelService.findDocuments(format);
    response.status(result.statusCode).json(result);
  };
}

export default LabelController;
