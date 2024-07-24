"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const supplier_controller_1 = __importDefault(require("../../../application/controllers/supplier.controller"));
const ruc_middleware_1 = __importDefault(require("../middlewares/ruc.middleware"));
const supplier_middleware_1 = __importDefault(require("../middlewares/supplier.middleware"));
// pending
class SupplierRouter {
    constructor() {
        this._prefix = "/suppliers";
        this.router = (0, express_1.Router)();
        this.authMiddleware = new auth_middleware_1.default();
        this.supplierController = new supplier_controller_1.default();
        this.rucMiddleware = new ruc_middleware_1.default();
        this.supplierMiddleware = new supplier_middleware_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
    }
    getRoutes() {
        this.router.get(`${this._prefix}`, this.rucMiddleware.validateRuc, this.authMiddleware.authorizationUser, this.supplierController.findAll);
        this.router.get(`${this._prefix}/:id`, this.rucMiddleware.validateRuc, this.authMiddleware.authorizationUser, this.supplierController.findById);
    }
    postRoutes() {
        this.router.post(`${this._prefix}`, this.rucMiddleware.validateRuc, this.supplierMiddleware.validateBody, this.authMiddleware.authorizationAdmin, this.supplierController.create);
    }
    patchRoutes() {
        this.router.patch(`${this._prefix}`);
    }
}
exports.default = new SupplierRouter().router;
