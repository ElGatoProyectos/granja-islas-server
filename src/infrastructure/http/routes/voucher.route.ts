import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";
import VoucherController from "../../../application/controllers/voucher.controller";

class VoucherRouter {
  public router: Router;
  private _prefix: string = "/bill";
  private authMiddleware: AuthMiddleware;
  private voucherController: VoucherController;

  constructor() {
    this.router = Router();

    this.authMiddleware = new AuthMiddleware();
    this.voucherController = new VoucherController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.getRoutes();
    this.postRoutes();
  }

  private getRoutes() {
    this.router.get(`${this._prefix}`, this.authMiddleware.authorizationAdmin);
    this.router.get(
      `${this._prefix}/:id`,
      this.authMiddleware.authorizationAdmin
    );
  }

  private postRoutes() {
    this.router.post(
      `${this._prefix}/:id/vouchers/upload`,
      this.voucherController.registerVoucher
    );
  }
}

export default new VoucherRouter().router;
