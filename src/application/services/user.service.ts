import { Role } from "@prisma/client";
import { I_Sunat } from "../models/interfaces/sunat.interface";
import {
  I_CreateUser,
  I_UpdateUser,
} from "../models/interfaces/user.interface";
import prisma from "../../infrastructure/database/prisma";
import ResponseService, { T_Response } from "./response.service";
import * as bcrypt from "bcrypt";
import BaseController from "../controllers/config/base.controller";
import { E_Role } from "../models/enums/user.enum";
import appRootPath from "app-root-path";
import { userMulterProperties } from "../models/constants/multer.constant";

import fs from "fs/promises";

class UserService {
  private responseService: ResponseService;
  constructor() {
    this.responseService = new ResponseService();
  }

  async findUsersNoAdmin(): Promise<T_Response> {
    try {
      const users = await prisma.user.findMany({
        omit: {
          password: true,
        },
        where: { role: "USER" },
      });
      return this.responseService.SuccessResponse("Lista de usuarios", users);
    } catch (error) {
      return this.responseService.InternalServerErrorException();
    } finally {
      await prisma.$disconnect();
    }
  }

  async findUsersNoSuperAdmin(): Promise<T_Response> {
    try {
      const users = await prisma.user.findMany({
        omit: {
          password: true,
        },
        where: {
          role: {
            in: ["USER", "ADMIN"],
          },
        },
      });

      return this.responseService.SuccessResponse(
        "Lista de usuarios y administradores",
        users
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException();
    } finally {
      await prisma.$disconnect();
    }
  }

  async findUserById(id: number): Promise<T_Response> {
    try {
      const user = await prisma.user.findFirst({ where: { id } });
      if (!user)
        return this.responseService.NotFoundException("Usuario no encontrado");
      return this.responseService.SuccessResponse(
        "Usuario encontrado con éxito",
        user
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException();
    } finally {
      await prisma.$disconnect();
    }
  }

  async findImage(id: number): Promise<T_Response> {
    try {
      const responseUser = await this.findUserById(id);
      if (responseUser.error)
        return this.responseService.NotFoundException("Usuario no encontrado");

      const imagePath =
        appRootPath +
        "/public/" +
        userMulterProperties.folder +
        "/" +
        userMulterProperties.folder +
        "_" +
        responseUser.payload.id +
        ".jpg";

      try {
        await fs.access(imagePath, fs.constants.F_OK);
      } catch (error) {
        return this.responseService.BadRequestException("Imagen no encontrada");
      }

      return this.responseService.SuccessResponse(undefined, imagePath);
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    } finally {
      prisma.$disconnect();
    }
  }

  async createUser(userData: I_CreateUser): Promise<T_Response> {
    try {
      const password = bcrypt.hashSync(userData.password, 11);
      const userFormat = { ...userData, role: Role.USER, password };
      await prisma.user.create({ data: userFormat });

      return this.responseService.CreatedResponse(
        "Usuario registrado con éxito"
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException();
    } finally {
      await prisma.$disconnect();
    }
  }

  async createAdmin(userData: I_CreateUser): Promise<T_Response> {
    try {
      const password = bcrypt.hashSync(userData.password, 11);
      const userFormat = { ...userData, role: Role.ADMIN, password };
      await prisma.user.create({ data: userFormat });
      return this.responseService.CreatedResponse(
        "Administrador registrado con éxito"
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException();
    } finally {
      await prisma.$disconnect();
    }
  }
  async createUserOrAdmin(userData: I_CreateUser): Promise<T_Response> {
    try {
      const password = bcrypt.hashSync(userData.password, 11);
      let role = userData.role === "ADMIN" ? Role.ADMIN : Role.USER;
      const userFormat = { ...userData, role, password };
      const created = await prisma.user.create({
        data: userFormat,
        omit: { password: true },
      });
      return this.responseService.CreatedResponse(
        "Administrador registrado con éxito",
        created
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException();
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateUserOrAdmin(
    userData: I_UpdateUser,
    userId: number
  ): Promise<T_Response> {
    try {
      const responseUser = await this.findUserById(userId);
      if (responseUser.error) return responseUser;

      let userFormat;
      let role: Role;
      if (userData.password && userData.password !== "") {
        const newPassword = bcrypt.hashSync(userData.password, 11);
        userFormat = { ...userData, password: newPassword };
      }

      role = userData.role === "ADMIN" ? Role.ADMIN : Role.USER;

      const updated = await prisma.user.update({
        data: { ...userFormat, role },
        where: { id: userId },
        omit: { password: true },
      });
      return this.responseService.SuccessResponse(
        "Usuario modificado exitosamente",
        updated
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException();
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateSuperAdmin(
    userData: I_UpdateUser,
    id: number
  ): Promise<T_Response> {
    try {
      let userFormat;
      if (userData.password) {
        const newPassword = bcrypt.hashSync(userData.password, 11);
        userFormat = { ...userData, password: newPassword };
      }
      await prisma.user.update({
        data: { ...userFormat, role: Role.SUPERADMIN },
        where: { id },
      });
      return this.responseService.SuccessResponse(
        "Usuario modificado exitosamente"
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException();
    } finally {
      await prisma.$disconnect();
    }
  }

  async deleteById(userId: number) {
    try {
      const responseUser = await this.findUserById(userId);
      if (responseUser.error) return responseUser;

      if (responseUser.payload.role === E_Role.SUPERADMIN)
        return this.responseService.BadRequestException(
          "Error al eliminar usuario"
        );
      await prisma.user.update({
        where: { id: userId },
        data: { status_deleted: true },
      });
      return this.responseService.SuccessResponse(
        "Usuario modificado exitosamente"
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException();
    } finally {
      await prisma.$disconnect();
    }
  }
}

export default UserService;
