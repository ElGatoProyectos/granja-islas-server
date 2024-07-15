import { Router } from "express";
import AuthController from "../../../application/controllers/auth.controller";
import AuthMiddleware from "../middlewares/auth.middleware";

class AuthRouter {
  private _prefix: string = "/auth";
  public router: Router;
  private authController: AuthController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.authMiddleware = new AuthMiddleware();
  }

  private initializeRoutes(): void {
    this.postRoutes();
  }

  private postRoutes(): void {
    this.router.post(
      `${this._prefix}/login`,
      this.authMiddleware.validateBody,
      this.authController.login
    );
  }
}

export default new AuthRouter().router;
