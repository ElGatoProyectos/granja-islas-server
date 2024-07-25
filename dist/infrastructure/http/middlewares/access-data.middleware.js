"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_service_1 = __importDefault(require("../../../application/services/response.service"));
const validator_1 = __importDefault(require("validator"));
const access_data_dto_1 = require("./dto/access-data.dto");
class AccessDataMiddleware {
    constructor() {
        this.validateCredentials = (request, response, nextFunction) => {
            try {
                const ruc = request.get("ruc");
                const key = request.get("key");
                const user = request.get("user");
                const customError = this.responseService.BadRequestException("Error al validar las credenciales");
                if (!validator_1.default.isNumeric(ruc))
                    response.status(customError.statusCode).json(customError);
                const formatDataValidation = {
                    ruc,
                    key,
                    user,
                };
                access_data_dto_1.validateCredentialsDTO.parse(formatDataValidation);
                nextFunction();
            }
            catch (error) {
                const customError = this.responseService.BadRequestException("Error al validar las credenciales", error);
                response.status(customError.statusCode).json(customError);
            }
        };
        this.responseService = new response_service_1.default();
    }
}
exports.default = AccessDataMiddleware;
