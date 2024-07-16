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
        // model Company {
        //   id             Int      @id @default(autoincrement())
        //   business_name  String   @unique
        //   description    String   @db.Text()
        //   ruc            String   @unique
        //   key            String
        //   status_deleted Boolean? @default(true)
        //   created_at DateTime @default(now())
        //   updated_at DateTime @updatedAt
        // }
        this.queryForRuc = (ruc) => __awaiter(this, void 0, void 0, function* () {
            console.log("ruc", ruc);
            try {
                console.log(base_api_query, this.base_api_query_module, ruc);
                const data = yield this.apiService.getParam(base_api_query, this.base_api_query_module, ruc);
                console.log("data", data);
                const formatData = {
                // ruc: data.ruc.split("-")[0],
                // business_name: data.nombre_comercial,
                // business_type: data.tipo_contribuyente,
                // business_status: data.estado_contribuyente,
                // business_direction_fiscal: data.domicilio_fiscal,
                };
                return this.responseService.SuccessResponse("Datos de usuario", formatData);
            }
            catch (error) {
                console.log(error);
                return this.responseService.InternalServerErrorException("Error en servicio", error);
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
        this.responseService = new response_service_1.default();
        this.apiService = new api_service_1.default();
    }
}
exports.default = SunatService;
