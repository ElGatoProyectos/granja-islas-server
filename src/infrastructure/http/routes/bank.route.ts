import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";
import AccessDataMiddleware from "../middlewares/access-data.middleware";
import BankController from "../../../application/controllers/bank.controller";

class BankRouter {
  public router: Router;
  private _prefix: string = "/banks";
  private authMiddleware: AuthMiddleware;
  private bankController: BankController;
  private accessDataMiddleware: AccessDataMiddleware;

  constructor() {
    this.router = Router();

    this.authMiddleware = new AuthMiddleware();
    this.bankController = new BankController();
    this.accessDataMiddleware = new AccessDataMiddleware();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.getRoutes();
    this.postRoutes();
    this.patchRoutes();
    this.deleteRoutes();
  }

  private getRoutes() {
    this.router.get(
      `${this._prefix}`,
      this.accessDataMiddleware.validateCredentials,
      this.authMiddleware.authorizationUser,
      this.bankController.findAll
    );

    this.router.get(
      `${this._prefix}/all`,
      this.accessDataMiddleware.validateCredentials,
      this.authMiddleware.authorizationAdmin,
      this.bankController.findAllWithDeleted
    );

    this.router.get(
      `${this._prefix}/:id`,
      this.accessDataMiddleware.validateCredentials,
      this.authMiddleware.authorizationUser,
      this.bankController.findById
    );
  }

  private postRoutes() {
    this.router.post(
      `${this._prefix}`,
      this.accessDataMiddleware.validateCredentials,
      this.authMiddleware.authorizationAdmin,
      this.bankController.create
    );
  }

  private patchRoutes() {
    this.router.patch(
      `${this._prefix}/:id`,
      this.accessDataMiddleware.validateCredentials,
      this.authMiddleware.authorizationAdmin,
      this.bankController.editById
    );
  }

  private deleteRoutes() {
    this.router.delete(
      `${this._prefix}/:id`,
      this.accessDataMiddleware.validateCredentials,
      this.authMiddleware.authorizationAdmin,
      this.bankController.deleteById
    );
  }
}

export default new BankRouter().router;
