import { Router } from "express";
import SeedController from "../../../application/controllers/seed.controller";

class SeedRouter {
  private _prefix: string;
  public router: Router;
  private seedController: SeedController;

  constructor() {
    this._prefix = "/seed";
    this.router = Router();
    this.seedController = new SeedController();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.getRoutes();
  }

  private getRoutes(): void {
    this.router.get(this._prefix, this.seedController.createSeed);
  }
}

export default new SeedRouter().router;
