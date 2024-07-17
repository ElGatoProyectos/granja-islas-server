import { NextFunction, Request, Response } from "express";
import ResponseService from "../../../application/services/response.service";
import { environments } from "../../config/environments.constant";
import jwt from "jsonwebtoken";
import { authDTO, jwtDecodeDTO } from "./dto/auth.dto";
import { E_Role } from "../../../application/models/enums/user.enum";
import BaseController from "../../../application/controllers/config/base.controller";
import UserService from "../../../application/services/user.service";

export default class AuthMiddleware {
  private _jwt_token: string = environments.JWT_TOKEN;
  private responseService: ResponseService = new ResponseService();
  private userService: UserService = new UserService();

  constructor() {}

  get captureUnauthorizedException() {
    return this.responseService.UnauthorizedException(
      "Error al autenticar usuario"
    );
  }

  get captureBadRequestException() {
    return this.responseService.BadRequestException("Error en validación");
  }
  authToken = async (request: Request) => {
    try {
      const authorization = request.get("Authorization");

      if (!authorization) return this.responseService.UnauthorizedException();

      const [bearer, token] = authorization.split(" ");

      const decodedToken = jwt.verify(token, this._jwt_token);

      const { data, success } = jwtDecodeDTO.safeParse(decodedToken);

      if (!success || !data)
        return this.responseService.UnauthorizedException();

      const user = await this.userService.findUserById(data.id);

      if (!user) return this.responseService.UnauthorizedException();

      return this.responseService.SuccessResponse(undefined, user);
    } catch (error) {
      return this.responseService.UnauthorizedException();
    }
  };

  authorizationUser = async (
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) => {
    try {
      const responseValidation = await this.authToken(request);
      if (responseValidation.error)
        response.status(responseValidation.statusCode).json(responseValidation);
      else nextFunction();
    } catch (error) {
      response
        .status(this.captureUnauthorizedException.statusCode)
        .json({ ...this.captureBadRequestException, payload: error });
    }
  };

  authorizationAdmin = async (
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) => {
    try {
      const responseValidation = await this.authToken(request);
      if (responseValidation.error)
        response
          .status(this.captureUnauthorizedException.statusCode)
          .json(this.captureUnauthorizedException);
      else {
        if (responseValidation.payload.role === E_Role.USER)
          response
            .status(this.captureUnauthorizedException.statusCode)
            .json(this.captureUnauthorizedException);
        else nextFunction();
      }
    } catch (error) {
      response
        .status(this.captureUnauthorizedException.statusCode)
        .json({ ...this.captureBadRequestException, payload: error });
    }
  };

  authorizationSuperAdmin = async (
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) => {
    try {
      const responseValidation = await this.authToken(request);
      if (responseValidation.error)
        response
          .status(this.captureUnauthorizedException.statusCode)
          .json(this.captureUnauthorizedException);
      else {
        if (responseValidation.payload.role !== E_Role.SUPERADMIN)
          response
            .status(this.captureUnauthorizedException.statusCode)
            .json(this.captureUnauthorizedException);
        else nextFunction();
      }
    } catch (error) {
      response
        .status(this.captureUnauthorizedException.statusCode)
        .json({ ...this.captureBadRequestException, payload: error });
    }
  };

  validateBody = (
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) => {
    try {
      authDTO.parse(request.body);
      nextFunction();
    } catch (error) {
      response
        .status(this.captureBadRequestException.statusCode)
        .json({ ...this.captureBadRequestException, payload: error });
    }
  };
}
