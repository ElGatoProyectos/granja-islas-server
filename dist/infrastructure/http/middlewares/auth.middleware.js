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
const response_service_1 = __importDefault(require("../../../application/services/response.service"));
const environments_constant_1 = require("../../config/environments.constant");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_dto_1 = require("./dto/auth.dto");
const user_enum_1 = require("../../../application/models/enums/user.enum");
const user_service_1 = __importDefault(require("../../../application/services/user.service"));
class AuthMiddleware {
    constructor() {
        this._jwt_token = environments_constant_1.environments.JWT_TOKEN;
        this.responseService = new response_service_1.default();
        this.userService = new user_service_1.default();
        // super();
    }
    get captureUnauthorizedException() {
        return this.responseService.UnauthorizedException("Error al autenticar usuario");
    }
    get captureBadRequestException() {
        return this.responseService.BadRequestException("Error en validación");
    }
    authToken(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authorization = request.get("Authorization");
                if (!authorization)
                    return this.responseService.UnauthorizedException();
                const [bearer, token] = authorization.split(" ");
                const decodedToken = jsonwebtoken_1.default.verify(token, this._jwt_token);
                const { data, success } = auth_dto_1.jwtDecodeDTO.safeParse(decodedToken);
                if (!success || !data)
                    return this.responseService.UnauthorizedException();
                const user = yield this.userService.findUserById(data.id);
                if (!user)
                    return this.responseService.UnauthorizedException();
                return this.responseService.SuccessResponse(undefined, user);
            }
            catch (error) {
                return this.responseService.UnauthorizedException();
            }
        });
    }
    authorizationUser(request, response, nextFunction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseValidation = yield this.authToken(request);
                if (responseValidation.error)
                    response
                        .status(this.captureUnauthorizedException.statusCode)
                        .json(this.captureUnauthorizedException);
                else
                    nextFunction();
            }
            catch (error) {
                response
                    .status(this.captureUnauthorizedException.statusCode)
                    .json(Object.assign(Object.assign({}, this.captureUnauthorizedException), { error }));
            }
        });
    }
    authorizationAdmin(request, response, nextFunction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseValidation = yield this.authToken(request);
                if (responseValidation.error)
                    response
                        .status(this.captureUnauthorizedException.statusCode)
                        .json(this.captureUnauthorizedException);
                else {
                    if (responseValidation.payload.role === user_enum_1.E_Role.USER)
                        response
                            .status(this.captureUnauthorizedException.statusCode)
                            .json(this.captureUnauthorizedException);
                    else
                        nextFunction();
                }
            }
            catch (error) {
                response
                    .status(this.captureUnauthorizedException.statusCode)
                    .json(Object.assign(Object.assign({}, this.captureUnauthorizedException), { error }));
            }
        });
    }
    authorizationSuperAdmin(request, response, nextFunction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseValidation = yield this.authToken(request);
                if (responseValidation.error)
                    response
                        .status(this.captureUnauthorizedException.statusCode)
                        .json(this.captureUnauthorizedException);
                else {
                    if (responseValidation.payload.role !== user_enum_1.E_Role.SUPERADMIN)
                        response
                            .status(this.captureUnauthorizedException.statusCode)
                            .json(this.captureUnauthorizedException);
                    else
                        nextFunction();
                }
            }
            catch (error) {
                response
                    .status(this.captureUnauthorizedException.statusCode)
                    .json(Object.assign(Object.assign({}, this.captureUnauthorizedException), { error }));
            }
        });
    }
    validateBody(request, response, nextFunction) {
        try {
            auth_dto_1.authDTO.parse(request.body);
            nextFunction();
        }
        catch (error) {
            response
                .status(this.captureBadRequestException.statusCode)
                .json(Object.assign(Object.assign({}, this.captureBadRequestException), { error }));
        }
    }
}
exports.default = AuthMiddleware;
