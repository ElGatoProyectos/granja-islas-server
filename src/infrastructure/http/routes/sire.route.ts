import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";
import SireController from "../../../application/controllers/sire.controller";

class SireRouter {
  public router: Router;
  private _prefix: string;
  private authMiddleware: AuthMiddleware;
  private sireController: SireController;

  constructor() {
    this._prefix = "/sire";
    this.router = Router();
    this.authMiddleware = new AuthMiddleware();
    this.sireController = new SireController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.getRoutes();
  }

  private getRoutes() {
    this.router.get(this._prefix, this.sireController.captureDate);
  }
}

export default new SireRouter().router;
