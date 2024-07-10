import validator from "validator";
import prisma from "../prisma";
import * as bcrypt from "bcrypt";
import { responseService, T_Response } from "./response.service";
import jwt from "jsonwebtoken";
import { environments } from "../models/constants/environments.constant";

const jwt_token = environments.JWT_TOKEN;

class AuthService {
  async login(credential: string, password: string): Promise<T_Response> {
    try {
      let user;
      if (validator.isEmail(credential)) {
        user = await prisma.user.findFirst({ where: { email: credential } });
      } else {
        user = await prisma.user.findFirst({ where: { dni: credential } });
      }
      if (!user)
        return responseService.UnauthorizedException(
          "Error al validar credenciales"
        );
      const responseCompare = bcrypt.compareSync(password, user.password);
      if (!responseCompare)
        return responseService.UnauthorizedException(
          "Error al validar credenciales"
        );
      const token = jwt.sign({ id: user.id, role: user.role }, jwt_token);
      const responseFormat = {
        user: {
          id: user.id,
          role: user.role,
          full_name: user.name + " " + user.last_name,
        },
        token,
      };
      return responseService.SuccessResponse(
        "Autenticación correcta",
        responseFormat
      );
    } catch (error) {
      return responseService.InternalServerErrorException();
    }
  }

  async restorePassword(credential: string) {
    try {
      if (validator.isEmail(credential)) {
      } else {
      }
    } catch (error) {}
  }
}

export const authService = new AuthService();
