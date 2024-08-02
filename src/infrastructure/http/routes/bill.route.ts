import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";
import BillController from "../../../application/controllers/bill.controller";
import AccessDataMiddleware from "../middlewares/access-data.middleware";
import BillMiddleware from "../middlewares/bill.middleware";

class BillRouter {
  public router: Router;
  private _prefix: string;
  private authMiddleware: AuthMiddleware = new AuthMiddleware();
  private billController: BillController = new BillController();
  private billMiddleware: BillMiddleware = new BillMiddleware();
  private accessDataMiddleware: AccessDataMiddleware =
    new AccessDataMiddleware();

  constructor() {
    this._prefix = "/bills";
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.getRoutes();
    this.postRoutes();
  }

  private getRoutes() {
    this.router.get(`${this._prefix}/capture-data`);
  }

  private postRoutes() {
    this.router.post(
      `${this._prefix}/create`,
      this.authMiddleware.authorizationAdmin,
      this.accessDataMiddleware.validateCredentials,
      this.billMiddleware.create,
      this.billController.create
    );

    // [message] seccion (registro de compras)
    this.router.post(
      `${this._prefix}/get`,
      this.authMiddleware.authorizationUser,
      this.accessDataMiddleware.validateCredentials,
      this.billMiddleware.findAll,
      this.billController.findAll
    );
  }
}

export default new BillRouter().router;
