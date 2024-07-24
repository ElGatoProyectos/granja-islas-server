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
const auth_service_1 = __importDefault(require("./auth.service"));
class SupplierService {
    constructor() {
        // - query methods --------------------------------------------------------
        this.getCompanyInitial = (ruc) => __awaiter(this, void 0, void 0, function* () {
            try {
                const company = yield prisma_1.default.company.findFirst({ where: { ruc } });
                return this.responseService.SuccessResponse("Company", company);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
        });
        this.validationInitial = (token, ruc) => __awaiter(this, void 0, void 0, function* () {
            try {
                const responseGetUser = yield this.authService.getUserForToken(token);
                if (!responseGetUser.error)
                    return responseGetUser;
                const responseCompany = yield this.getCompanyInitial(ruc);
                if (responseCompany.error)
                    return responseCompany;
                return this.responseService.SuccessResponse(undefined, {
                    user: responseGetUser.payload,
                    company: responseCompany.payload,
                });
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
        });
        this.findAll = (ruc) => __awaiter(this, void 0, void 0, function* () {
            try {
                const responseCompany = yield this.getCompanyInitial(ruc);
                if (!responseCompany.error)
                    return responseCompany;
                const company = responseCompany.payload;
                const suppliers = yield prisma_1.default.supplier.findMany({
                    where: { company_id: company.id },
                });
                return this.responseService.SuccessResponse("Lista de Proveedores", suppliers);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
        });
        this.findById = (supplier_id, ruc) => __awaiter(this, void 0, void 0, function* () {
            try {
                const responseCompany = yield this.getCompanyInitial(ruc);
                if (!responseCompany.error)
                    return responseCompany;
                const company = responseCompany.payload;
                const supplier = yield prisma_1.default.supplier.findFirst({
                    where: { id: supplier_id, company_id: company.id },
                });
                return this.responseService.SuccessResponse("Proveedor encontrado", supplier);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
        });
        this.findForRuc = (company_ruc, ruc) => __awaiter(this, void 0, void 0, function* () {
            try {
                const responseCompany = yield this.getCompanyInitial(ruc);
                if (!responseCompany.error)
                    return responseCompany;
                const company = responseCompany.payload;
                const supplier = yield prisma_1.default.supplier.findFirst({
                    where: { ruc: company_ruc, company_id: company.id },
                });
                if (!supplier)
                    return this.responseService.NotFoundException("Proveedor no encontrado");
                return this.responseService.SuccessResponse("Proveedor encontrado", supplier);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
        });
        // - mutations methods --------------------------------------------------------
        this.create = (data, token, ruc) => __awaiter(this, void 0, void 0, function* () {
            try {
                const responseValidation = yield this.validationInitial(token, ruc);
                if (!responseValidation)
                    return responseValidation;
                const { user, company } = responseValidation.payload;
                const created = yield prisma_1.default.supplier.create({
                    data: Object.assign(Object.assign({}, data), { company_id: company.id, user_id_created: user.id }),
                });
                return this.responseService.CreatedResponse("Proveedor registrado correctamente", created);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
        });
        this.updateById = (data, supplier_id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const created = yield prisma_1.default.supplier.update({
                    where: { id: supplier_id },
                    data,
                });
                return this.responseService.CreatedResponse("Proveedor modificado correctamente", created);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
        });
        this.responseService = new response_service_1.default();
        this.authService = new auth_service_1.default();
    }
}
exports.default = SupplierService;
