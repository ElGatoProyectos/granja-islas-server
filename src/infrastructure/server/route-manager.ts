import express from "express";
import authRouter from "../http/routes/auth.route";
import userRouter from "../http/routes/user.route";
import testRoute from "../http/routes/test.route";
import voucherRoute from "../http/routes/voucher.route";
import companyRouter from "../http/routes/company.route";
import sireRouter from "../http/routes/sire.route";
import sunatRouter from "../http/routes/sunat.route";
import seedRouter from "../http/routes/seed.route";
import productRouter from "../http/routes/product.route";
import supplierRouter from "../http/routes/supplier.route";
import labelRouter from "../http/routes/label.route";
import bankRouter from "../http/routes/bank.route";
import billRouter from "../http/routes/bill.route";

export class RouteManager {
  private _globalPrefix: string;

  constructor(private app: express.Application) {
    this._globalPrefix = "/api";
  }

  public initializeRoutes(): void {
    this.app.use(this._globalPrefix, authRouter);
    this.app.use(this._globalPrefix, userRouter);
    this.app.use(this._globalPrefix, billRouter);

    // this.app.use(this._globalPrefix, voucherRoute);
    this.app.use(this._globalPrefix, companyRouter);
    this.app.use(this._globalPrefix, sireRouter);
    this.app.use(this._globalPrefix, sunatRouter);
    this.app.use(this._globalPrefix, seedRouter);
    this.app.use(this._globalPrefix, productRouter);
    this.app.use(this._globalPrefix, supplierRouter);
    this.app.use(this._globalPrefix, testRoute);
    this.app.use(this._globalPrefix, labelRouter);
    this.app.use(this._globalPrefix, bankRouter);
  }
}
