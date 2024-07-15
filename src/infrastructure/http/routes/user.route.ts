// import express from "express";
// import { authMiddleware } from "../middlewares/auth.middleware";

// const userRouter = express.Router();

// const prefix = "/users";

// userRouter.get(`${prefix}`, authMiddleware.authorizationAdmin);
// userRouter.get(`${prefix}/:id`, authMiddleware.authorizationAdmin);
// userRouter.post(`${prefix}`, authMiddleware.authorizationAdmin);
// userRouter.patch(`${prefix}/:id`, authMiddleware.authorizationAdmin);

// export default userRouter;

import { Router } from "express";
// import AuthMiddleware from "../middlewares/auth.middleware";
import UserController from "../../../application/controllers/user.controller";

class UserRouter {
  public router: Router;
  private _prefix: string = "/users";
  // private authMiddleware: AuthMiddleware;
  private userController: UserController;

  constructor() {
    this.router = Router();

    // this.authMiddleware = new AuthMiddleware();
    this.userController = new UserController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.getRoutes();
    this.postRoutes();
    this.patchRoutes();
  }

  private getRoutes() {
    this.router.get(`${this._prefix}`, this.userController.findUsers);
    this.router.get(`${this._prefix}/:id`);
  }

  private postRoutes() {
    this.router.post(`${this._prefix}`);
  }

  private patchRoutes() {
    this.router.patch(`${this._prefix}`);
  }
}

export default new UserRouter().router;
