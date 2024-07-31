import { Request, Response } from "express";
import BankService from "../services/bank.service";

class BankController {
  private bankService: BankService;

  constructor() {
    this.bankService = new BankService();
  }

  findAll = async (request: Request, response: Response) => {
    const ruc = request.get("ruc") as string;
    const token = request.get("Authorization") as string;

    const result = await this.bankService.findAll(ruc, token);
    response.status(result.statusCode).json(result);
  };

  findById = async (request: Request, response: Response) => {
    const ruc = request.get("ruc") as string;
    const token = request.get("Authorization") as string;
    const id = Number(request.params.id);

    const result = await this.bankService.findById(id, ruc, token);
    response.status(result.statusCode).json(result);
  };

  findAllWithDeleted = async (request: Request, response: Response) => {
    const ruc = request.get("ruc") as string;
    const token = request.get("Authorization") as string;

    const result = await this.bankService.findAll(ruc, token);
    response.status(result.statusCode).json(result);
  };

  create = async (request: Request, response: Response) => {
    const ruc = request.get("ruc") as string;
    const token = request.get("Authorization") as string;
    const data = request.body;

    const result = await this.bankService.create(data, ruc, token);
    response.status(result.statusCode).json(result);
  };

  editById = async (request: Request, response: Response) => {
    const ruc = request.get("ruc") as string;
    const token = request.get("Authorization") as string;
    const data = request.body;
    const id = Number(request.params.id);

    const result = await this.bankService.editById(data, id, ruc, token);
    response.status(result.statusCode).json(result);
  };

  deleteById = async (request: Request, response: Response) => {
    const ruc = request.get("ruc") as string;
    const token = request.get("Authorization") as string;
    const id = Number(request.params.id);

    const result = await this.bankService.deleteById(id, ruc, token);
    response.status(result.statusCode).json(result);
  };
}

export default BankController;
