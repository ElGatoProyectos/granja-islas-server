import { Company, User } from "@prisma/client";
import prisma from "../../infrastructure/database/prisma";
import InfoService from "./info.service";
import ResponseService from "./response.service";
import { I_CreateBank } from "../models/interfaces/bank.interface";
import slugify from "slugify";

class BankService {
  private responseService: ResponseService;
  private infoService: InfoService;
  constructor() {
    this.responseService = new ResponseService();
    this.infoService = new InfoService();
  }

  findAll = async (rucFromHeader: string, token: string) => {
    try {
      const responseInfo = await this.infoService.getCompanyAndUser(
        token,
        rucFromHeader
      );
      if (responseInfo.error) return responseInfo;
      const { user, company }: { user: User; company: Company } =
        responseInfo.payload;

      const banks = await prisma.bank.findMany({
        where: { company_id: company.id, status_deleted: false },
      });

      return this.responseService.SuccessResponse("Lista de bancos", banks);
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  findAllWithDeleted = async (rucFromHeader: string, token: string) => {
    try {
      const responseInfo = await this.infoService.getCompanyAndUser(
        token,
        rucFromHeader
      );
      if (responseInfo.error) return responseInfo;
      const { user, company }: { user: User; company: Company } =
        responseInfo.payload;

      const bank = await prisma.bank.findMany({
        where: { company_id: company.id },
      });

      if (!bank)
        return this.responseService.NotFoundException("Banco no encontrado");

      return this.responseService.SuccessResponse("Banco encontrado", bank);
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  findById = async (id: number, rucFromHeader: string, token: string) => {
    try {
      const responseInfo = await this.infoService.getCompanyAndUser(
        token,
        rucFromHeader
      );
      if (responseInfo.error) return responseInfo;
      const { user, company }: { user: User; company: Company } =
        responseInfo.payload;

      const bank = await prisma.bank.findMany({
        where: { id, company_id: company.id, status_deleted: false },
      });

      if (!bank)
        return this.responseService.NotFoundException("Banco no encontrado");

      return this.responseService.SuccessResponse("Banco encontrado", bank);
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  create = async (data: I_CreateBank, rucFromHeader: string, token: string) => {
    try {
      const responseInfo = await this.infoService.getCompanyAndUser(
        token,
        rucFromHeader
      );
      if (responseInfo.error) return responseInfo;
      const { user, company }: { user: User; company: Company } =
        responseInfo.payload;

      const slug = slugify(data.title, { lower: true });

      const formartData = {
        ...data,
        slug,
        company_id: company.id,
        user_created_id: user.id,
      };

      const created = await prisma.bank.create({ data: formartData });

      return this.responseService.SuccessResponse(
        "Banco creado exitosamente",
        created
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  editById = async (
    data: I_CreateBank,
    id: number,
    rucFromHeader: string,
    token: string
  ) => {
    try {
      const responseInfo = await this.infoService.getCompanyAndUser(
        token,
        rucFromHeader
      );
      if (responseInfo.error) return responseInfo;
      const { user, company }: { user: User; company: Company } =
        responseInfo.payload;

      const bank = await prisma.bank.findFirst({
        where: { id, status_deleted: false, company_id: company.id },
      });
      if (!bank)
        return this.responseService.BadRequestException("La empresa no existe");

      if (bank.company_id !== company.id)
        return this.responseService.BadRequestException(
          "El banco no pertenece a la empresa seleccionada"
        );

      const slug = slugify(data.title, { lower: true });

      const formartData = {
        ...data,
        slug,
        company_id: company.id,
        user_created_id: user.id,
      };

      const updated = await prisma.bank.update({
        where: { id },
        data: formartData,
      });

      return this.responseService.SuccessResponse(
        "Banco modificado exitosamente",
        updated
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  deleteById = async (id: number, rucFromHeader: string, token: string) => {
    try {
      const responseInfo = await this.infoService.getCompanyAndUser(
        token,
        rucFromHeader
      );
      if (responseInfo.error) return responseInfo;
      const { user, company }: { user: User; company: Company } =
        responseInfo.payload;

      if (id !== company.id)
        return this.responseService.BadRequestException(
          "El banco no pertenece a la empresa seleccionada"
        );

      const bank = await prisma.bank.findFirst({
        where: { id, status_deleted: false, company_id: company.id },
      });
      if (!bank)
        return this.responseService.BadRequestException("La empresa no existe");

      await prisma.bank.update({
        where: { id },
        data: { status_deleted: true },
      });

      return this.responseService.SuccessResponse(
        "Banco eliminado exitosamente"
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };
}

export default BankService;
