import slugify from "slugify";
import prisma from "../../infrastructure/database/prisma";
import { I_CreateLabel } from "../models/interfaces/label-product.interface";
import ResponseService from "./response.service";
import ProductService from "./product.service";

class ProductLabelService {
  private responseService: ResponseService;
  private productService: ProductService;

  constructor() {
    this.responseService = new ResponseService();
    this.productService = new ProductService();
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

  findById = async (product_label_id: number) => {
    try {
      const label = await prisma.productLabel.findMany({
        where: { id: product_label_id },
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

  updateLabel = async (data: I_CreateLabel, product_label_id: number) => {
    try {
      const responseLabel = await this.findById(product_label_id);
      if (responseLabel.error) return responseLabel;

      const slug = slugify(data.title, { lower: true });
      data = { ...data, slug };

      const updated = await prisma.productLabel.update({
        where: { id: product_label_id },
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

  deleteById = async (product_label_id: number) => {
    try {
      const responseLabel = await this.findById(product_label_id);
      if (responseLabel.error) return responseLabel;
      const updated = await prisma.productLabel.update({
        where: { id: product_label_id },
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

  // actions
  assignLabelToProduct = async (
    product_id: number,
    product_label_id: number
  ) => {
    try {
      const created = await prisma.detailProductLabel.create({
        data: { product_id, product_label_id },
      });
      return this.responseService.SuccessResponse(
        "Etiqueta asignada correctamente",
        created
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        "Error al intentar asignar etiqueta",
        error
      );
    }
  };

  removeLabelFromProduct = async (
    product_id: number,
    product_label_id: number
  ) => {
    try {
      await prisma.detailProductLabel.deleteMany({
        where: { product_id, product_label_id },
      });
      return this.responseService.SuccessResponse(
        "Asignación eliminada con éxito"
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        "Error al intentar remover etiqueta",
        error
      );
    }
  };
}

export default ProductLabelService;
