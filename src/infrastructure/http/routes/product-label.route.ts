import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";
import ProductLabelController from "../../../application/controllers/product-label.controller";
import AccessDataMiddleware from "../middlewares/access-data.middleware";
import ProductLabelMiddleware from "../middlewares/product-label.middleware";

class ProductLabelRouter {
  public router: Router;
  private _prefix: string = "/labels";
  private authMiddleware: AuthMiddleware;
  private productLabelController: ProductLabelController;
  private accessDataMiddleware: AccessDataMiddleware;
  private productLabelMiddleware: ProductLabelMiddleware;

  constructor() {
    this.router = Router();

    this.authMiddleware = new AuthMiddleware();
    this.productLabelController = new ProductLabelController();
    this.accessDataMiddleware = new AccessDataMiddleware();
    this.productLabelMiddleware = new ProductLabelMiddleware();
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
      this.authMiddleware.authorizationAdmin,
      this.accessDataMiddleware.validateCredentials,
      this.productLabelController.findAll
    );

    this.router.get(
      `${this._prefix}/:id`,
      this.authMiddleware.authorizationAdmin,
      this.accessDataMiddleware.validateCredentials,
      this.productLabelController.findById
    );

    this.router.get(
      `${this._prefix}/:id/products`,
      this.authMiddleware.authorizationAdmin,
      this.accessDataMiddleware.validateCredentials,
      this.productLabelController.findProductsByLabel
    );
  }

  private postRoutes() {
    this.router.post(
      `/products/:product_id${this._prefix}`,
      this.authMiddleware.authorizationAdmin,
      this.accessDataMiddleware.validateCredentials,
      this.productLabelMiddleware.validateCreate,
      this.productLabelController.assignLabelToProduct
    );
  }

  private patchRoutes() {
    this.router.patch(`${this._prefix}`);
  }

  private deleteRoutes() {
    this.router.delete(
      `/products/:product_id${this._prefix}/:product_label_id`,
      this.authMiddleware.authorizationAdmin,
      this.accessDataMiddleware.validateCredentials,
      this.productLabelController.removeLabelFromProduct
    );
  }
}

export default new ProductLabelRouter().router;
