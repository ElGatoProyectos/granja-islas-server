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
const response_service_1 = __importDefault(require("./response.service"));
const base_controller_1 = __importDefault(require("../controllers/config/base.controller"));
const prisma_1 = __importDefault(require("../../infrastructure/database/prisma"));
const bcrypt = __importStar(require("bcrypt"));
class SeedService extends base_controller_1.default {
    constructor() {
        super();
        this.responseService = new response_service_1.default();
    }
    createSeed() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = [
                    {
                        role: client_1.Role.SUPERADMIN,
                        name: "Super admin",
                        last_name: "Test",
                        phone: "909808903",
                        email: "superadmin@gmail.com",
                        dni: "12345678",
                    },
                    {
                        role: client_1.Role.ADMIN,
                        name: "User ",
                        last_name: "Test",
                        phone: "909808903",
                        email: "admin@gmail.com",
                        dni: "23232323",
                    },
                    {
                        role: client_1.Role.USER,
                        name: "User Admin",
                        last_name: "Last name",
                        phone: "909808903",
                        email: "user@gmail.com",
                        dni: "45454545",
                    },
                ];
                const companies = [
                    {
                        business_name: "Example company 1",
                        business_type: "Example type",
                        business_status: "Example status",
                        business_direction_fiscal: "Example direction",
                        description: "Description example company",
                        user: "hans23232",
                        phone: "40343040",
                        country_code: "+51",
                        ruc: "12345645645",
                        key: "adawdadadwad",
                    },
                    {
                        business_name: "Example company 2",
                        business_type: "Example type 2",
                        business_status: "Example status 2",
                        business_direction_fiscal: "Example direction 2",
                        description: "Description example company",
                        user: "wda900adw",
                        phone: "40343040",
                        country_code: "+51",
                        ruc: "90878965434",
                        key: "adawdadadwad",
                    },
                ];
                const usersValidate = yield prisma_1.default.user.findMany();
                const companiesValidate = yield prisma_1.default.company.findMany();
                if (usersValidate.length > 0 || companiesValidate.length > 0)
                    return this.responseService.BadRequestException("No se puede ejecutar el seed");
                Promise.all(users.map((user) => __awaiter(this, void 0, void 0, function* () {
                    const password = bcrypt.hashSync(user.dni, 11);
                    yield prisma_1.default.user.create({
                        data: Object.assign(Object.assign({}, user), { password }),
                    });
                })));
                Promise.all(companies.map((company) => __awaiter(this, void 0, void 0, function* () {
                    yield prisma_1.default.company.create({
                        data: company,
                    });
                })));
                return this.responseService.SuccessResponse("Seed executed!");
            }
            catch (error) {
                return this.responseService.InternalServerErrorException("");
            }
            finally {
                yield prisma_1.default.$disconnect();
            }
        });
    }
}
exports.default = SeedService;
