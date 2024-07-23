import slugify from "slugify";
import prisma from "../../infrastructure/database/prisma";
import {
  I_CreateProduct,
  I_UpdateProduct,
} from "../models/interfaces/product.interface";
import ProductLabelService from "./product-label.service";
import ResponseService from "./response.service";

class ProductService {
  private responseService: ResponseService;
  private productLabelService: ProductLabelService;
  private supplierService: ProductLabelService;

  constructor() {
    this.responseService = new ResponseService();
    this.productLabelService = new ProductLabelService();
    this.supplierService = new ProductLabelService();
  }

  findAll = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    try {
      const [products, total] = await prisma.$transaction([
        prisma.product.findMany({
          where: { status_deleted: false },
          skip,
          take: limit,
        }),
        prisma.product.count({
          where: { status_deleted: false },
        }),
      ]);

      const pageCount = Math.ceil(total / limit);

      const formatData = {
        total,
        page,
        perPage: limit,
        pageCount,
        data: products,
      };
      return this.responseService.SuccessResponse(
        "Lista de productos",
        formatData
      );
    } catch (error) {
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  };

  findById = async (productId: number) => {
    try {
      const product = await prisma.product.findMany({
        where: { id: productId },
      });
      return this.responseService.SuccessResponse(
        "Producto encontrado",
        product
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

  findBySlug = async (slug: string) => {
    try {
      const product = await prisma.product.findFirst({ where: { slug } });
      if (!product)
        return this.responseService.NotFoundException("Producto no encontrado");
      return this.responseService.SuccessResponse(
        "Producto encontrado",
        product
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

  create = async (data: I_CreateProduct) => {
    try {
      // consideremos al titulo como el campo unico que no se debe repetir
      const slug = slugify(data.title, { lower: true });

      // const responseProduct = await this.findBySlug(slug);

      // if (!responseProduct.error)
      //   return this.responseService.BadRequestException(
      //     "Ya existe un producto con ese nombre"
      //   );
      // no tiene sentido validarlo por el slug, porque puede haber el mismo producto por proveedor diferente

      const created = await prisma.product.create({ data: { ...data, slug } });

      return this.responseService.CreatedResponse(
        "Producto creado satisfactoriamente",
        created
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

  updateById = async (data: I_UpdateProduct, productId: number) => {
    try {
      // consideremos al titulo como el campo unico que no se debe repetir
      const slug = slugify(data.title, { lower: true });

      const responseProduct = await this.findById(productId);

      if (responseProduct.error)
        return this.responseService.NotFoundException("El producto no existe");

      const created = await prisma.product.update({
        where: { id: productId },
        data: { ...data, slug },
      });

      return this.responseService.CreatedResponse(
        "Producto modificado satisfactoriamente",
        created
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

  // actions to products

  // assignLabelToProduct = async (productLabelId: number, productId: number) => {
  //   try {
  //     const responseProductLabel = await this.productLabelService.findById(
  //       productLabelId
  //     );
  //     const responseProduct = await this.findById(productId);

  //     if (responseProduct.error || responseProductLabel)
  //       return this.responseService.BadRequestException(
  //         "Ocurrió un error al asignar la etiqueta"
  //       );

  //     const updatedProduct = await prisma.product.update({
  //       where: { id: productId },
  //       data: {
  //         product_label_id: productLabelId,
  //       },
  //     });
  //     return this.responseService.SuccessResponse(
  //       "Etiqueta asignada correctamente",
  //       updatedProduct
  //     );
  //   } catch (error) {
  //     return this.responseService.InternalServerErrorException(
  //       undefined,
  //       error
  //     );
  //   } finally {
  //     await prisma.$disconnect();
  //   }
  // };

  // removeLabelFromProduct = async (
  //   productLabelId: number,
  //   productId: number
  // ) => {
  //   try {
  //     const responseProductLabel = await this.productLabelService.findById(
  //       productLabelId
  //     );
  //     const responseProduct = await this.findById(productId);

  //     if (responseProduct.error || responseProductLabel)
  //       return this.responseService.BadRequestException(
  //         "Ocurrió un error al asignar la etiqueta"
  //       );

  //     const updatedProduct = await prisma.product.update({
  //       where: { id: productId },
  //       data: {
  //         product_label_id: null,
  //       },
  //     });

  //     return this.responseService.SuccessResponse(
  //       "Etiqueta asignada correctamente",
  //       updatedProduct
  //     );
  //   } catch (error) {
  //     return this.responseService.InternalServerErrorException(
  //       undefined,
  //       error
  //     );
  //   } finally {
  //     await prisma.$disconnect();
  //   }
  // };

  // actions to suppliers

  assignSupplierToProduct = async (supplierId: number, productId: number) => {
    try {
      const responseSupplier = await this.supplierService.findById(supplierId);
      const responseProduct = await this.findById(productId);

      if (responseSupplier.error || responseProduct.error)
        return this.responseService.BadRequestException(
          "Error al asignar proveedor"
        );

      const updated = await prisma.product.update({
        where: { id: productId },
        data: { supplier_id: supplierId },
      });

      return this.responseService.SuccessResponse(
        "Proveedor asignado correctamente",
        updated
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

  removeSupplierToProduct = async (supplierId: number, productId: number) => {
    try {
      const responseSupplier = await this.supplierService.findById(supplierId);
      const responseProduct = await this.findById(productId);

      if (responseSupplier.error || responseProduct.error)
        return this.responseService.BadRequestException(
          "Error al asignar proveedor"
        );

      const updated = await prisma.product.update({
        where: { id: productId },
        data: { supplier_id: null },
      });

      return this.responseService.SuccessResponse(
        "Proveedor asignado correctamente",
        updated
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

export default ProductService;
