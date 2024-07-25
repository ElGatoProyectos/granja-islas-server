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

      const companies = [
        {
          business_name: "Example company 1",
          business_type: "Example type",
          business_status: "Example status",
          business_direction_fiscal: "Example direction",
          description: "Description example company",
          user: "hans23232",
          phone: "40343040",
          country_code: "+51",
          ruc: "12345645645",
          key: "adawdadadwad",
        },
        {
          business_name: "Example company 2",
          business_type: "Example type 2",
          business_status: "Example status 2",
          business_direction_fiscal: "Example direction 2",
          description: "Description example company",
          user: "wda900adw",
          phone: "40343040",
          country_code: "+51",
          ruc: "90878965434",
          key: "adawdadadwad",
        },
      ];

      const usersValidate = await prisma.user.findMany();
      const companiesValidate = await prisma.company.findMany();

      if (usersValidate.length > 0 || companiesValidate.length > 0)
        return this.responseService.BadRequestException(
          "No se puede ejecutar el seed"
        );

      Promise.all(
        users.map(async (user) => {
          const password = bcrypt.hashSync(user.dni, 11);
          await prisma.user.create({
            data: { ...user, password },
          });
        })
      );

      Promise.all(
        companies.map(async (company) => {
          await prisma.company.create({
            data: company,
          });
        })
      );

      return this.responseService.SuccessResponse("Seed executed!");
    } catch (error) {
      return this.responseService.InternalServerErrorException("");
    } finally {
      await prisma.$disconnect();
    }
  }
}
