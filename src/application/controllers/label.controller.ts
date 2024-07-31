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
}

export default LabelController;
