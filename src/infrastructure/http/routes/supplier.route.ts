import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";
import SupplierController from "../../../application/controllers/supplier.controller";
import RucMiddleware from "../middlewares/ruc.middleware";
import SupplierMiddleware from "../middlewares/supplier.middleware";

// pending
class SupplierRouter {
  public router: Router;
  private _prefix: string = "/suppliers";
  private authMiddleware: AuthMiddleware;
  private rucMiddleware: RucMiddleware;
  private supplierController: SupplierController;
  private supplierMiddleware: SupplierMiddleware;

  constructor() {
    this.router = Router();
    this.authMiddleware = new AuthMiddleware();
    this.supplierController = new SupplierController();
    this.rucMiddleware = new RucMiddleware();
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
      this.rucMiddleware.validateRuc,
      this.authMiddleware.authorizationUser,
      this.supplierController.findAll
    );
    this.router.get(
      `${this._prefix}/:id`,
      this.rucMiddleware.validateRuc,
      this.authMiddleware.authorizationUser,
      this.supplierController.findById
    );
  }

  private postRoutes() {
    this.router.post(
      `${this._prefix}`,
      this.rucMiddleware.validateRuc,
      this.supplierMiddleware.validateBody,
      this.authMiddleware.authorizationAdmin,
      this.supplierController.create
    );
  }

  private patchRoutes() {
    this.router.patch(`${this._prefix}`);
  }
}

export default new SupplierRouter().router;
