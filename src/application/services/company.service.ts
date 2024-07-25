import prisma from "../../infrastructure/database/prisma";
import { companyMulterProperties } from "../models/constants/multer.constant";
import {
  I_CreateCompany,
  I_UpdateCompany,
} from "../models/interfaces/company.interface";
import ResponseService from "./response.service";
import appRootPath from "app-root-path";
import fs from "fs/promises";

export default class CompanyService {
  private responseService: ResponseService;

  constructor() {
    this.responseService = new ResponseService();
  }

  findAll = async () => {
    try {
      const companies = await prisma.company.findMany({
        where: { status_deleted: false },
      });
      return this.responseService.SuccessResponse(
        "Listado de empresas",
        companies
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  };

  findImage = async (filter: number | string) => {
    try {
      let company = undefined;

      const responseCompany1 = await this.findById(filter as number);
      if (!responseCompany1.error) company = responseCompany1.payload;

      const responseCompany2 = await this.findByRuc(filter as string);
      if (!responseCompany2.error) company = responseCompany2.payload;

      if (!company)
        return this.responseService.NotFoundException("Empresa no encontrada");

      const imagePath =
        appRootPath +
        "/public/" +
        companyMulterProperties.folder +
        "/" +
        companyMulterProperties.folder +
        "_" +
        company.id +
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
  };

  findAllWithDeleted = async () => {
    try {
      const companies = await prisma.company.findMany();
      return this.responseService.SuccessResponse(
        "Listado de empresas en general",
        companies
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  };

  findById = async (companyId: number) => {
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
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  };

  findByRuc = async (ruc: string) => {
    try {
      const company = await prisma.company.findFirst({
        where: { ruc },
      });
      if (!company)
        return this.responseService.NotFoundException("Empresa no encontrada");
      return this.responseService.SuccessResponse(
        "Empresa encontrada con éxito",
        company
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  };

  create = async (data: I_CreateCompany) => {
    try {
      const created = await prisma.company.create({ data });
      return this.responseService.CreatedResponse(
        "Empresa creada con éxito!",
        created
      );
    } catch (error) {
      console.log(error);
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  };

  updateById = async (companyId: number, data: I_UpdateCompany) => {
    try {
      // todo  Verificar, hay doble validacion redundante en si existe la empresa
      const responseCompany = await this.findById(companyId);
      if (responseCompany.error) return responseCompany;

      await prisma.company.update({ where: { id: companyId }, data });

      return this.responseService.SuccessResponse(
        "Empresa modificada correctamente"
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  };

  deleteById = async (companyId: number) => {
    try {
      const responseCompany = await this.findById(companyId);
      if (responseCompany.error) return responseCompany;

      await prisma.company.update({
        where: { id: companyId },
        data: { status_deleted: true },
      });

      return this.responseService.SuccessResponse(
        "Empresa eliminada correctamente"
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  };
}
