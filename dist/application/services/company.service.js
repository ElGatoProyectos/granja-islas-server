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
class CompanyService {
    constructor() {
        this.findAll = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const companies = yield prisma_1.default.company.findMany({
                    where: { status_deleted: false },
                });
                return this.responseService.SuccessResponse("Listado de empresas", companies);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
            finally {
                yield prisma_1.default.$disconnect();
            }
        });
        this.findAllWithDeleted = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const companies = yield prisma_1.default.company.findMany();
                return this.responseService.SuccessResponse("Listado de empresas en general", companies);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
            finally {
                yield prisma_1.default.$disconnect();
            }
        });
        this.findById = (companyId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const company = yield prisma_1.default.company.findFirst({
                    where: { id: companyId },
                });
                if (!company)
                    return this.responseService.NotFoundException("Empresa no encontrada");
                return this.responseService.SuccessResponse("Empresa encontrada con éxito", company);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
            finally {
                yield prisma_1.default.$disconnect();
            }
        });
        this.create = (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                const created = yield prisma_1.default.company.create({ data });
                return this.responseService.CreatedResponse("Empresa creada con éxito!", created);
            }
            catch (error) {
                console.log(error);
                return this.responseService.InternalServerErrorException(undefined, error);
            }
            finally {
                yield prisma_1.default.$disconnect();
            }
        });
        this.updateById = (companyId, data) => __awaiter(this, void 0, void 0, function* () {
            try {
                // todo  Verificar, hay doble validacion redundante en si existe la empresa
                const responseCompany = yield this.findById(companyId);
                if (responseCompany.error)
                    return responseCompany;
                yield prisma_1.default.company.update({ where: { id: companyId }, data });
                return this.responseService.SuccessResponse("Empresa modificada correctamente");
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
            finally {
                yield prisma_1.default.$disconnect();
            }
        });
        this.deleteById = (companyId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const responseCompany = yield this.findById(companyId);
                if (responseCompany.error)
                    return responseCompany;
                yield prisma_1.default.company.update({
                    where: { id: companyId },
                    data: { status_deleted: true },
                });
                return this.responseService.SuccessResponse("Empresa eliminada correctamente");
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
            finally {
                yield prisma_1.default.$disconnect();
            }
        });
        this.responseService = new response_service_1.default();
    }
}
exports.default = CompanyService;
