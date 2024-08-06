import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";
import AccessDataMiddleware from "../middlewares/access-data.middleware";
import ReportController from "../../../application/controllers/report.controller";

class ReportRoute {
  public router: Router;
  private _prefix: string = "/reports";
  private authMiddleware: AuthMiddleware;
  private accessDataMiddleware: AccessDataMiddleware;
  private reportController: ReportController;

  constructor() {
    this.router = Router();

    this.authMiddleware = new AuthMiddleware();
    this.accessDataMiddleware = new AccessDataMiddleware();
    this.reportController = new ReportController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.getRoutes();
  }

  private getRoutes() {
    this.router.get(
      `${this._prefix}/general-analysis-basic/:label_id`,
      this.authMiddleware.authorizationAdmin,
      this.accessDataMiddleware.validateCredentials,
      this.reportController.generalAnalysisBasic
    );

    this.router.get(
      `${this._prefix}/general-analysis-detail-supplier`,
      this.authMiddleware.authorizationAdmin,
      this.accessDataMiddleware.validateCredentials,
      this.reportController.detailGeneralAnalysis_Supplier
    );

    this.router.get(
      `${this._prefix}/general-analysis-detail-expenditure-composition`,
      this.authMiddleware.authorizationAdmin,
      this.accessDataMiddleware.validateCredentials,
      this.reportController.detailGeneralAnalysis_Supplier
    );
  }
}

export default new ReportRoute().router;
