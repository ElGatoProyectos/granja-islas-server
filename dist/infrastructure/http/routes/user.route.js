"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../../../application/controllers/user.controller"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const user_middleware_1 = __importDefault(require("../middlewares/user.middleware"));
class UserRouter {
    constructor() {
        this._prefix = "/users";
        this.router = (0, express_1.Router)();
        this.authMiddleware = new auth_middleware_1.default();
        this.userController = new user_controller_1.default();
        this.userMiddleware = new user_middleware_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
    }
    getRoutes() {
        this.router.get(`${this._prefix}`, this.authMiddleware.authorizationAdmin, this.authMiddleware.authorizationAdmin, this.userController.findUsers);
        this.router.get(`${this._prefix}/:id`, this.authMiddleware.authorizationAdmin, this.authMiddleware.authorizationAdmin, this.userController.findUserById);
    }
    postRoutes() {
        this.router.post(`${this._prefix}`, this.authMiddleware.authorizationAdmin, this.userMiddleware.validateBodyCreate, this.userController.create);
    }
    patchRoutes() {
        this.router.patch(`${this._prefix}/:id`, this.authMiddleware.authorizationUser, this.userController.edit);
    }
}
exports.default = new UserRouter().router;
