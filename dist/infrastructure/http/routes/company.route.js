"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const company_controller_1 = __importDefault(require("../../../application/controllers/company.controller"));
const company_middleware_1 = __importDefault(require("../middlewares/company.middleware"));
class CompanyRouter {
    constructor() {
        this.authMiddleware = new auth_middleware_1.default();
        this.companyController = new company_controller_1.default();
        this.companyMiddleware = new company_middleware_1.default();
        this._prefix = "/companies";
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }
    getRoutes() {
        this.router.get(this._prefix, this.authMiddleware.authorizationUser, this.companyController.findAll);
        this.router.get(`${this._prefix}/all`, this.authMiddleware.authorizationSuperAdmin, this.companyController.findAllWithDeleted);
        this.router.get(`${this._prefix}/:id`, this.authMiddleware.authorizationUser, this.companyController.findBydId);
    }
    patchRoutes() {
        this.router.patch(`${this._prefix}/:id`, this.companyMiddleware.validateCompany, this.authMiddleware.authorizationSuperAdmin, this.companyController.updateById);
    }
    postRoutes() {
        this.router.post(this._prefix, this.authMiddleware.authorizationSuperAdmin, this.companyController.create);
    }
    deleteRoutes() {
        this.router.patch(`${this._prefix}/:id`, this.authMiddleware.authorizationSuperAdmin, this.companyMiddleware.validateCompany, this.companyController.deleteById);
    }
}
exports.default = new CompanyRouter().router;
