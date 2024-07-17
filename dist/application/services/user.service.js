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
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../infrastructure/database/prisma"));
const response_service_1 = __importDefault(require("./response.service"));
const bcrypt = __importStar(require("bcrypt"));
const user_enum_1 = require("../models/enums/user.enum");
class UserService {
    constructor() {
        this.responseService = new response_service_1.default();
    }
    findUsersNoAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield prisma_1.default.user.findMany({ where: { role: "USER" } });
                return this.responseService.SuccessResponse("Lista de usuarios", users);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException();
            }
            finally {
                yield prisma_1.default.$disconnect();
            }
        });
    }
    findUsersNoSuperAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield prisma_1.default.user.findMany({
                    where: {
                        role: {
                            in: ["USER", "ADMIN"],
                        },
                    },
                });
                return this.responseService.SuccessResponse("Lista de usuarios y administradores", users);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException();
            }
            finally {
                yield prisma_1.default.$disconnect();
            }
        });
    }
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield prisma_1.default.user.findFirst({ where: { id } });
                if (!user)
                    return this.responseService.NotFoundException("Usuario no encontrado");
                return this.responseService.SuccessResponse("Usuario encontrado con éxito", user);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException();
            }
            finally {
                yield prisma_1.default.$disconnect();
            }
        });
    }
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const password = bcrypt.hashSync(userData.password, 11);
                const userFormat = Object.assign(Object.assign({}, userData), { role: client_1.Role.USER, password });
                yield prisma_1.default.user.create({ data: userFormat });
                return this.responseService.CreatedResponse("Usuario registrado con éxito");
            }
            catch (error) {
                return this.responseService.InternalServerErrorException();
            }
            finally {
                yield prisma_1.default.$disconnect();
            }
        });
    }
    createAdmin(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const password = bcrypt.hashSync(userData.password, 11);
                const userFormat = Object.assign(Object.assign({}, userData), { role: client_1.Role.ADMIN, password });
                yield prisma_1.default.user.create({ data: userFormat });
                return this.responseService.CreatedResponse("Administrador registrado con éxito");
            }
            catch (error) {
                return this.responseService.InternalServerErrorException();
            }
            finally {
                yield prisma_1.default.$disconnect();
            }
        });
    }
    updateUserOrAdmin(userData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseUser = yield this.findUserById(userId);
                if (responseUser.error)
                    return responseUser;
                let userFormat;
                let role;
                if (userData.password && userData.password !== "") {
                    const newPassword = bcrypt.hashSync(userData.password, 11);
                    userFormat = Object.assign(Object.assign({}, userData), { password: newPassword });
                }
                role = userData.role === "ADMIN" ? client_1.Role.ADMIN : client_1.Role.USER;
                yield prisma_1.default.user.update({
                    data: Object.assign(Object.assign({}, userFormat), { role }),
                    where: { id: userId },
                });
                return this.responseService.SuccessResponse("Usuario modificado exitosamente");
            }
            catch (error) {
                return this.responseService.InternalServerErrorException();
            }
            finally {
                yield prisma_1.default.$disconnect();
            }
        });
    }
    updateSuperAdmin(userData, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userFormat;
                if (userData.password) {
                    const newPassword = bcrypt.hashSync(userData.password, 11);
                    userFormat = Object.assign(Object.assign({}, userData), { password: newPassword });
                }
                yield prisma_1.default.user.update({
                    data: Object.assign(Object.assign({}, userFormat), { role: client_1.Role.SUPERADMIN }),
                    where: { id },
                });
                return this.responseService.SuccessResponse("Usuario modificado exitosamente");
            }
            catch (error) {
                return this.responseService.InternalServerErrorException();
            }
            finally {
                yield prisma_1.default.$disconnect();
            }
        });
    }
    deleteById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseUser = yield this.findUserById(userId);
                if (responseUser.error)
                    return responseUser;
                if (responseUser.payload.role === user_enum_1.E_Role.SUPERADMIN)
                    return this.responseService.BadRequestException("Error al eliminar usuario");
                yield prisma_1.default.user.update({
                    where: { id: userId },
                    data: { status_deleted: true },
                });
                return this.responseService.SuccessResponse("Usuario modificado exitosamente");
            }
            catch (error) {
                return this.responseService.InternalServerErrorException();
            }
            finally {
                yield prisma_1.default.$disconnect();
            }
        });
    }
}
exports.default = UserService;
