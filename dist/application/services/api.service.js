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
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
class ApiService {
    constructor() {
        this.get = (base_api, module) => __awaiter(this, void 0, void 0, function* () {
            return yield axios_1.default.get(`${base_api}/${module}}`);
        });
        this.getWAuthorization = (base_api, token) => __awaiter(this, void 0, void 0, function* () {
            const headers = {
                Authorization: "Bearer " + token,
            };
            return yield axios_1.default.get(`${base_api}`, { headers });
        });
        this.getParam = (base_api, module, param) => __awaiter(this, void 0, void 0, function* () {
            return yield axios_1.default.get(`${base_api}/${module}/${param}`);
        });
        this.post = (base_api, module, data, headers = {}) => __awaiter(this, void 0, void 0, function* () {
            return yield axios_1.default.post(`${base_api}/${module}`, data, { headers });
        });
        this.post_x_www_urlencoded = (base_api, data) => __awaiter(this, void 0, void 0, function* () {
            const formattedData = qs_1.default.stringify(data);
            const headers = {
                "Content-Type": "application/x-www-form-urlencoded",
            };
            return yield axios_1.default.post(`${base_api}`, formattedData, { headers });
        });
    }
}
exports.default = ApiService;
