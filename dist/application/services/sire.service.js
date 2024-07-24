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
const environments_constant_1 = require("../../infrastructure/config/environments.constant");
const api_service_1 = __importDefault(require("./api.service"));
const response_service_1 = __importDefault(require("./response.service"));
const sunat_service_1 = __importDefault(require("./sunat.service"));
class SireService {
    constructor() {
        this.captureData = () => __awaiter(this, void 0, void 0, function* () {
            try {
                return this.responseService.SuccessResponse();
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
        });
        this.getBills = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const queryParams = "?codTipoOpe=3&page=1&perPage=100";
                const path = environments_constant_1.environments.BASE_API_SIRE + queryParams;
                const responseToken = yield this.sunatService.captureTokenSecurity();
                if (responseToken.error)
                    return responseToken;
                const response = yield this.apiService.getWAuthorization(environments_constant_1.environments.BASE_API_SIRE + queryParams, responseToken.payload.access_token);
                return this.responseService.SuccessResponse("Listado de facturas", response.data);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
        });
        this.responseService = new response_service_1.default();
        this.apiService = new api_service_1.default();
        this.sunatService = new sunat_service_1.default();
    }
}
exports.default = SireService;
