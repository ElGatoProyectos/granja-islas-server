import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";
import VoucherController from "../../../application/controllers/voucher.controller";
import AccessDataMiddleware from "../middlewares/access-data.middleware";
import VoucherMiddleware from "../middlewares/voucher.middleware";

class VoucherRouter {
  public router: Router;
  private _prefix: string = "/bills";
  private authMiddleware: AuthMiddleware;
  private accessDataMiddleware: AccessDataMiddleware;
  private voucherMiddleware: VoucherMiddleware;
  private voucherController: VoucherController;

  constructor() {
    this.router = Router();

    this.authMiddleware = new AuthMiddleware();
    this.voucherController = new VoucherController();
    this.voucherMiddleware = new VoucherMiddleware();
    this.accessDataMiddleware = new AccessDataMiddleware();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.getRoutes();
    this.postRoutes();
    this.patchRoutes();
  }

  private getRoutes() {
    this.router.get(
      `${this._prefix}/:bill_id/vouchers`,
      this.authMiddleware.authorizationUser,
      this.accessDataMiddleware.validateCredentials,
      this.voucherController.findAll
    );

    this.router.get(
      `${this._prefix}/:bill_id/vouchers/:voucher_id/file`,
      this.authMiddleware.authorizationUser,
      this.accessDataMiddleware.validateCredentials,
      this.voucherController.getImage
    );
  }

  private postRoutes() {
    this.router.post(
      `${this._prefix}/:bill_id/vouchers`,
      this.authMiddleware.authorizationUser,
      this.accessDataMiddleware.validateCredentials,
      // this.voucherMiddleware.validateBody,
      this.voucherController.create
    );
  }

  private patchRoutes() {
    this.router.patch(
      `${this._prefix}/:bill_id/vouchers/:voucher_id`,
      this.authMiddleware.authorizationSuperAdmin,
      this.accessDataMiddleware.validateCredentials,
      this.voucherMiddleware.validateUpdate,
      this.voucherController.update
    );
  }
}

export default new VoucherRouter().router;
