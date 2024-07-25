import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";
import TestController from "../../../application/controllers/test.controller";

class TestRouter {
  public router: Router;
  private _prefix: string;
  private authMiddleware: AuthMiddleware;
  private testController: TestController;

  constructor() {
    this._prefix = "/test";
    this.router = Router();
    this.authMiddleware = new AuthMiddleware();
    this.testController = new TestController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.getRoutes();
  }

  private getRoutes() {
    this.router.get(this._prefix, this.authMiddleware.authorizationAdmin);
    this.router.post(`${this._prefix}/sire`, this.testController.testSire);
  }
}

export default new TestRouter().router;
