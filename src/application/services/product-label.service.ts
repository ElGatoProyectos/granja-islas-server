import slugify from "slugify";
import prisma from "../../infrastructure/database/prisma";
import { I_CreateLabel } from "../models/interfaces/label-product.interface";
import ResponseService from "./response.service";

class ProductLabelService {
  private responseService: ResponseService;

  constructor() {
    this.responseService = new ResponseService();
  }

  findAll = async () => {
    try {
      const labels = await prisma.productLabel.findMany({
        where: { status_deleted: false },
      });
      return this.responseService.SuccessResponse("Lista de etiquetas", labels);
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  findAllWithDeleted = async () => {
    try {
      const labels = await prisma.productLabel.findMany();
      return this.responseService.SuccessResponse("Lista de etiquetas", labels);
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  findById = async (productLabelId: number) => {
    try {
      const label = await prisma.productLabel.findMany({
        where: { id: productLabelId },
      });
      if (!label)
        return this.responseService.NotFoundException("Etiqueta no encontrada");
      return this.responseService.SuccessResponse("Lista de etiquetas", label);
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  // corregir
  createLabel = async (data: any) => {
    try {
      const slug = slugify(data.title, { lower: true });
      data = { ...data, slug };
      const created = await prisma.productLabel.create({ data });
      return this.responseService.CreatedResponse("Etiqueta creada", created);
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  updateLabel = async (data: I_CreateLabel, productLabelId: number) => {
    try {
      const responseLabel = await this.findById(productLabelId);
      if (responseLabel.error) return responseLabel;

      const slug = slugify(data.title, { lower: true });
      data = { ...data, slug };

      const updated = await prisma.productLabel.update({
        where: { id: productLabelId },
        data,
      });
      return this.responseService.SuccessResponse(
        "Etiqueta modificada",
        updated
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  deleteById = async (productLabelId: number) => {
    try {
      const responseLabel = await this.findById(productLabelId);
      if (responseLabel.error) return responseLabel;
      const updated = await prisma.productLabel.update({
        where: { id: productLabelId },
        data: { status_deleted: true },
      });
      return this.responseService.SuccessResponse(
        "Etiqueta modificada",
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

export default ProductLabelService;
