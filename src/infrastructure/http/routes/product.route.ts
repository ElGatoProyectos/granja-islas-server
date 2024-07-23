import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";
import ProductController from "../../../application/controllers/product.controller";

class ProductRouter {
  public router: Router;
  private _prefix: string = "/products";
  private authMiddleware: AuthMiddleware;
  private productController: ProductController;

  constructor() {
    this.router = Router();

    this.authMiddleware = new AuthMiddleware();
    this.productController = new ProductController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.getRoutes();
    this.postRoutes();
    this.patchRoutes();
  }

  private getRoutes() {
    this.router.get(
      `${this._prefix}`,
      // this.authMiddleware.authorizationAdmin,
      this.productController.findAll
    );
  }

  private postRoutes() {
    this.router.post(`${this._prefix}`, this.productController.create);
  }

  private patchRoutes() {
    this.router.patch(`${this._prefix}`);
  }
}

export default new ProductRouter().router;
