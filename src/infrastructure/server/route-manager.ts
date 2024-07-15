import express from "express";
import authRouter from "../http/routes/auth.route";
import userRouter from "../http/routes/user.route";
import testRoute from "../http/routes/test.route";
import voucherRoute from "../http/routes/voucher.route";
import companyRoute from "../http/routes/company.route";

export class RouteManager {
  private _globalPrefix: string;

  constructor(private app: express.Application) {
    this._globalPrefix = "/api";
  }

  public initializeRoutes(): void {
    this.app.use(this._globalPrefix, authRouter);
    this.app.use(this._globalPrefix, userRouter);
    this.app.use(this._globalPrefix, testRoute);
    // this.app.use(this._globalPrefix, voucherRoute);
    this.app.use(this._globalPrefix, companyRoute);
  }
}
