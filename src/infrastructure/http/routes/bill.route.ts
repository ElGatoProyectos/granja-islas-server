import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";
import BillController from "../../../application/controllers/bill.controller";

class BillRouter {
  public router: Router;
  private _prefix: string;
  private authMiddleware: AuthMiddleware = new AuthMiddleware();
  private billController: BillController = new BillController();

  constructor() {
    this._prefix = "/bills";
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.getRoutes();
  }

  private getRoutes() {
    this.router.get(`${this._prefix}/capture-data`);
    this.router.get(`${this._prefix}`);
  }

  private postRoutes() {
    this.router.get(`${this._prefix}`);
  }
}

export default new BillRouter().router;
