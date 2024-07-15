import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";

class TestRouter {
  public router: Router;
  private _prefix: string;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this._prefix = "/test";
    this.router = Router();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.getRoutes();
  }

  private getRoutes() {
    this.router.get(this._prefix, this.authMiddleware.authorizationAdmin);
  }
}

export default new TestRouter().router;
