import { Company, User } from "@prisma/client";
import prisma from "../../infrastructure/database/prisma";
import {
  I_CreateSupplier,
  I_UpdateSupplier,
} from "../models/interfaces/supplier.interface";
import ResponseService from "./response.service";
import AuthService from "./auth.service";
import CompanyService from "./company.service";
import validator from "validator";
import InfoService from "./info.service";

class SupplierService {
  private responseService: ResponseService;
  private companyService: CompanyService;
  private authService: AuthService;
  private infoService: InfoService = new InfoService();

  constructor() {
    this.responseService = new ResponseService();
    this.authService = new AuthService();
    this.companyService = new CompanyService();
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
      if (responseGetUser.error) return responseGetUser;

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

  findAllNoPagination = async (ruc: string) => {
    try {
      const responseCompany = await this.getCompanyInitial(ruc);
      if (responseCompany.error) return responseCompany;

      const company: Company = responseCompany.payload;

      const suppliers = await prisma.supplier.findMany({
        where: { status_deleted: false, company_id: company.id },
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

  findAll = async (
    ruc: string,
    page: number,
    limit: number,
    nameFilter?: string
  ) => {
    const skip = (page - 1) * limit;
    try {
      const responseCompany = await this.getCompanyInitial(ruc);
      if (responseCompany.error) return responseCompany;

      const company: Company = responseCompany.payload;

      //[message] inicializamos los filtros

      const filters: any = {
        status_deleted: false,
        company_id: company.id,
      };

      //[message] seteamos los filtros que necesitamos

      if (nameFilter) {
        if (validator.isNumeric(nameFilter)) {
          filters.ruc = {
            contains: nameFilter,
            mode: "insensitive",
          };
        } else {
          filters.business_name = {
            contains: nameFilter,
            mode: "insensitive",
          };
        }
      }

      const [suppliers, total] = await prisma.$transaction([
        prisma.supplier.findMany({
          where: filters,
          orderBy: { id: "desc" },
          skip,
          take: limit,
        }),
        prisma.supplier.count({
          where: filters,
        }),
      ]);

      const pageCount = Math.ceil(total / limit);

      const formatData = {
        total,
        page,
        limit,
        pageCount,
        data: suppliers,
      };

      return this.responseService.SuccessResponse(
        "Lista de Proveedores",
        formatData
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
      const responseValidation = await this.infoService.getCompanyAndUser(
        token,
        ruc
      );

      if (responseValidation.error) return responseValidation;

      const {
        user,
        company,
      }: {
        user: User;
        company: Company;
      } = responseValidation.payload;

      const supplier = await prisma.supplier.findFirst({
        where: { company_id: company.id, ruc: data.ruc },
      });

      if (supplier)
        return this.responseService.BadRequestException(
          "El proveedor ya se encuentra registrado"
        );

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

  updateById = async (
    data: I_UpdateSupplier,
    supplier_id: number,
    ruc: string
  ) => {
    try {
      // empresa de donde estoy enviando la solicitud
      //* ok
      const responseCompany = await this.companyService.findByRuc(ruc);

      // proveedor a quien quiero hacer la modificación
      // ! error
      const responseSupplier = await this.findById(supplier_id, ruc);

      if (responseCompany.error || responseSupplier.error)
        return this.responseService.BadRequestException(
          "Error al validar las empresa seleccionada"
        );

      if (responseCompany.payload.id !== responseSupplier.payload.company_id)
        return this.responseService.BadRequestException(
          "El proveedor a modificar no pertenece a la empresa seleccionada"
        );

      const updated = await prisma.supplier.update({
        where: { id: supplier_id },
        data,
      });
      return this.responseService.CreatedResponse(
        "Proveedor modificado correctamente",
        updated
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
