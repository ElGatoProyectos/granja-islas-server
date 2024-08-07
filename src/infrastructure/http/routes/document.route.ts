import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";
import CompanyController from "../../../application/controllers/company.controller";
import CompanyMiddleware from "../middlewares/company.middleware";
import AccessDataMiddleware from "../middlewares/access-data.middleware";
import DocumentController from "../../../application/controllers/documents.controller";
import DocumentMiddleware from "../middlewares/document.middleware";

class CompanyRouter {
  public router: Router;
  private _prefix: string;
  private authMiddleware: AuthMiddleware = new AuthMiddleware();
  private documentMiddleware: DocumentMiddleware = new DocumentMiddleware();
  private accesDataMiddleware: AccessDataMiddleware =
    new AccessDataMiddleware();
  private documentController: DocumentController = new DocumentController();

  constructor() {
    this._prefix = "/documents";
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.getRoutes();
  }

  private getRoutes(): void {
    this.router.get(
      `${this._prefix}/report-1`,
      this.authMiddleware.authorizationAdmin,
      this.documentController.findAllAccumulated
    );

    this.router.get(
      `${this._prefix}`,
      this.authMiddleware.authorizationAdmin,
      this.documentController.findAll
    );

    this.router.get(
      `${this._prefix}/detail`,
      this.authMiddleware.authorizationAdmin,
      this.accesDataMiddleware.validateCredentials,
      this.documentMiddleware.validateFindDetail,
      this.documentController.findDetail
    );
  }

  private deleteRoutes(): void {}
}

export default new CompanyRouter().router;
