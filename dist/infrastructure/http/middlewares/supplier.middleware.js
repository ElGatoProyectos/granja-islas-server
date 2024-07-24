"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supplier_dto_1 = require("./dto/supplier.dto");
const response_service_1 = __importDefault(require("../../../application/services/response.service"));
class SupplierMiddleware {
    constructor() {
        this.responseService = new response_service_1.default();
        this.validateBody = (request, response, nextFunction) => {
            try {
                supplier_dto_1.createSupplierDTo.parse(request.body);
                nextFunction();
            }
            catch (error) {
                const customError = this.responseService.BadRequestException("Error al validar esquema", error);
                response.status(customError.statusCode).json(customError);
            }
        };
    }
}
exports.default = SupplierMiddleware;
