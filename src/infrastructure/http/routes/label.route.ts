import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";
import LabelController from "../../../application/controllers/label.controller";
import AccessDataMiddleware from "../middlewares/access-data.middleware";

class LabelRouter {
  public router: Router;
  private _prefix: string = "/labels";
  private authMiddleware: AuthMiddleware;
  private labelController: LabelController;
  private accessDataMiddleware: AccessDataMiddleware;

  constructor() {
    this.router = Router();

    this.authMiddleware = new AuthMiddleware();
    this.labelController = new LabelController();
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
      this.labelController.findAll
    );

    this.router.get(
      `${this._prefix}/all`,
      this.accessDataMiddleware.validateCredentials,
      this.authMiddleware.authorizationAdmin,
      this.labelController.findAllWithDeleted
    );

    this.router.get(
      `${this._prefix}/:id`,
      this.accessDataMiddleware.validateCredentials,
      this.authMiddleware.authorizationUser,
      this.labelController.findById
    );
  }

  private postRoutes() {
    this.router.post(
      `${this._prefix}`,
      this.accessDataMiddleware.validateCredentials,
      this.authMiddleware.authorizationAdmin,
      this.labelController.create
    );
  }

  private patchRoutes() {
    this.router.patch(
      `${this._prefix}/:id`,
      this.accessDataMiddleware.validateCredentials,
      this.authMiddleware.authorizationAdmin,
      this.labelController.editById
    );
  }

  private deleteRoutes() {
    this.router.delete(
      `${this._prefix}/:id`,
      this.accessDataMiddleware.validateCredentials,
      this.authMiddleware.authorizationAdmin,
      this.labelController.deleteById
    );
  }
}

export default new LabelRouter().router;
