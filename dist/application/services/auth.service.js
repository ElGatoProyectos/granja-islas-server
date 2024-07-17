"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.authService = void 0;
const validator_1 = __importDefault(require("validator"));
const prisma_1 = __importDefault(require("../../infrastructure/database/prisma"));
const bcrypt = __importStar(require("bcrypt"));
const response_service_1 = __importDefault(require("./response.service"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const environments_constant_1 = require("../../infrastructure/config/environments.constant");
const jwt_token = environments_constant_1.environments.JWT_TOKEN;
class AuthService {
    constructor() {
        this.login = (credential, password) => __awaiter(this, void 0, void 0, function* () {
            try {
                let user;
                if (validator_1.default.isEmail(credential)) {
                    user = yield prisma_1.default.user.findFirst({ where: { email: credential } });
                }
                else {
                    user = yield prisma_1.default.user.findFirst({ where: { dni: credential } });
                }
                if (!user)
                    return this.responseService.UnauthorizedException("Error al validar credenciales");
                const responseCompare = bcrypt.compareSync(password, user.password);
                if (!responseCompare)
                    return this.responseService.UnauthorizedException("Error al validar credenciales");
                if (user.status_deleted || !user.status_enabled)
                    return this.responseService.UnauthorizedException("Error al validar credenciales");
                const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, jwt_token, {
                    expiresIn: "24h",
                });
                const responseFormat = {
                    user: {
                        id: user.id,
                        role: user.role,
                        full_name: user.name + " " + user.last_name,
                    },
                    token,
                };
                return this.responseService.SuccessResponse("Autenticación correcta", responseFormat);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException();
            }
            finally {
                yield prisma_1.default.$disconnect();
            }
        });
        this.responseService = new response_service_1.default();
    }
    restorePassword(credential) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (validator_1.default.isEmail(credential)) {
                }
                else {
                }
            }
            catch (error) { }
        });
    }
}
exports.authService = new AuthService();
