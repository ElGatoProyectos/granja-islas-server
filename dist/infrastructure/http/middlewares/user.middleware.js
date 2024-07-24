"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_service_1 = __importDefault(require("../../../application/services/response.service"));
const user_dto_1 = require("./dto/user.dto");
class UserMiddleware {
    constructor() {
        this.responseService = new response_service_1.default();
        this.validateBodyCreate = (request, response, nextFunction) => {
            try {
                user_dto_1.createUserDTO.parse(request.body);
                nextFunction();
            }
            catch (error) {
                const customError = this.responseService.BadRequestException("Error al validar campos", error);
                response.status(customError.statusCode).json(customError);
            }
        };
        this.validateBodyEdit = (request, response, nextFunction) => {
            try {
                user_dto_1.editUserDTO.parse(request.body);
                nextFunction();
            }
            catch (error) {
                const customError = this.responseService.BadRequestException("Error al validar campos", error);
                response.status(customError.statusCode).json(customError);
            }
        };
    }
}
exports.default = UserMiddleware;
