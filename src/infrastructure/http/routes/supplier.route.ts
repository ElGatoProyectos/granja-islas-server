import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";
import SupplierController from "../../../application/controllers/supplier.controller";

// pending
class UserRouter {
  public router: Router;
  private _prefix: string = "/users";
  private authMiddleware: AuthMiddleware;
  private supplierController: SupplierController;

  constructor() {
    this.router = Router();

    this.authMiddleware = new AuthMiddleware();
    this.supplierController = new SupplierController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.getRoutes();
    this.postRoutes();
    this.patchRoutes();
  }

  private getRoutes() {
    this.router.get(`${this._prefix}`, this.authMiddleware.authorizationAdmin);
    this.router.get(
      `${this._prefix}/:id`,
      this.authMiddleware.authorizationAdmin
    );
  }

  private postRoutes() {
    this.router.post(`${this._prefix}`);
  }

  private patchRoutes() {
    this.router.patch(`${this._prefix}`);
  }
}

export default new UserRouter().router;
