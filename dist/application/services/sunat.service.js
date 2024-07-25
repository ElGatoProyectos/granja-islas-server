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
require("dotenv/config");
const environments_constant_1 = require("../../infrastructure/config/environments.constant");
const api_service_1 = __importDefault(require("./api.service"));
const response_service_1 = __importDefault(require("./response.service"));
const base_api_sunat = environments_constant_1.environments.BASE_API_SUNAT;
const base_api_query = environments_constant_1.environments.BASE_API_QUERY;
class SunatService {
    constructor() {
        this.base_api_query_module = "ruc";
        this.queryForRuc = (ruc) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { data: response } = yield this.apiService.getParam(base_api_query, this.base_api_query_module, ruc);
                const data = response.data;
                const formatData = {
                    ruc: data.ruc.split("-")[0].trim(),
                    business_name: data.nombre_comercial,
                    business_type: data.tipo_contribuyente,
                    business_status: data.estado_contribuyente,
                    business_direction_fiscal: data.domicilio_fiscal,
                };
                return this.responseService.SuccessResponse("Datos de usuario", formatData);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
        });
        this.findBills = (ruc, key) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.apiService.post("", "", {});
            }
            catch (error) {
                return this.responseService.InternalServerErrorException();
            }
        });
        this.captureDataSire = (config) => __awaiter(this, void 0, void 0, function* () {
            try {
                const responseToken = yield this.captureTokenSecurity();
                if (responseToken.error)
                    return responseToken;
                const headers = {
                    Authorization: "Bearer " + responseToken.payload.access_token,
                };
                const response = yield this.apiService.post(base_api_query, "api/v1/comprobantes/detalle", config, headers);
                return this.responseService.SuccessResponse(undefined, response.data);
            }
            catch (error) {
                console.log(error);
                return this.responseService.InternalServerErrorException(undefined, error);
            }
        });
        //- Por aquí deberían pasar todas las credenciales, client_id, client_secret, username, password
        this.captureTokenSecurity = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = {
                    grant_type: "password",
                    scope: "https://api-cpe.sunat.gob.pe",
                    client_id: environments_constant_1.environments.CLIENT_ID,
                    client_secret: environments_constant_1.environments.CLIENT_SECRET,
                    username: environments_constant_1.environments.USERNAME_SUNAT,
                    password: environments_constant_1.environments.PASSWORD_SUNAT,
                };
                const response = yield this.apiService.post_x_www_urlencoded(environments_constant_1.environments.BASE_API_GET_TOKEN, data);
                return this.responseService.SuccessResponse("", response.data);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException(undefined, error);
            }
        });
        this.responseService = new response_service_1.default();
        this.apiService = new api_service_1.default();
    }
}
exports.default = SunatService;
