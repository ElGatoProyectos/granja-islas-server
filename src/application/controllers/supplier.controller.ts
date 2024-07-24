import { Request, Response } from "express";
import SupplierService from "../services/supplier.service";

//- need ruc and user for consulting
class SupplierController {
  private supplierService: SupplierService;

  constructor() {
    this.supplierService = new SupplierService();
  }

  findAll = async (request: Request, response: Response) => {
    const ruc = request.get("ruc") as string;
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    const result = await this.supplierService.findAll(ruc, page, limit);
    response.status(result.statusCode).json(result);
  };

  findById = async (request: Request, response: Response) => {
    const ruc = request.get("ruc") as string;
    const id = Number(request.params.id as string);

    const result = await this.supplierService.findById(id, ruc);
    response.status(result.statusCode).json(result);
  };

  create = async (request: Request, response: Response) => {
    const ruc = request.get("ruc") as string;
    const token = request.get("Authorization") as string;
    const data = request.body;
    const result = await this.supplierService.create(data, token, ruc);
    response.status(result.statusCode).json(result);
  };

  edit = async (request: Request, response: Response) => {
    const id = Number(request.params.id as string);
    const ruc = request.get("ruc") as string;
    const data = request.body;
    const result = await this.supplierService.updateById(data, id, ruc);
    response.status(result.statusCode).json(result);
  };
}

export default SupplierController;
