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
const company_service_1 = __importDefault(require("../services/company.service"));
const response_service_1 = __importDefault(require("../services/response.service"));
const multer_1 = __importDefault(require("multer"));
const multer_constant_1 = require("../models/constants/multer.constant");
const path_1 = __importDefault(require("path"));
const app_root_path_1 = __importDefault(require("app-root-path"));
const sharp_1 = __importDefault(require("sharp"));
const company_dto_1 = require("../../infrastructure/http/middlewares/dto/company.dto");
const storage = multer_1.default.memoryStorage();
class CompanyController {
    constructor() {
        //* success
        this.create = (request, response) => __awaiter(this, void 0, void 0, function* () {
            this.upload.single(multer_constant_1.companyMulterProperties.field)(request, response, (err) => __awaiter(this, void 0, void 0, function* () {
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
                        company_dto_1.createCompanyDTO.parse(request.body);
                        //todo registramos a la empresa
                        const result = yield this.companyService.create(data);
                        if (result.error) {
                            response.status(result.statusCode).json(result);
                            return;
                        }
                        if (request.file) {
                            const id = result.payload.id;
                            const direction = path_1.default.join(app_root_path_1.default.path, "public", multer_constant_1.companyMulterProperties.folder);
                            const ext = path_1.default.extname(request.file.originalname);
                            const fileName = `${multer_constant_1.companyMulterProperties.folder}_${id}${ext}`;
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
                        const customError = this.responseService.BadRequestException("Error al validar los campos", err);
                        response.status(customError.statusCode).json(customError);
                    }
                }
            }));
        });
        //* success
        this.findAll = (request, response) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.companyService.findAll();
            response.status(result.statusCode).json(result);
        });
        //* success
        this.findAllWithDeleted = (request, response) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.companyService.findAllWithDeleted();
            response.status(result.statusCode).json(result);
        });
        //* success
        this.findBydId = (request, response) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            const result = yield this.companyService.deleteById(+id);
            response.status(result.statusCode).json(result);
        });
        //* success
        this.updateById = (request, response) => __awaiter(this, void 0, void 0, function* () {
            this.upload.single(multer_constant_1.companyMulterProperties.field)(request, response, (err) => __awaiter(this, void 0, void 0, function* () {
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
                        company_dto_1.updateCompanyDTO.parse(request.body);
                        //todo registramos a la empresa
                        const result = yield this.companyService.updateById(Number(request.params.id), data);
                        if (result.error) {
                            response.status(result.statusCode).json(result);
                            return;
                        }
                        if (request.file) {
                            const id = result.payload.id;
                            const direction = path_1.default.join(app_root_path_1.default.path, "public", multer_constant_1.companyMulterProperties.folder);
                            const ext = path_1.default.extname(request.file.originalname);
                            const fileName = `${multer_constant_1.companyMulterProperties.folder}_${id}${ext}`;
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
                        const customError = this.responseService.BadRequestException("Error al validar los campos", err);
                        response.status(customError.statusCode).json(customError);
                    }
                }
            }));
        });
        //* success
        this.deleteById = (request, response) => __awaiter(this, void 0, void 0, function* () {
            const companyId = request.params.id;
            const result = yield this.companyService.deleteById(Number(companyId));
            response.status(result.statusCode).json(result);
        });
        this.companyService = new company_service_1.default();
        this.responseService = new response_service_1.default();
        this.upload = (0, multer_1.default)({ storage: storage });
    }
}
exports.default = CompanyController;
