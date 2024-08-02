import validator from "validator";
import prisma from "../../infrastructure/database/prisma";
import * as bcrypt from "bcrypt";
import ResponseService, { T_Response } from "./response.service";
import jwt from "jsonwebtoken";
import { environments } from "../../infrastructure/config/environments.constant";
import { jwtDecodeDTO } from "../../infrastructure/http/middlewares/dto/auth.dto";
import UserService from "./user.service";
import { Role } from "@prisma/client";

const jwt_token = environments.JWT_TOKEN;

class AuthService {
  private responseService: ResponseService;

  constructor() {
    this.responseService = new ResponseService();
  }

  login = async (credential: string, password: string): Promise<T_Response> => {
    try {
      let user;
      if (validator.isEmail(credential)) {
        user = await prisma.user.findFirst({ where: { email: credential } });
      } else {
        user = await prisma.user.findFirst({ where: { dni: credential } });
      }
      if (!user)
        return this.responseService.UnauthorizedException(
          "Error al validar credenciales"
        );
      const responseCompare = bcrypt.compareSync(password, user.password);
      if (!responseCompare)
        return this.responseService.UnauthorizedException(
          "Error al validar credenciales"
        );
      if (user.status_deleted || !user.status_enabled)
        return this.responseService.UnauthorizedException(
          "Error al validar credenciales"
        );
      const token = jwt.sign({ id: user.id, role: user.role }, jwt_token, {
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
      return this.responseService.SuccessResponse(
        "Autenticación correcta",
        responseFormat
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException();
    } finally {
      await prisma.$disconnect();
    }
  };

  getUserForToken = async (token: string) => {
    try {
      const [bearer, jwtToken] = token.split(" ");
      if (!validator.isJWT(jwtToken))
        return this.responseService.UnauthorizedException(
          "Error al obtener información"
        );

      const decodeToken = jwt.verify(jwtToken, jwt_token);
      const { data, success } = jwtDecodeDTO.safeParse(decodeToken);
      if (data && success) {
        const user = await prisma.user.findFirst({ where: { id: data.id } });
        return this.responseService.SuccessResponse(undefined, user);
        // return this.responseService.SuccessResponse(undefined, decodeToken);
      } else {
        return this.responseService.UnauthorizedException(
          "Error al obtener información"
        );
      }
    } catch (error) {
      return this.responseService.InternalServerErrorException();
    } finally {
      await prisma.$disconnect();
    }
  };

  //- temporal
  async validatePasswordSuperAdmin(password: string) {
    try {
      const superadmin = await prisma.user.findFirst({
        where: { role: Role.SUPERADMIN },
      });

      if (!superadmin)
        return this.responseService.UnauthorizedException(
          "Acción no autorizada"
        );

      const responseCompare = bcrypt.compareSync(password, superadmin.password);

      if (!responseCompare)
        return this.responseService.UnauthorizedException(
          "Acción no autorizada"
        );
      return this.responseService.SuccessResponse("Acción autorizada");
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    } finally {
      await prisma.$disconnect();
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

export default AuthService;
