import { Role } from "@prisma/client";
import ResponseService, { T_Response } from "./response.service";
import BaseController from "../controllers/config/base.controller";
import prisma from "../../infrastructure/database/prisma";
import * as bcrypt from "bcrypt";

export default class SeedService extends BaseController {
  private responseService: ResponseService;
  constructor() {
    super();
    this.responseService = new ResponseService();
  }

  async createSeed(): Promise<T_Response> {
    try {
      const users = [
        {
          role: Role.SUPERADMIN,
          name: "Super admin",
          last_name: "Test",
          phone: "909808903",
          email: "superadmin@gmail.com",
          dni: "12345678",
        },
        {
          role: Role.ADMIN,
          name: "User ",
          last_name: "Test",
          phone: "909808903",
          email: "admin@gmail.com",
          dni: "23232323",
        },
        {
          role: Role.USER,
          name: "User Admin",
          last_name: "Last name",
          phone: "909808903",
          email: "user@gmail.com",
          dni: "45454545",
        },
      ];

      Promise.all(
        users.map(async (user) => {
          const password = bcrypt.hashSync(user.dni, 11);
          const created = await prisma.user.create({
            data: { ...user, password },
          });
        })
      );

      return this.responseService.SuccessResponse("Seed executed!");
    } catch (error) {
      return this.responseService.InternalServerErrorException("");
    }
  }
}
