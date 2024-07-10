import { NextFunction, Request, Response } from "express";
import { responseService } from "../services/response.service";
import { environments } from "../models/constants/environments.constant";
import jwt from "jsonwebtoken";
import { jwtDecodeDTO } from "./dto/auth.dto";
import { userService } from "../services/user.service";

const jwt_token = environments.JWT_TOKEN;

const result = responseService.UnauthorizedException(
  "Error al autenticar usuario"
);

class AuthMiddleware {
  async authToken(request: Request) {
    try {
      const authorization = request.get("Authorization");

      if (!authorization) return responseService.UnauthorizedException();

      const [bearer, token] = authorization.split(" ");

      const decodedToken = jwt.sign(token, jwt_token, { expiresIn: "24h" });

      const { data, success } = jwtDecodeDTO.safeParse(decodedToken);

      if (!success || !data) return responseService.UnauthorizedException();

      const user = await userService.findUserById(data.id);

      if (!user) return responseService.UnauthorizedException();

      return responseService.SuccessResponse(undefined, user);
    } catch (error) {
      return responseService.UnauthorizedException();
    }
  }

  async authorizationUser(
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) {
    try {
      const responseValidation = await this.authToken(request);
      if (responseValidation.error)
        response.status(result.statusCode).json(result);
      else nextFunction();
    } catch (error) {
      response.status(result.statusCode).json(result);
    }
  }

  async authorizationAdmin(
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) {
    try {
      const responseValidation = await this.authToken(request);
      if (responseValidation.error)
        response.status(result.statusCode).json(result);
      else {
        if (responseValidation.payload.role === "USER")
          response.status(result.statusCode).json(result);
        else nextFunction();
      }
    } catch (error) {
      response.status(result.statusCode).json(result);
    }
  }

  async authorizationSuperAdmin(
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) {
    try {
      const responseValidation = await this.authToken(request);
      if (responseValidation.error)
        response.status(result.statusCode).json(result);
      else {
        if (responseValidation.payload.role !== "SUPERADMIN")
          response.status(result.statusCode).json(result);
        else nextFunction();
      }
    } catch (error) {
      response.status(result.statusCode).json(result);
    }
  }
}
