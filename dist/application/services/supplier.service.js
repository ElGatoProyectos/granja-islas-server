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
const company_service_1 = __importDefault(require("./company.service"));
class SupplierService {
    constructor() {
        // - query methods --------------------------------------------------------
        this.getCompanyInitial = (ruc) => __awaiter(this, void 0, void 0, function* () {
            try {
                const company = yield prisma_1.default.company.findFirst({ where: { ruc } });
                if (!company)
                    return this.responseService.NotFoundException("La empresa no existe");
                return this.responseService.SuccessResponse(undefined, company);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
        });
        this.validationInitial = (token, ruc) => __awaiter(this, void 0, void 0, function* () {
            try {
                const responseGetUser = yield this.authService.getUserForToken(token);
                if (responseGetUser.error)
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
        this.findAll = (ruc, page, limit) => __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            try {
                const responseCompany = yield this.getCompanyInitial(ruc);
                if (responseCompany.error)
                    return responseCompany;
                const company = responseCompany.payload;
                const [suppliers, total] = yield prisma_1.default.$transaction([
                    prisma_1.default.supplier.findMany({
                        where: { status_deleted: false, company_id: company.id },
                        skip,
                        take: limit,
                        include: {
                            Company: true,
                            User: { omit: { password: true } },
                        },
                    }),
                    prisma_1.default.product.count({
                        where: { status_deleted: false },
                    }),
                ]);
                const pageCount = Math.ceil(total / limit);
                const formatData = {
                    total,
                    page,
                    perPage: limit,
                    pageCount,
                    data: suppliers,
                };
                return this.responseService.SuccessResponse("Lista de Proveedores", formatData);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
        });
        this.findById = (supplier_id, ruc) => __awaiter(this, void 0, void 0, function* () {
            try {
                const responseCompany = yield this.getCompanyInitial(ruc);
                if (responseCompany.error)
                    return responseCompany;
                const company = responseCompany.payload;
                const supplier = yield prisma_1.default.supplier.findFirst({
                    where: { id: supplier_id, company_id: company.id },
                });
                if (!supplier)
                    return this.responseService.NotFoundException("Proveedor no encontrado");
                return this.responseService.SuccessResponse("Proveedor encontrado", supplier);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
        });
        this.findForRuc = (company_ruc, ruc) => __awaiter(this, void 0, void 0, function* () {
            try {
                const responseCompany = yield this.getCompanyInitial(ruc);
                if (responseCompany.error)
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
                if (responseValidation.error)
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
        this.updateById = (data, supplier_id, ruc) => __awaiter(this, void 0, void 0, function* () {
            try {
                // empresa de donde estoy enviando la solicitud
                //* ok
                const responseCompany = yield this.companyService.findByRuc(ruc);
                // proveedor a quien quiero hacer la modificación
                // ! error
                const responseSupplier = yield this.findById(supplier_id, ruc);
                if (responseCompany.error || responseSupplier.error)
                    return this.responseService.BadRequestException("Error al validar las empresa seleccionada");
                if (responseCompany.payload.id !== responseSupplier.payload.company_id)
                    return this.responseService.BadRequestException("El proveedor a modificar no pertenece a la empresa seleccionada");
                const updated = yield prisma_1.default.supplier.update({
                    where: { id: supplier_id },
                    data,
                });
                return this.responseService.CreatedResponse("Proveedor modificado correctamente", updated);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
        });
        this.responseService = new response_service_1.default();
        this.authService = new auth_service_1.default();
        this.companyService = new company_service_1.default();
    }
}
exports.default = SupplierService;
