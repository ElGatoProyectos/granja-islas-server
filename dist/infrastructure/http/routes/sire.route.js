"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const sire_controller_1 = __importDefault(require("../../../application/controllers/sire.controller"));
class SireRouter {
    constructor() {
        this._prefix = "/sire";
        this.router = (0, express_1.Router)();
        this.authMiddleware = new auth_middleware_1.default();
        this.sireController = new sire_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.getRoutes();
    }
    getRoutes() {
        this.router.get(this._prefix, this.sireController.captureDate);
    }
}
exports.default = new SireRouter().router;
