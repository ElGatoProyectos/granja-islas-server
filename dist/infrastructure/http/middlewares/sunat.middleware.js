"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("validator"));
const response_service_1 = __importDefault(require("../../../application/services/response.service"));
class SunatMiddleware {
    constructor() {
        this.validateParamRuc = (request, response, nextFunction) => {
            const ruc = request.params.ruc;
            if (!validator_1.default.isNumeric(ruc) || ruc.length !== 11) {
                const customError = this.responseService.BadRequestException("Error al validar formato ruc");
                response.status(customError.statusCode).json(customError);
            }
            else {
                nextFunction();
            }
        };
        this.responseService = new response_service_1.default();
    }
}
exports.default = SunatMiddleware;
