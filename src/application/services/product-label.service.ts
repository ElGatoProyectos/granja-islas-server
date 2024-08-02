import slugify from "slugify";
import prisma from "../../infrastructure/database/prisma";
import {
  I_CreateLabel,
  I_UpdateLabel,
} from "../models/interfaces/label-product.interface";
import ResponseService from "./response.service";
import ProductService from "./product.service";
import InfoService from "./info.service";
import { Company, Product, ProductLabel, User } from "@prisma/client";

class ProductLabelService {
  private responseService: ResponseService;
  private infoService: InfoService;

  constructor() {
    this.responseService = new ResponseService();
    this.infoService = new InfoService();
  }

  // [success]
  findAll = async (rucFromHeader: string, tokenFromHeader: string) => {
    try {
      //[message] capture data
      const responseInfo = await this.infoService.getCompanyAndUser(
        tokenFromHeader,
        rucFromHeader
      );
      if (responseInfo.error) return responseInfo;
      const { company, user }: { company: Company; user: User } =
        responseInfo.payload;

      const labels = await prisma.productLabel.findMany({
        where: { status_deleted: false, company_id: company.id },
      });
      return this.responseService.SuccessResponse("Lista de etiquetas", labels);
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  // [pending]
  findAllWithDeleted = async (
    rucFromHeader: string,
    tokenFromHeader: string
  ) => {
    try {
      //[message] capture data
      const responseInfo = await this.infoService.getCompanyAndUser(
        tokenFromHeader,
        rucFromHeader
      );
      if (responseInfo.error) return responseInfo;
      const { company, user }: { company: Company; user: User } =
        responseInfo.payload;
      //[message] end capture data
      const labels = await prisma.productLabel.findMany({
        where: { status_deleted: false, company_id: company.id },
      });
      return this.responseService.SuccessResponse("Lista de etiquetas", labels);
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  // [success]
  findById = async (
    product_label_id: number,
    rucFromHeader: string,
    tokenFromHeader: string
  ) => {
    try {
      //[message] capture data
      const responseInfo = await this.infoService.getCompanyAndUser(
        tokenFromHeader,
        rucFromHeader
      );
      if (responseInfo.error) return responseInfo;
      const { company, user }: { company: Company; user: User } =
        responseInfo.payload;
      //[message] end capture data

      const label = await prisma.productLabel.findFirst({
        where: {
          id: product_label_id,
          company_id: company.id,
          status_deleted: false,
        },
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

  // [success]
  findProductsByLabel = async (
    product_label_id: number,
    rucFromHeader: string,
    tokenFromHeader: string
  ) => {
    try {
      //[message] capture data
      const responseInfo = await this.infoService.getCompanyAndUser(
        tokenFromHeader,
        rucFromHeader
      );
      if (responseInfo.error) return responseInfo;
      const { company, user }: { company: Company; user: User } =
        responseInfo.payload;
      //[message] end capture data

      const label = await prisma.productLabel.findFirst({
        where: {
          id: product_label_id,
          company_id: company.id,
          status_deleted: false,
        },
      });
      if (!label)
        return this.responseService.NotFoundException("Etiqueta no encontrada");

      const items = await prisma.detailProductLabel.findMany({
        where: { product_label_id },
        include: { Product: true },
      });

      items;

      return this.responseService.SuccessResponse(
        "Lista de productos por etiqueta",
        items
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  // [success]
  createLabel = async (
    data: I_CreateLabel,
    rucFromHeader: string,
    tokenFromHeader: string
  ) => {
    try {
      //[message] capture data
      const responseInfo = await this.infoService.getCompanyAndUser(
        tokenFromHeader,
        rucFromHeader
      );

      responseInfo;
      if (responseInfo.error) return responseInfo;
      const { company, user }: { company: Company; user: User } =
        responseInfo.payload;
      //[message] end capture data

      const slug = slugify(data.title, { lower: true });

      const formatData = {
        ...data,
        slug,
        company_id: company.id,
        user_created_id: user.id,
      };

      const created = await prisma.productLabel.create({ data: formatData });
      return this.responseService.CreatedResponse("Etiqueta creada", created);
    } catch (error) {
      error;
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  // [success]
  updateLabel = async (
    data: I_UpdateLabel,
    product_label_id: number,
    rucFromHeader: string,
    tokenFromHeader: string
  ) => {
    try {
      //[message] capture data
      const responseInfo = await this.infoService.getCompanyAndUser(
        tokenFromHeader,
        rucFromHeader
      );
      if (responseInfo.error) return responseInfo;
      const { company, user }: { company: Company; user: User } =
        responseInfo.payload;

      const responseLabel = await this.findById(
        product_label_id,
        rucFromHeader,
        tokenFromHeader
      );
      if (responseLabel.error) return responseLabel;

      // [message] validar si el label pertenece a la empresa
      const label: ProductLabel = responseLabel.payload;

      if (label.company_id !== company.id)
        return this.responseService.BadRequestException(
          "La etiqueta no pertenece a la empresa"
        );
      // [message] validar si el label pertenece a la empresa

      const slug = slugify(data.title, { lower: true });
      data = { ...data, slug };

      const updated = await prisma.productLabel.update({
        where: { id: product_label_id, company_id: company.id },
        data,
      });
      return this.responseService.SuccessResponse(
        "Etiqueta modificada",
        updated
      );
    } catch (error) {
      error;
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  deleteById = async (
    product_label_id: number,
    rucFromHeader: string,
    tokenFromHeader: string
  ) => {
    try {
      //[message] capture data
      const responseInfo = await this.infoService.getCompanyAndUser(
        tokenFromHeader,
        rucFromHeader
      );
      if (responseInfo.error) return responseInfo;
      const { company, user }: { company: Company; user: User } =
        responseInfo.payload;
      //[message] end capture data

      const responseLabel = await this.findById(
        product_label_id,
        rucFromHeader,
        tokenFromHeader
      );
      if (responseLabel.error) return responseLabel;

      // [message] validar si el label pertenece a la empresa
      const label: ProductLabel = responseLabel.payload;

      if (label.company_id !== company.id)
        return this.responseService.BadRequestException(
          "La etiqueta no pertenece a la empresa"
        );

      // [message] verificar si hay productos relacionados a esta etiqueta
      const labelsInProduct = await prisma.detailProductLabel.findMany({
        where: { product_label_id },
      });

      if (labelsInProduct.length > 0)
        return this.responseService.BadRequestException(
          "Hay productos con esta etiqueta, no se puede borrar"
        );

      const updated = await prisma.productLabel.update({
        where: { id: product_label_id, company_id: company.id },
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

  assignLabelToProduct = async (
    product_id: number,
    product_label_id: number,
    rucFromHeader: string,
    tokenFromHeader: string
  ) => {
    try {
      //[message] capture data
      const responseInfo = await this.infoService.getCompanyAndUser(
        tokenFromHeader,
        rucFromHeader
      );
      if (responseInfo.error) return responseInfo;
      const { company, user }: { company: Company; user: User } =
        responseInfo.payload;
      //[message] end capture data

      // [note] validamos el id del producto si pertence al ruc donde estamos

      const product = await prisma.product.findFirst({
        where: { id: product_id, status_deleted: false },
        include: { Supplier: true },
      });
      if (!product)
        return this.responseService.NotFoundException("El producto no existe");

      if (product.Supplier?.company_id !== company.id)
        return this.responseService.BadRequestException(
          "El producto no pertenece a la empresa seleccionada"
        );

      const detail = await prisma.detailProductLabel.findFirst({
        where: { product_id, product_label_id },
      });
      if (detail)
        return this.responseService.BadRequestException(
          "La etiqueta seleccionada ya fue asignada al producto"
        );
      const created = await prisma.detailProductLabel.create({
        data: { product_id, product_label_id },
      });
      return this.responseService.SuccessResponse(
        "Etiqueta asignada correctamente",
        created
      );
    } catch (error) {
      error;
      return this.responseService.InternalServerErrorException(
        "Error al intentar asignar etiqueta",
        error
      );
    }
  };

  removeLabelFromProduct = async (
    product_id: number,
    product_label_id: number,
    rucFromHeader: string,
    tokenFromHeader: string
  ) => {
    try {
      const responseInfo = await this.infoService.getCompanyAndUser(
        tokenFromHeader,
        rucFromHeader
      );
      if (responseInfo.error) return responseInfo;
      const { company, user }: { company: Company; user: User } =
        responseInfo.payload;
      const product = await prisma.product.findFirst({
        where: { id: product_id, status_deleted: false },
        include: { Supplier: true },
      });
      if (!product)
        return this.responseService.NotFoundException("El producto no existe");

      if (product.Supplier?.company_id !== company.id)
        return this.responseService.BadRequestException(
          "El producto no pertenece a la empresa seleccionada"
        );

      const detail = await prisma.detailProductLabel.findFirst({
        where: { product_id, product_label_id },
      });
      if (!detail)
        return this.responseService.BadRequestException(
          "No existe la etiqueta para el producto seleccionado"
        );

      await prisma.detailProductLabel.deleteMany({
        where: { product_id, product_label_id },
      });
      return this.responseService.SuccessResponse(
        "Asignación eliminada con éxito"
      );
    } catch (error) {
      error;
      return this.responseService.InternalServerErrorException(
        "Error al intentar remover etiqueta",
        error
      );
    }
  };
}

export default ProductLabelService;
