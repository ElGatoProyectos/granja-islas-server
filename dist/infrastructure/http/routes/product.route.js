"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const product_controller_1 = __importDefault(require("../../../application/controllers/product.controller"));
class ProductRouter {
    constructor() {
        this._prefix = "/products";
        this.router = (0, express_1.Router)();
        this.authMiddleware = new auth_middleware_1.default();
        this.productController = new product_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
    }
    getRoutes() {
        this.router.get(`${this._prefix}`, 
        // this.authMiddleware.authorizationAdmin,
        this.productController.findAll);
    }
    postRoutes() {
        this.router.post(`${this._prefix}`, this.productController.create);
    }
    patchRoutes() {
        this.router.patch(`${this._prefix}`);
    }
}
exports.default = new ProductRouter().router;
