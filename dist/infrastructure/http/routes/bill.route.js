"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const bill_controller_1 = __importDefault(require("../../../application/controllers/bill.controller"));
class BillRouter {
    constructor() {
        this.authMiddleware = new auth_middleware_1.default();
        this.billController = new bill_controller_1.default();
        this._prefix = "/bills";
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.getRoutes();
    }
    getRoutes() {
        this.router.get(`${this._prefix}/capture-data`);
        this.router.get(`${this._prefix}`);
    }
    postRoutes() {
        this.router.get(`${this._prefix}`);
    }
}
exports.default = new BillRouter().router;
