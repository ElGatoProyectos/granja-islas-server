import { Company, User } from "@prisma/client";
import prisma from "../../infrastructure/database/prisma";
import {
  I_CreateSupplier,
  I_UpdateSupplier,
} from "../models/interfaces/supplier.interface";
import ResponseService from "./response.service";
import AuthService from "./auth.service";

class SupplierService {
  private responseService: ResponseService;
  private authService: AuthService;

  constructor() {
    this.responseService = new ResponseService();
    this.authService = new AuthService();
  }

  // - query methods --------------------------------------------------------
  getCompanyInitial = async (ruc: string) => {
    try {
      const company = await prisma.company.findFirst({ where: { ruc } });
      if (!company)
        return this.responseService.NotFoundException("La empresa no existe");
      return this.responseService.SuccessResponse(undefined, company);
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  validationInitial = async (token: string, ruc: string) => {
    try {
      const responseGetUser = await this.authService.getUserForToken(token);
      if (!responseGetUser.error) return responseGetUser;
      const responseCompany = await this.getCompanyInitial(ruc);
      if (responseCompany.error) return responseCompany;

      return this.responseService.SuccessResponse(undefined, {
        user: responseGetUser.payload,
        company: responseCompany.payload,
      });
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  findAll = async (ruc: string) => {
    try {
      const responseCompany = await this.getCompanyInitial(ruc);
      if (responseCompany.error) return responseCompany;

      const company: Company = responseCompany.payload;

      const suppliers = await prisma.supplier.findMany({
        where: { company_id: company.id },
      });

      return this.responseService.SuccessResponse(
        "Lista de Proveedores",
        suppliers
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  findById = async (supplier_id: number, ruc: string) => {
    try {
      const responseCompany = await this.getCompanyInitial(ruc);
      if (responseCompany.error) return responseCompany;

      const company: Company = responseCompany.payload;

      const supplier = await prisma.supplier.findFirst({
        where: { id: supplier_id, company_id: company.id },
      });
      return this.responseService.SuccessResponse(
        "Proveedor encontrado",
        supplier
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  findForRuc = async (company_ruc: string, ruc: string) => {
    try {
      const responseCompany = await this.getCompanyInitial(ruc);
      if (responseCompany.error) return responseCompany;

      const company: Company = responseCompany.payload;

      const supplier = await prisma.supplier.findFirst({
        where: { ruc: company_ruc, company_id: company.id },
      });
      if (!supplier)
        return this.responseService.NotFoundException(
          "Proveedor no encontrado"
        );

      return this.responseService.SuccessResponse(
        "Proveedor encontrado",
        supplier
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  // - mutations methods --------------------------------------------------------
  create = async (data: I_CreateSupplier, token: string, ruc: string) => {
    try {
      const responseValidation = await this.validationInitial(token, ruc);

      if (responseValidation.error) return responseValidation;

      type T_RValidation = {
        user: User;
        company: Company;
      };

      const { user, company }: T_RValidation = responseValidation.payload;

      const created = await prisma.supplier.create({
        data: { ...data, company_id: company.id, user_id_created: user.id },
      });
      return this.responseService.CreatedResponse(
        "Proveedor registrado correctamente",
        created
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  updateById = async (data: I_UpdateSupplier, supplier_id: number) => {
    try {
      const created = await prisma.supplier.update({
        where: { id: supplier_id },
        data,
      });
      return this.responseService.CreatedResponse(
        "Proveedor modificado correctamente",
        created
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };
}

export default SupplierService;
