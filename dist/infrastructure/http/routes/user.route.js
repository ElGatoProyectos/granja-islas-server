"use strict";
// import express from "express";
// import { authMiddleware } from "../middlewares/auth.middleware";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const userRouter = express.Router();
// const prefix = "/users";
// userRouter.get(`${prefix}`, authMiddleware.authorizationAdmin);
// userRouter.get(`${prefix}/:id`, authMiddleware.authorizationAdmin);
// userRouter.post(`${prefix}`, authMiddleware.authorizationAdmin);
// userRouter.patch(`${prefix}/:id`, authMiddleware.authorizationAdmin);
// export default userRouter;
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../../../application/controllers/user.controller"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
class UserRouter {
    constructor() {
        this._prefix = "/users";
        this.router = (0, express_1.Router)();
        this.authMiddleware = new auth_middleware_1.default();
        this.userController = new user_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
    }
    getRoutes() {
        this.router.get(`${this._prefix}`, this.authMiddleware.authorizationAdmin, this.userController.findUsers);
        this.router.get(`${this._prefix}/:id`, this.authMiddleware.authorizationAdmin, this.userController.findUserById);
    }
    postRoutes() {
        this.router.post(`${this._prefix}`);
    }
    patchRoutes() {
        this.router.patch(`${this._prefix}`);
    }
}
exports.default = new UserRouter().router;
