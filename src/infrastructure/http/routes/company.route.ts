import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";
import CompanyController from "../../../application/controllers/company.controller";
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
    this.getRoutes();
    this.postRoutes();
    this.patchRoutes();
    this.deleteRoutes();
  }

  private getRoutes(): void {
    this.router.get(
      this._prefix,
      this.authMiddleware.authorizationUser,
      this.companyController.findAll
    );

    this.router.get(
      `${this._prefix}/all`,
      this.authMiddleware.authorizationSuperAdmin,
      this.companyController.findAllWithDeleted
    );

    this.router.get(
      `${this._prefix}/:id`,
      this.authMiddleware.authorizationUser,
      this.companyController.findBydId
    );

    this.router.get(
      `${this._prefix}/file/:filter`,
      this.authMiddleware.authorizationUser,
      this.companyController.findImage
    );
  }

  private patchRoutes(): void {
    this.router.patch(
      `${this._prefix}/:id`,

      this.companyMiddleware.validateCompany,
      this.authMiddleware.authorizationSuperAdmin,
      this.companyController.updateById
    );
  }

  private postRoutes(): void {
    this.router.post(
      this._prefix,
      this.authMiddleware.authorizationSuperAdmin,
      this.companyController.create
    );
  }

  private deleteRoutes(): void {
    this.router.patch(
      `${this._prefix}/:id`,
      this.authMiddleware.authorizationSuperAdmin,
      this.companyMiddleware.validateCompany,
      this.companyController.deleteById
    );
  }
}

export default new CompanyRouter().router;
