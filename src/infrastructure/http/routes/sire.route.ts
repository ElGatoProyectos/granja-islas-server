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
    this.postRoutes();
  }

  private getRoutes() {
    this.router.get(this._prefix, this.sireController.captureDate);
  }

  private postRoutes() {
    this.router.post(
      `${this._prefix}/synchronize`,
      // this.authMiddleware.authorizationAdmin,
      this.sireController.synchronizeDataWithDatabase
    );
  }
}

export default new SireRouter().router;
