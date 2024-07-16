import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";
import SireController from "../../../application/controllers/sire.controller";
import SunatController from "../../../application/controllers/sunat.controller";
import SunatMiddleware from "../middlewares/sunat.middleware";

class SunatRouter {
  public router: Router;
  private _prefix: string;
  private authMiddleware: AuthMiddleware;
  private sunatController: SunatController;
  private sunatMiddleware: SunatMiddleware;

  constructor() {
    this._prefix = "/sunat";
    this.router = Router();
    this.authMiddleware = new AuthMiddleware();
    this.sunatController = new SunatController();
    this.sunatMiddleware = new SunatMiddleware();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.getRoutes();
  }

  private getRoutes() {
    this.router.get(
      `${this._prefix}/ruc/:ruc`,
      this.sunatMiddleware.validateParamRuc,
      this.sunatController.queryForRuc
    );
  }
}

export default new SunatRouter().router;
