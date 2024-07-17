"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const seed_controller_1 = __importDefault(require("../../../application/controllers/seed.controller"));
class SeedRouter {
    constructor() {
        this._prefix = "/seed";
        this.router = (0, express_1.Router)();
        this.seedController = new seed_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.getRoutes();
    }
    getRoutes() {
        this.router.get(this._prefix, this.seedController.createSeed);
    }
}
exports.default = new SeedRouter().router;
