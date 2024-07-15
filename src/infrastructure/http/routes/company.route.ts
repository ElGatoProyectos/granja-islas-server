import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";
import CompanyController from "../../../application/controllers/company.controller";
import SaveImageMiddleware from "../middlewares/save-image.middleware";
import multer from "multer";
import path from "path";
import appRootPath from "app-root-path";
import { companyMulterProperties } from "../../../application/models/constants/multer.constant";
import CompanyMiddleware from "../middlewares/company.middleware";

class CompanyRouter {
  public router: Router;
  private _prefix: string;
  private authMiddleware: AuthMiddleware = new AuthMiddleware();
  private companyController: CompanyController = new CompanyController();
  private companyMiddleware: CompanyMiddleware = new CompanyMiddleware();
  constructor() {
    this._prefix = "/companies";
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.getRoutes();
    this.postRoutes();
    this.patchRoutes();
  }

  private getRoutes(): void {
    this.router.get(this._prefix, this.authMiddleware.authorizationAdmin);
  }

  private patchRoutes(): void {
    this.router.patch(
      `${this._prefix}/:id`,
      this.companyMiddleware.validateCompany,
      this.companyController.registerImage
    );
  }

  private postRoutes(): void {
    this.router.post(
      this._prefix,
      this.companyMiddleware.validateCreate,
      this.companyController.create
    );
  }
}

export default new CompanyRouter().router;
