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
const slugify_1 = __importDefault(require("slugify"));
const prisma_1 = __importDefault(require("../../infrastructure/database/prisma"));
const response_service_1 = __importDefault(require("./response.service"));
class ProductLabelService {
    constructor() {
        this.findAll = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const labels = yield prisma_1.default.productLabel.findMany({
                    where: { status_deleted: false },
                });
                return this.responseService.SuccessResponse("Lista de etiquetas", labels);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
        });
        this.findAllWithDeleted = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const labels = yield prisma_1.default.productLabel.findMany();
                return this.responseService.SuccessResponse("Lista de etiquetas", labels);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
        });
        this.findById = (productLabelId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const label = yield prisma_1.default.productLabel.findMany({
                    where: { id: productLabelId },
                });
                if (!label)
                    return this.responseService.NotFoundException("Etiqueta no encontrada");
                return this.responseService.SuccessResponse("Lista de etiquetas", label);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
        });
        // corregir
        this.createLabel = (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                const slug = (0, slugify_1.default)(data.title, { lower: true });
                data = Object.assign(Object.assign({}, data), { slug });
                const created = yield prisma_1.default.productLabel.create({ data });
                return this.responseService.CreatedResponse("Etiqueta creada", created);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
        });
        this.updateLabel = (data, productLabelId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const responseLabel = yield this.findById(productLabelId);
                if (responseLabel.error)
                    return responseLabel;
                const slug = (0, slugify_1.default)(data.title, { lower: true });
                data = Object.assign(Object.assign({}, data), { slug });
                const updated = yield prisma_1.default.productLabel.update({
                    where: { id: productLabelId },
                    data,
                });
                return this.responseService.SuccessResponse("Etiqueta modificada", updated);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
        });
        this.deleteById = (productLabelId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const responseLabel = yield this.findById(productLabelId);
                if (responseLabel.error)
                    return responseLabel;
                const updated = yield prisma_1.default.productLabel.update({
                    where: { id: productLabelId },
                    data: { status_deleted: true },
                });
                return this.responseService.SuccessResponse("Etiqueta modificada", updated);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
        });
        this.responseService = new response_service_1.default();
    }
}
exports.default = ProductLabelService;
