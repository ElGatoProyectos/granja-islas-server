"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const test_controller_1 = __importDefault(require("../../../application/controllers/test.controller"));
class TestRouter {
    constructor() {
        this._prefix = "/test";
        this.router = (0, express_1.Router)();
        this.authMiddleware = new auth_middleware_1.default();
        this.testController = new test_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.getRoutes();
    }
    getRoutes() {
        this.router.get(this._prefix, this.authMiddleware.authorizationAdmin);
        this.router.post(`${this._prefix}/sire`, this.testController.testSire);
    }
}
exports.default = new TestRouter().router;
