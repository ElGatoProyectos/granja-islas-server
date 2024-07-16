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
const response_service_1 = __importDefault(require("../../../application/services/response.service"));
const validator_1 = __importDefault(require("validator"));
const company_service_1 = __importDefault(require("../../../application/services/company.service"));
class CompanyMiddleware {
    constructor() {
        this.generateBadRequestException = (message) => {
            return this.responseService.BadRequestException(message);
        };
        //* success
        this.validateCompany = (request, response, nextFunction) => __awaiter(this, void 0, void 0, function* () {
            try {
                const customError = this.generateBadRequestException("Error al validar empresa");
                if (!validator_1.default.isNumeric(request.params.id)) {
                    response.status(customError.statusCode).json(customError);
                }
                else {
                    const company = yield this.companyService.findById(Number(request.params.id));
                    if (company.error) {
                        response.status(customError.statusCode).json(customError);
                    }
                    else {
                        nextFunction();
                    }
                }
            }
            catch (error) {
                const customError = this.responseService.BadRequestException("Error al validar empresa", error);
                response.status(customError.statusCode).json(customError);
            }
        });
        this.responseService = new response_service_1.default();
        this.companyService = new company_service_1.default();
    }
}
exports.default = CompanyMiddleware;
