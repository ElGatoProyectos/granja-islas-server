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
    const status_group = request.query.status_group as string;
    const nameFilter = request.query.name as string;
    const result = await this.supplierService.findAll(
      ruc,
      page,
      limit,
      nameFilter,
      status_group
    );
    response.status(result.statusCode).json(result);
  };

  findAllNoPagination = async (request: Request, response: Response) => {
    console.log("controller");
    const ruc = request.get("ruc") as string;
    const result = await this.supplierService.findAllNoPagination(ruc);
    response.status(result.statusCode).json(result);
  };

  findById = async (request: Request, response: Response) => {
    const ruc = request.get("ruc") as string;
    const id = Number(request.params.id as string);

    const result = await this.supplierService.findById(id, ruc);
    response.status(result.statusCode).json(result);
  };

  findProducts = async (request: Request, response: Response) => {
    const ruc = request.get("ruc") as string;
    const token = request.get("Authorization") as string;

    const filter = request.query.filter as string;
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    const month = Number(request.query.month);
    const year = Number(request.query.year);
    const label_group_id = request.query.label_group_id as string;
    const id = Number(request.params.id as string);

    const format = {
      params: {
        supplier_id: id,
        year,
        month,
        filter,
        label_group_id,
      },
      pagination: {
        page,
        limit,
      },
      headers: {
        token,
        ruc,
      },
    };

    const result = await this.supplierService.findProducts(format);
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
