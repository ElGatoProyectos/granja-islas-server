"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supplier_service_1 = __importDefault(require("../services/supplier.service"));
//- need ruc and user for consulting
class SupplierController {
    constructor() {
        this.findAll = (request, response) => __awaiter(this, void 0, void 0, function* () {
            const ruc = request.get("ruc");
            const page = parseInt(request.query.page) || 1;
            const limit = parseInt(request.query.limit) || 20;
            const result = yield this.supplierService.findAll(ruc, page, limit);
            response.status(result.statusCode).json(result);
        });
        this.findById = (request, response) => __awaiter(this, void 0, void 0, function* () {
            const ruc = request.get("ruc");
            const id = Number(request.params.id);
            const result = yield this.supplierService.findById(id, ruc);
            response.status(result.statusCode).json(result);
        });
        this.create = (request, response) => __awaiter(this, void 0, void 0, function* () {
            const ruc = request.get("ruc");
            const token = request.get("Authorization");
            const data = request.body;
            const result = yield this.supplierService.create(data, token, ruc);
            response.status(result.statusCode).json(result);
        });
        this.edit = (request, response) => __awaiter(this, void 0, void 0, function* () {
            const id = Number(request.params.id);
            const ruc = request.get("ruc");
            const data = request.body;
            const result = yield this.supplierService.updateById(data, id, ruc);
            response.status(result.statusCode).json(result);
        });
        this.supplierService = new supplier_service_1.default();
    }
}
exports.default = SupplierController;
