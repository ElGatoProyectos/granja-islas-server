"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const voucher_controller_1 = __importDefault(require("../../../application/controllers/voucher.controller"));
class VoucherRouter {
    constructor() {
        this._prefix = "/bill";
        this.router = (0, express_1.Router)();
        this.authMiddleware = new auth_middleware_1.default();
        this.voucherController = new voucher_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        // this.getRoutes();
        this.postRoutes();
    }
    getRoutes() {
        this.router.get(`${this._prefix}`, this.authMiddleware.authorizationAdmin);
        this.router.get(`${this._prefix}/:id`, this.authMiddleware.authorizationAdmin);
    }
    postRoutes() {
        this.router.post(`${this._prefix}/:id/vouchers/upload`, this.voucherController.registerVoucher);
    }
}
exports.default = new VoucherRouter().router;
