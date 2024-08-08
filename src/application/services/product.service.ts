import slugify from "slugify";
import prisma from "../../infrastructure/database/prisma";
import {
  I_CreateProduct,
  I_UpdateProduct,
} from "../models/interfaces/product.interface";
import ProductLabelService from "./product-label.service";
import ResponseService from "./response.service";
import InfoService from "./info.service";
import { Company, Product, User } from "@prisma/client";

type T_FindByReport = {
  pagination: {
    limit: number;
    page: number;
  };
  header: {
    ruc: string;
    token: string;
  };
  params: {
    filter: string | undefined;
    month: number;
    year: number;
    label_group_id: string | undefined;
    supplier_group_id: string | undefined;
  };
};

class ProductService {
  private responseService: ResponseService;
  private productLabelService: ProductLabelService;
  private supplierService: ProductLabelService;
  private infoService: InfoService;

  constructor() {
    this.responseService = new ResponseService();
    this.productLabelService = new ProductLabelService();
    this.supplierService = new ProductLabelService();
    this.infoService = new InfoService();
  }

  //- QUERY METHODS
  // [error] corregir esto

  // findAll = async (page: number, limit: number) => {
  //   const skip = (page - 1) * limit;
  //   try {
  //     const [products, total] = await prisma.$transaction([
  //       prisma.product.findMany({
  //         where: { status_deleted: false },
  //         skip,
  //         take: limit,
  //         include: {
  //           DetailProductLabel: {
  //             include: {
  //               Label: true,
  //             },
  //           },
  //         },
  //       }),
  //       prisma.product.count({
  //         where: { status_deleted: false },
  //       }),
  //     ]);

  //     const pageCount = Math.ceil(total / limit);

  //     const formatData = {
  //       total,
  //       page,
  //       perPage: limit,
  //       pageCount,
  //       data: products,
  //     };
  //     return this.responseService.SuccessResponse(
  //       "Lista de productos",
  //       formatData
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

  findByReport = async (data: T_FindByReport) => {
    try {
      const skip = (data.pagination.page - 1) * data.pagination.limit;

      const responseInfo = await this.infoService.getCompanyAndUser(
        data.header.token,
        data.header.ruc
      );
      if (responseInfo.error) return responseInfo;

      const { user, company }: { user: User; company: Company } =
        responseInfo.payload;

      // [message] filtros de producto

      let fiteredProduct: any = {};

      if (data.params.filter) {
        fiteredProduct.title = {
          contains: data.params.filter,
        };
      }

      if (data.params.label_group_id) {
        const detailLabelProducts = await prisma.detailProductLabel.findMany({
          where: {
            product_label_id: {
              in: data.params.label_group_id.split(",").map(Number),
            },
          },
        });

        const setProductIds = new Set(
          detailLabelProducts.map((d) => d.product_id)
        );

        fiteredProduct.id = {
          in: Array.from(setProductIds),
        };
      }

      if (data.params.supplier_group_id) {
        fiteredProduct.supplier_id = {
          in: data.params.supplier_group_id.split(",").map(Number),
        };
      }

      // [message] filtros de factura
      let filteredBill: any = {};

      if (data.params.year && data.params.month) {
        filteredBill.period = `${data.params.year}-${data.params.month
          .toString()
          .padStart(2, "0")}`;
      }

      const bills = await prisma.bill.findMany({
        where: { company_id: company.id, ...filteredBill },
      });

      const billIdsSet = new Set(bills.map((bill) => bill.id));

      const products = await prisma.product.findMany({
        where: {
          status_deleted: false,

          Supplier: { company_id: company.id },

          ...fiteredProduct,

          document_id: {
            in: Array.from(billIdsSet),
          },
        },
        include: { Supplier: true },
      });

      const response = products.map((product) => {
        const bill = bills.find((b) => b.id === product?.document_id);

        if (bill) {
          return {
            product,
            document: bill,
          };
        }
      });

      const responseNoNull = response.filter((item) => item !== null);

      const total = responseNoNull.length;
      const pageCount = Math.ceil(total / data.pagination.limit);

      // Aplicar paginación
      const paginatedData = responseNoNull.slice(
        skip,
        skip + data.pagination.limit
      );

      // Formatear la respuesta
      const formatData = {
        total,
        page: data.pagination.page,
        limit: data.pagination.limit,
        pageCount,
        data: paginatedData,
      };

      return this.responseService.SuccessResponse(
        "Lista de productos",
        formatData
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

  //[success]
  findAll = async (
    rucFromHeader: string,
    tokenFromHeader: string,
    page: number,
    limit: number
  ) => {
    const skip = (page - 1) * limit;
    try {
      const responseInfo = await this.infoService.getCompanyAndUser(
        tokenFromHeader,
        rucFromHeader
      );

      if (responseInfo.error) return responseInfo;
      const { company, user }: { company: Company; user: User } =
        responseInfo.payload;

      const [products, total] = await prisma.$transaction([
        prisma.product.findMany({
          where: { Supplier: { company_id: company.id } },
          skip,
          take: limit,
          include: { DetailProductLabel: { include: { Label: true } } },
        }),
        prisma.product.count({
          where: { Supplier: { company_id: company.id } },
        }),
      ]);

      const pageCount = Math.ceil(total / limit);

      const formatData = {
        total,
        page,
        limit,
        pageCount,
        data: products,
      };

      return this.responseService.SuccessResponse(
        "Lista de productos",
        formatData
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

  //[success]
  findById = async (
    productId: number,
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

      const product = await prisma.product.findMany({
        where: { id: productId, Supplier: { company_id: company.id } },
        include: { DetailProductLabel: { include: { Label: true } } },
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

  //[success]
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

  // findProductsByLabel = async (label_id: number) => {
  //   try {
  //     const responseLabel = await this.productLabelService.findById(label_id);
  //     if (responseLabel.error) return responseLabel;
  //     const products = await prisma.detailProductLabel.findMany({
  //       where: { product_label_id: label_id },
  //       include: { Product: true },
  //     });
  //     return this.responseService.SuccessResponse(
  //       "Listado de productos",
  //       products
  //     );
  //   } catch (error) {}
  // };

  //- MUTATIONS METHODS

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

  updateById = async (
    data: I_UpdateProduct,
    productId: number,
    ruc: string,
    token: string
  ) => {
    try {
      // consideremos al titulo como el campo unico que no se debe repetir
      const slug = slugify(data.title, { lower: true });

      const responseProduct = await this.findById(productId, ruc, token);

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

  //

  // [note] ya no es necesario porque el producto se crea para un supplier

  // assignSupplierToProduct = async (supplierId: number, productId: number) => {
  //   try {
  //     const responseSupplier = await this.supplierService.findById(supplierId);
  //     const responseProduct = await this.findById(productId);

  //     if (responseSupplier.error || responseProduct.error)
  //       return this.responseService.BadRequestException(
  //         "Error al asignar proveedor"
  //       );

  //     const updated = await prisma.product.update({
  //       where: { id: productId },
  //       data: { supplier_id: supplierId },
  //     });

  //     return this.responseService.SuccessResponse(
  //       "Proveedor asignado correctamente",
  //       updated
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

  // removeSupplierToProduct = async (supplierId: number, productId: number) => {
  //   try {
  //     const responseSupplier = await this.supplierService.findById(supplierId);
  //     const responseProduct = await this.findById(productId);

  //     if (responseSupplier.error || responseProduct.error)
  //       return this.responseService.BadRequestException(
  //         "Error al asignar proveedor"
  //       );

  //     const updated = await prisma.product.update({
  //       where: { id: productId },
  //       data: { supplier_id: null },
  //     });

  //     return this.responseService.SuccessResponse(
  //       "Proveedor asignado correctamente",
  //       updated
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
}

export default ProductService;
