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
const prisma_1 = __importDefault(require("../../infrastructure/database/prisma"));
const response_service_1 = __importDefault(require("./response.service"));
class SupplierService {
    constructor() {
        this.findAll = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const suppliers = yield prisma_1.default.supplier.findMany();
                return this.responseService.SuccessResponse("Lista de Proveedores", suppliers);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
        });
        this.findById = (supplierId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const supplier = yield prisma_1.default.supplier.findFirst({
                    where: { id: supplierId },
                });
                return this.responseService.SuccessResponse("Proveedor encontrado", supplier);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
        });
        this.findForRuc = (ruc) => __awaiter(this, void 0, void 0, function* () {
            try {
                const supplier = yield prisma_1.default.supplier.findFirst({ where: { ruc } });
                if (!supplier)
                    return this.responseService.NotFoundException("Proveedor no encontrado");
                return this.responseService.SuccessResponse("Proveedor encontrado", supplier);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
        });
        this.create = (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                const created = yield prisma_1.default.supplier.create({
                    data,
                });
                return this.responseService.CreatedResponse("Proveedor registrado correctamente", created);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
        });
        this.updateById = (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                const created = yield prisma_1.default.supplier.create({
                    data,
                });
                return this.responseService.CreatedResponse("Proveedor registrado correctamente", created);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
        });
        this.responseService = new response_service_1.default();
    }
}
exports.default = SupplierService;
