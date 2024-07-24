import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";
import SupplierController from "../../../application/controllers/supplier.controller";
import SupplierMiddleware from "../middlewares/supplier.middleware";
import AccessDataMiddleware from "../middlewares/access-data.middleware";

// pending
class SupplierRouter {
  public router: Router;
  private _prefix: string = "/suppliers";
  private authMiddleware: AuthMiddleware;
  private accessDataMiddleware: AccessDataMiddleware;
  private supplierController: SupplierController;
  private supplierMiddleware: SupplierMiddleware;

  constructor() {
    this.router = Router();
    this.authMiddleware = new AuthMiddleware();
    this.supplierController = new SupplierController();
    this.accessDataMiddleware = new AccessDataMiddleware();
    this.supplierMiddleware = new SupplierMiddleware();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.getRoutes();
    this.postRoutes();
    this.patchRoutes();
  }

  private getRoutes() {
    this.router.get(
      `${this._prefix}`,
      this.authMiddleware.authorizationUser,
      this.accessDataMiddleware.validateCredentials,
      this.supplierController.findAll
    );
    this.router.get(
      `${this._prefix}/:id`,
      this.authMiddleware.authorizationUser,
      this.accessDataMiddleware.validateCredentials,
      this.supplierController.findById
    );
  }

  private postRoutes() {
    this.router.post(
      `${this._prefix}`,
      this.authMiddleware.authorizationAdmin,
      this.accessDataMiddleware.validateCredentials,
      this.supplierMiddleware.validateCreate,
      this.supplierController.create
    );
  }

  private patchRoutes() {
    this.router.patch(
      `${this._prefix}/:id`,
      this.authMiddleware.authorizationAdmin,
      this.accessDataMiddleware.validateCredentials,
      this.supplierMiddleware.validateUpdate,
      this.supplierController.edit
    );
  }
}

export default new SupplierRouter().router;
