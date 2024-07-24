"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_service_1 = __importDefault(require("../../../application/services/response.service"));
const company_dto_1 = require("./dto/company.dto");
const validator_1 = __importDefault(require("validator"));
/**
 * Validador para el ruc, este tiene que pasar el ruc para consultar facturas, vouchers, etc...
 */
class RucMiddleware {
    constructor() {
        this.responseService = new response_service_1.default();
        this.customError = this.responseService.BadRequestException("Error al traer la información");
        this.validateRuc = (request, response, nextFunction) => {
            try {
                const ruc = request.get("ruc");
                if (!ruc)
                    response.status(this.customError.statusCode).json(this.customError);
                else {
                    company_dto_1.validateRuc.parse({ ruc });
                    if (!validator_1.default.isNumeric(ruc))
                        response.status(this.customError.statusCode).json(this.customError);
                    nextFunction();
                }
            }
            catch (error) {
                response.status(this.customError.statusCode).json(this.customError);
            }
        };
    }
}
exports.default = RucMiddleware;
