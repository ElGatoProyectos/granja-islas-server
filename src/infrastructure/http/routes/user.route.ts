import { Router } from "express";
import UserController from "../../../application/controllers/user.controller";
import AuthMiddleware from "../middlewares/auth.middleware";
import UserMiddleware from "../middlewares/user.middleware";

class UserRouter {
  public router: Router;
  private _prefix: string = "/users";
  private authMiddleware: AuthMiddleware;
  private userController: UserController;
  private userMiddleware: UserMiddleware;

  constructor() {
    this.router = Router();

    this.authMiddleware = new AuthMiddleware();
    this.userController = new UserController();
    this.userMiddleware = new UserMiddleware();
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
      this.authMiddleware.authorizationAdmin,
      this.authMiddleware.authorizationAdmin,
      this.userController.findUsers
    );
    this.router.get(
      `${this._prefix}/:id`,
      this.authMiddleware.authorizationAdmin,
      this.authMiddleware.authorizationAdmin,
      this.userController.findUserById
    );
  }

  private postRoutes() {
    this.router.post(
      `${this._prefix}`,
      this.authMiddleware.authorizationAdmin,
      this.userMiddleware.validateBodyCreate,
      this.userController.create
    );
  }

  private patchRoutes() {
    this.router.patch(
      `${this._prefix}/:id`,
      this.authMiddleware.authorizationUser,
      this.userController.edit
    );
  }
}

export default new UserRouter().router;
