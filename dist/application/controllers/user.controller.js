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
const multer_1 = __importDefault(require("multer"));
const multer_constant_1 = require("../models/constants/multer.constant");
const response_service_1 = __importDefault(require("../services/response.service"));
const user_dto_1 = require("../../infrastructure/http/middlewares/dto/user.dto");
const path_1 = __importDefault(require("path"));
const app_root_path_1 = __importDefault(require("app-root-path"));
const sharp_1 = __importDefault(require("sharp"));
const storage = multer_1.default.memoryStorage();
class UserController {
    constructor() {
        this.findUsers = (request, response) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userService.findUsersNoSuperAdmin();
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
        //! pendiente la validacion de que solo pueda editar mi propio usuario
        this.edit = (request, response) => __awaiter(this, void 0, void 0, function* () {
            this.upload.single(multer_constant_1.userMulterProperties.field)(request, response, (err) => __awaiter(this, void 0, void 0, function* () {
                //todo validamos si hay un error
                if (err) {
                    const customError = this.responseService.BadRequestException("Error al procesar la imagen 2", err);
                    response.status(customError.statusCode).json(customError);
                }
                //todo validamos el archivo
                else {
                    const data = request.body;
                    try {
                        //todo validamos el parse
                        user_dto_1.createUserDTO.parse(request.body);
                        // - esto ya se valido en el middleware
                        //todo registramos a la empresa
                        const id = Number(request.params.id);
                        const result = yield this.userService.updateUserOrAdmin(data, id);
                        if (result.error) {
                            response.status(result.statusCode).json(result);
                            return;
                        }
                        if (request.file) {
                            const id = result.payload.id;
                            const direction = path_1.default.join(app_root_path_1.default.path, "public", multer_constant_1.userMulterProperties.folder);
                            const ext = path_1.default.extname(request.file.originalname);
                            const fileName = `${multer_constant_1.userMulterProperties.folder}_${id}${ext}`;
                            const filePath = path_1.default.join(direction, fileName);
                            (0, sharp_1.default)(request.file.buffer)
                                .resize({ width: 800 })
                                .toFormat("jpeg")
                                .jpeg({ quality: 80 })
                                .toFile(filePath, (err) => {
                                if (err) {
                                    const customError = this.responseService.BadRequestException("Error al guardar la imagen", err);
                                    response.status(customError.statusCode).json(customError);
                                }
                                else {
                                    response.status(result.statusCode).json(result);
                                }
                            });
                        }
                        else {
                            response.status(result.statusCode).json(result);
                        }
                    }
                    catch (error) {
                        const customError = this.responseService.BadRequestException("Error al validar los campos", error);
                        response.status(customError.statusCode).json(customError);
                    }
                }
            }));
        });
        this.userService = new user_service_1.default();
        this.responseService = new response_service_1.default();
        this.upload = (0, multer_1.default)({ storage: storage });
    }
}
exports.default = UserController;
