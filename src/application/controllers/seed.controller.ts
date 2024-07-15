import { Request, Response } from "express";
import SeedService from "../services/seed.service";

export default class SeedController {
  private seedService: SeedService;

  constructor() {
    this.seedService = new SeedService();
  }

  async createSeed(request: Request, response: Response) {
    const result = await this.seedService.createSeed();
    response.status(result.statusCode).json(result);
  }
}
