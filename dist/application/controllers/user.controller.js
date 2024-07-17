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
const user_service_1 = __importDefault(require("../services/user.service"));
class UserController {
    constructor() {
        this.findUsers = (request, response) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userService.findUsersNoAdmin();
            response.status(response.statusCode).json(result);
        });
        this.findUserById = (request, response) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            const result = yield this.userService.findUserById(Number(id));
            response.status(response.statusCode).json(result);
        });
        this.create = (request, response) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            const result = yield this.userService.findUserById(Number(id));
            response.status(response.statusCode).json(result);
        });
        this.userService = new user_service_1.default();
    }
}
exports.default = UserController;
