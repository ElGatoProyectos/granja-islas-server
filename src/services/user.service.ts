import { Role } from "@prisma/client";
import { I_Sunat } from "../models/interfaces/sunat.interface";
import {
  I_CreateUser,
  I_UpdateUser,
} from "../models/interfaces/user.interface";
import prisma from "../prisma";
import { responseService } from "./response.service";
import * as bcrypt from "bcrypt";

class UserService {
  async findUsersNoAdmin() {
    try {
      const users = await prisma.user.findMany({ where: { role: "USER" } });
      return responseService.SuccessResponse("Lista de usuarios", users);
    } catch (error) {
      return responseService.InternalServerErrorException();
    }
  }

  async findUsersNoSuperAdmin() {
    try {
      const users = await prisma.user.findMany({
        where: {
          role: {
            in: ["USER", "ADMIN"],
          },
        },
      });

      return responseService.SuccessResponse(
        "Lista de usuarios y administradores",
        users
      );
    } catch (error) {
      return responseService.InternalServerErrorException();
    }
  }

  async findUserById(id: number) {
    try {
      const user = await prisma.user.findFirst({ where: { id } });
      if (!user)
        return responseService.NotFoundException("Usuario no encontrado");
      return responseService.SuccessResponse(
        "Usuario encontrado con éxito",
        user
      );
    } catch (error) {
      return responseService.InternalServerErrorException();
    }
  }

  async createUserForRuc(userData: I_CreateUser) {
    try {
      const password = bcrypt.hashSync(userData.password, 11);
      const userFormat = { ...userData, role: Role.USER, password };
      await prisma.user.create({ data: userFormat });

      return responseService.CreatedResponse("Usuario registrado con éxito");
    } catch (error) {
      return responseService.InternalServerErrorException();
    }
  }

  async createAdmin(userData: I_CreateUser) {
    try {
      const password = bcrypt.hashSync(userData.password, 11);
      const userFormat = { ...userData, role: Role.ADMIN, password };
      await prisma.user.create({ data: userFormat });
      return responseService.CreatedResponse(
        "Administrador registrado con éxito"
      );
    } catch (error) {
      return responseService.InternalServerErrorException();
    }
  }

  async updateUserOrAdmin(userData: I_UpdateUser, id: number) {
    try {
      let userFormat;
      let role: Role;
      if (userData.password) {
        const newPassword = bcrypt.hashSync(userData.password, 11);
        userFormat = { ...userData, password: newPassword };
      }

      role = userData.role === "ADMIN" ? Role.ADMIN : Role.USER;

      await prisma.user.update({
        data: { ...userFormat, role },
        where: { id },
      });
      return responseService.SuccessResponse("Usuario modificado exitosamente");
    } catch (error) {
      return responseService.InternalServerErrorException();
    }
  }

  async updateSuperAdmin(userData: I_UpdateUser, id: number) {
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
      return responseService.SuccessResponse("Usuario modificado exitosamente");
    } catch (error) {
      return responseService.InternalServerErrorException();
    }
  }
}

export const userService = new UserService();
