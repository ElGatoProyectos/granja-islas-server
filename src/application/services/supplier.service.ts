import prisma from "../../infrastructure/database/prisma";
import {
  I_CreateSupplier,
  I_UpdateSupplier,
} from "../models/interfaces/supplier.interface";
import ResponseService from "./response.service";

class SupplierService {
  private responseService: ResponseService;

  constructor() {
    this.responseService = new ResponseService();
  }

  findAll = async () => {
    try {
      const suppliers = await prisma.supplier.findMany();
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

  findById = async (supplierId: number) => {
    try {
      const supplier = await prisma.supplier.findFirst({
        where: { id: supplierId },
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

  findForRuc = async (ruc: string) => {
    try {
      const supplier = await prisma.supplier.findFirst({ where: { ruc } });
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

  create = async (data: I_CreateSupplier) => {
    try {
      const created = await prisma.supplier.create({
        data,
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

  updateById = async (data: I_UpdateSupplier) => {
    try {
      const created = await prisma.supplier.create({
        data,
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
}

export default SupplierService;
