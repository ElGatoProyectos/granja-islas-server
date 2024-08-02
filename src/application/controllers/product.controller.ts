import { Request, Response } from "express";
import ProductService from "../services/product.service";

class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  findAll = async (request: Request, response: Response) => {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    const token = request.get("Authorization") as string;
    const ruc = request.get("ruc") as string;
    const result = await this.productService.findAll(ruc, token, page, limit);

    response.status(result.statusCode).json(result);
  };

  findById = async (request: Request, response: Response) => {
    const id = Number(request.params.id);
    const token = request.get("Authorization") as string;
    const ruc = request.get("ruc") as string;
    const result = await this.productService.findById(id, ruc, token);
    response.status(result.statusCode).json(result);
  };

  create = async (request: Request, response: Response) => {
    const data = request.body;

    const result = await this.productService.create(data);
    response.status(result.statusCode).json(result);
  };
}

export default ProductController;
