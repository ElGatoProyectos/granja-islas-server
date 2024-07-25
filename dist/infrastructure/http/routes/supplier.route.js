"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const supplier_controller_1 = __importDefault(require("../../../application/controllers/supplier.controller"));
const supplier_middleware_1 = __importDefault(require("../middlewares/supplier.middleware"));
const access_data_middleware_1 = __importDefault(require("../middlewares/access-data.middleware"));
// pending
class SupplierRouter {
    constructor() {
        this._prefix = "/suppliers";
        this.router = (0, express_1.Router)();
        this.authMiddleware = new auth_middleware_1.default();
        this.supplierController = new supplier_controller_1.default();
        this.accessDataMiddleware = new access_data_middleware_1.default();
        this.supplierMiddleware = new supplier_middleware_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
    }
    getRoutes() {
        this.router.get(`${this._prefix}`, this.authMiddleware.authorizationUser, this.accessDataMiddleware.validateCredentials, this.supplierController.findAll);
        this.router.get(`${this._prefix}/:id`, this.authMiddleware.authorizationUser, this.accessDataMiddleware.validateCredentials, this.supplierController.findById);
    }
    postRoutes() {
        this.router.post(`${this._prefix}`, this.authMiddleware.authorizationAdmin, this.accessDataMiddleware.validateCredentials, this.supplierMiddleware.validateCreate, this.supplierController.create);
    }
    patchRoutes() {
        this.router.patch(`${this._prefix}/:id`, this.authMiddleware.authorizationAdmin, this.accessDataMiddleware.validateCredentials, this.supplierMiddleware.validateUpdate, this.supplierController.edit);
    }
}
exports.default = new SupplierRouter().router;
