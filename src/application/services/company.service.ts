import prisma from "../../infrastructure/database/prisma";
import BaseController from "../controllers/config/base.controller";
import { I_UpdateCompany } from "../models/interfaces/company.interface";
import ResponseService from "./response.service";

export default class CompanyService extends BaseController {
  private responseService: ResponseService;

  constructor() {
    super();

    this.responseService = new ResponseService();
  }
  async findAll() {
    try {
      const companies = await prisma.company.findMany({
        where: { status_enabled: true },
      });
      return this.responseService.SuccessResponse(
        "Listado de empresas",
        companies
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException();
    }
  }

  async findById(companyId: number) {
    try {
      const company = await prisma.company.findFirst({
        where: { id: companyId },
      });
      if (!company)
        return this.responseService.NotFoundException("Empresa no encontrada");
      return this.responseService.SuccessResponse(
        "Empresa encontrada con éxito",
        company
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException();
    }
  }

  async create(data: any) {
    try {
      console.log(data);
      const created = await prisma.company.create({ data });
      return this.responseService.CreatedResponse(
        "Empresa creada con éxito!",
        created
      );
    } catch (error) {
      console.log(error);
      return this.responseService.InternalServerErrorException();
    }
  }

  async updateById(companyId: number, data: I_UpdateCompany) {
    try {
      const responseCompany = await this.findById(companyId);
      if (responseCompany.error) return responseCompany;

      await prisma.company.update({ where: { id: companyId }, data });
      return this.responseService.SuccessResponse(
        "Empresa modificada correctamente"
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException();
    }
  }

  async deleteById(companyId: number) {
    try {
      const responseCompany = await this.findById(companyId);
      if (responseCompany.error) return responseCompany;

      await prisma.company.update({
        where: { id: companyId },
        data: { status_enabled: false },
      });
      return this.responseService.SuccessResponse(
        "Empresa eliminada correctamente"
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException();
    }
  }
}
