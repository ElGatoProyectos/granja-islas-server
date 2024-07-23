"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_service_1 = __importDefault(require("../../../application/services/response.service"));
const product_dto_1 = require("./dto/product.dto");
class ProductMiddleware {
    constructor() {
        this.validateBody = (request, response, nextFunction) => {
            try {
                product_dto_1.createProductDTO.parse(request.body);
                nextFunction();
            }
            catch (error) {
                const customError = this.responseService.BadRequestException("Erro al validar producto");
                response.status(customError.statusCode).json(customError);
            }
        };
        this.responseService = new response_service_1.default();
    }
}
exports.default = ProductMiddleware;
