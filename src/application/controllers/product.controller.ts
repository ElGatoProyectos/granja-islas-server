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

  findByReport = async (request: Request, response: Response) => {
    const token = request.get("Authorization") as string;
    const ruc = request.get("ruc") as string;
    const filter = request.query.filter as string;
    const month = Number(request.query.month);
    const year = Number(request.query.year);
    const label_group_id = request.query.label_group_id as string;
    const supplier_group_id = request.query.supplier_group_id as string;

    const limit = parseInt(request.query.limit as string) || 20;
    const page = parseInt(request.query.page as string) || 1;

    const format = {
      pagination: {
        page,
        limit,
      },
      header: {
        ruc,
        token,
      },
      params: {
        filter,
        month,
        year,
        label_group_id,
        supplier_group_id,
      },
    };

    const result = await this.productService.findByReport(format);
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
