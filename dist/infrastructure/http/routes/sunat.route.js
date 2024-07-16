"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const sunat_controller_1 = __importDefault(require("../../../application/controllers/sunat.controller"));
const sunat_middleware_1 = __importDefault(require("../middlewares/sunat.middleware"));
class SunatRouter {
    constructor() {
        this._prefix = "/sunat";
        this.router = (0, express_1.Router)();
        this.authMiddleware = new auth_middleware_1.default();
        this.sunatController = new sunat_controller_1.default();
        this.sunatMiddleware = new sunat_middleware_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.getRoutes();
    }
    getRoutes() {
        this.router.get(`${this._prefix}/ruc/:ruc`, this.sunatMiddleware.validateParamRuc, this.sunatController.queryForRuc);
    }
}
exports.default = new SunatRouter().router;
