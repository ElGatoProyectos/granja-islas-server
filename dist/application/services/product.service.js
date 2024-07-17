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
const product_label_service_1 = __importDefault(require("./product-label.service"));
const response_service_1 = __importDefault(require("./response.service"));
class ProductService {
    constructor() {
        this.findAll = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield prisma_1.default.product.findMany({
                    where: { status_deleted: false },
                });
                return this.responseService.SuccessResponse("Lista de productos", products);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
            finally {
                yield prisma_1.default.$disconnect();
            }
        });
        this.findById = (productId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield prisma_1.default.product.findMany({
                    where: { id: productId },
                });
                return this.responseService.SuccessResponse("Producto encontrado", product);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
            finally {
                yield prisma_1.default.$disconnect();
            }
        });
        this.findBySlug = (slug) => __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield prisma_1.default.product.findFirst({ where: { slug } });
                if (!product)
                    return this.responseService.NotFoundException("Producto no encontrado");
                return this.responseService.SuccessResponse("Producto encontrado", product);
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
                // consideremos al titulo como el campo unico que no se debe repetir
                const slug = (0, slugify_1.default)(data.title, { lower: true });
                const responseProduct = yield this.findBySlug(slug);
                if (!responseProduct.error)
                    return this.responseService.BadRequestException("Ya existe un producto con ese nombre");
                const created = yield prisma_1.default.product.create({ data: Object.assign(Object.assign({}, data), { slug }) });
                return this.responseService.CreatedResponse("Producto creado satisfactoriamente", created);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
            finally {
                yield prisma_1.default.$disconnect();
            }
        });
        this.updateById = (data, productId) => __awaiter(this, void 0, void 0, function* () {
            try {
                // consideremos al titulo como el campo unico que no se debe repetir
                const slug = (0, slugify_1.default)(data.title, { lower: true });
                const responseProduct = yield this.findById(productId);
                if (responseProduct.error)
                    return this.responseService.NotFoundException("El producto no existe");
                const created = yield prisma_1.default.product.update({
                    where: { id: productId },
                    data: Object.assign(Object.assign({}, data), { slug }),
                });
                return this.responseService.CreatedResponse("Producto modificado satisfactoriamente", created);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
            finally {
                yield prisma_1.default.$disconnect();
            }
        });
        // actions to products
        this.assignLabelToProduct = (productLabelId, productId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const responseProductLabel = yield this.productLabelService.findById(productLabelId);
                const responseProduct = yield this.findById(productId);
                if (responseProduct.error || responseProductLabel)
                    return this.responseService.BadRequestException("Ocurrió un error al asignar la etiqueta");
                const updatedProduct = yield prisma_1.default.product.update({
                    where: { id: productId },
                    data: {
                        product_label_id: productLabelId,
                    },
                });
                return this.responseService.SuccessResponse("Etiqueta asignada correctamente", updatedProduct);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
            finally {
                yield prisma_1.default.$disconnect();
            }
        });
        this.removeLabelFromProduct = (productLabelId, productId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const responseProductLabel = yield this.productLabelService.findById(productLabelId);
                const responseProduct = yield this.findById(productId);
                if (responseProduct.error || responseProductLabel)
                    return this.responseService.BadRequestException("Ocurrió un error al asignar la etiqueta");
                const updatedProduct = yield prisma_1.default.product.update({
                    where: { id: productId },
                    data: {
                        product_label_id: null,
                    },
                });
                return this.responseService.SuccessResponse("Etiqueta asignada correctamente", updatedProduct);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
            finally {
                yield prisma_1.default.$disconnect();
            }
        });
        // actions to suppliers
        this.assignSupplierToProduct = (supplierId, productId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const responseSupplier = yield this.supplierService.findById(supplierId);
                const responseProduct = yield this.findById(productId);
                if (responseSupplier.error || responseProduct.error)
                    return this.responseService.BadRequestException("Error al asignar proveedor");
                const updated = yield prisma_1.default.product.update({
                    where: { id: productId },
                    data: { supplier_id: supplierId },
                });
                return this.responseService.SuccessResponse("Proveedor asignado correctamente", updated);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
            finally {
                yield prisma_1.default.$disconnect();
            }
        });
        this.removeSupplierToProduct = (supplierId, productId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const responseSupplier = yield this.supplierService.findById(supplierId);
                const responseProduct = yield this.findById(productId);
                if (responseSupplier.error || responseProduct.error)
                    return this.responseService.BadRequestException("Error al asignar proveedor");
                const updated = yield prisma_1.default.product.update({
                    where: { id: productId },
                    data: { supplier_id: null },
                });
                return this.responseService.SuccessResponse("Proveedor asignado correctamente", updated);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
            finally {
                yield prisma_1.default.$disconnect();
            }
        });
        this.responseService = new response_service_1.default();
        this.productLabelService = new product_label_service_1.default();
        this.supplierService = new product_label_service_1.default();
    }
}
exports.default = ProductService;
