import { Request, Response } from "express";
import ProductLabelService from "../services/product-label.service";

class ProductLabelController {
  private productLabelService: ProductLabelService;

  constructor() {
    this.productLabelService = new ProductLabelService();
  }

  findAll = async (request: Request, response: Response) => {
    const token = request.get("Authorization") as string;
    const ruc = request.get("ruc") as string;

    const result = await this.productLabelService.findAll(ruc, token);

    response.status(result.statusCode).json(result);
  };

  findById = async (request: Request, response: Response) => {
    const token = request.get("Authorization") as string;
    const ruc = request.get("ruc") as string;
    const id = Number(request.params.id);

    const result = await this.productLabelService.findById(id, ruc, token);

    response.status(result.statusCode).json(result);
  };

  findProductsByLabel = async (request: Request, response: Response) => {
    const token = request.get("Authorization") as string;
    const ruc = request.get("ruc") as string;
    const id = Number(request.params.id);

    const result = await this.productLabelService.findProductsByLabel(
      id,
      ruc,
      token
    );

    response.status(result.statusCode).json(result);
  };

  findAllWithDeleted = async (request: Request, response: Response) => {
    const token = request.get("Authorization") as string;
    const ruc = request.get("ruc") as string;

    const result = await this.productLabelService.findAllWithDeleted(
      ruc,
      token
    );

    response.status(result.statusCode).json(result);
  };

  create = async (request: Request, response: Response) => {
    const token = request.get("Authorization") as string;
    const ruc = request.get("ruc") as string;
    const data = request.body;

    const result = await this.productLabelService.createLabel(data, ruc, token);
    response.status(result.statusCode).json(result);
  };

  updateById = async (request: Request, response: Response) => {
    const token = request.get("Authorization") as string;
    const ruc = request.get("ruc") as string;
    const data = request.body;
    const id = Number(request.params.label_id);

    const result = await this.productLabelService.updateLabel(
      data,
      id,
      ruc,
      token
    );
    response.status(result.statusCode).json(result);
  };

  deleteById = async (request: Request, response: Response) => {
    const token = request.get("Authorization") as string;
    const ruc = request.get("ruc") as string;
    const id = Number(request.params.label_id);

    const result = await this.productLabelService.deleteById(id, ruc, token);
    response.status(result.statusCode).json(result);
  };

  assignLabelToProduct = async (request: Request, response: Response) => {
    const token = request.get("Authorization") as string;
    const ruc = request.get("ruc") as string;
    const id = Number(request.params.product_id);
    const data = request.body;

    const result = await this.productLabelService.assignLabelToProduct(
      id,
      data.label_id,
      ruc,
      token
    );

    response.status(result.statusCode).json(result);
  };

  removeLabelFromProduct = async (request: Request, response: Response) => {
    const token = request.get("Authorization") as string;
    const ruc = request.get("ruc") as string;
    const product_id = Number(request.params.product_id);
    const product_label_id = Number(request.params.product_label_id);

    const result = await this.productLabelService.removeLabelFromProduct(
      product_id,
      product_label_id,
      ruc,
      token
    );

    response.status(result.statusCode).json(result);
  };
}

export default ProductLabelController;
