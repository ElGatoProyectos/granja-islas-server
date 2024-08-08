import slugify from "slugify";
import prisma from "../../infrastructure/database/prisma";
import {
  I_CreateLabel,
  I_UpdateLabel,
} from "../models/interfaces/label-product.interface";
import ResponseService from "./response.service";
import ProductService from "./product.service";
import InfoService from "./info.service";
import {
  Company,
  Product,
  ProductLabel,
  TypeDocument,
  User,
} from "@prisma/client";

type T_FindDocumentsByLabel = {
  params: {
    product_label_id: number;
    year: number | undefined;
    month: number | undefined;
    supplier_group_id: string | undefined;
  };
  pagination: {
    page: number;
    limit: number;
  };
  headers: {
    ruc: string;
    token: string;
  };
};

type T_FindByReport = {
  params: {
    filter: string | undefined;
    year: number | undefined;
    month: number | undefined;
    supplier_group_id: string | undefined;
    status_group: string | undefined;
  };
  pagination: {
    page: number;
    limit: number;
  };
  headers: {
    ruc: string;
    token: string;
  };
};

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

  findDocuments = async (data: T_FindDocumentsByLabel) => {
    // [message] puede ser que tambien se evalue boletas, etc...
    try {
      const skip = (data.pagination.page - 1) * data.pagination.limit;

      const responseInfo = await this.infoService.getCompanyAndUser(
        data.headers.token,
        data.headers.ruc
      );
      if (responseInfo.error) return responseInfo;

      const { user, company }: { user: User; company: Company } =
        responseInfo.payload;

      let period: any;

      let filtereds: any = { company_id: company.id };

      let filteredsSecond: any = { company_id: company.id };

      if (data.params.year && data.params.month) {
        period = `${data.params.year}-${data.params.month
          .toString()
          .padStart(2, "0")}`;
        filtereds.period = period;
      }

      if (data.params.supplier_group_id) {
        filtereds.supplier_id = {
          in: data.params.supplier_group_id.split(",").map(Number),
        };
      }

      const detailBills = await prisma.bill.findMany({ where: filtereds });

      const detailLabelProducts = await prisma.detailProductLabel.findMany({
        where: {
          product_label_id: data.params.product_label_id,
        },
        include: { Product: true },
      });

      const detailProducts = await prisma.product.findMany({
        where: {
          id: {
            in: detailLabelProducts.map((item) => item.product_id),
          },
          document_id: {
            in: detailBills.map((item) => item.id),
          },
          document_type: TypeDocument.BILL,
        },
        include: { Supplier: true },
      });

      const formattedData = detailProducts.map((item) => {
        return {
          ...item,
          Supplier: item.Supplier,
          Document: detailBills.find((bill) => bill.id === item.document_id),
        };
      });

      // Obtener el total de registros
      const total = formattedData.length;
      const pageCount = Math.ceil(total / data.pagination.limit);

      // Aplicar paginación
      const paginatedData = formattedData.slice(
        skip,
        skip + data.pagination.limit
      );

      // Formatear la respuesta
      const formattedPagination = {
        total,
        page: data.pagination.page,
        limit: data.pagination.limit,
        pageCount,
        data: paginatedData,
      };

      return this.responseService.SuccessResponse(
        "Lista de productos",
        formattedPagination
      );
    } catch (error) {
      console.log(error);
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  findLabelsByReport = async (data: T_FindByReport) => {
    try {
      const skip = (data.pagination.page - 1) * data.pagination.limit;

      const responseInfo = await this.infoService.getCompanyAndUser(
        data.headers.token,
        data.headers.ruc
      );
      if (responseInfo.error) return responseInfo;

      const { user, company }: { user: User; company: Company } =
        responseInfo.payload;

      let filtered: any = {};

      let filteredSuppliers: any = {};

      if (data.params.filter) {
        filtered.title = {
          contains: data.params.filter,
        };
      }

      if (data.params.supplier_group_id) {
        filteredSuppliers.supplier_id = {
          in: data.params.supplier_group_id.split(",").map(Number),
        };
      }

      if (data.params.year && data.params.month) {
        filteredSuppliers.period = `${data.params.year}-${data.params.month
          .toString()
          .padStart(2, "0")}`;
      }

      if (data.params.status_group) {
        filteredSuppliers.Supplier.business_status = {
          in: data.params.status_group.split(","),
        };
      }

      console.log(filteredSuppliers);

      const detailLabels = await prisma.productLabel.findMany({
        where: { company_id: company.id, status_deleted: false, ...filtered },
      });

      const detailProductLabels = await prisma.detailProductLabel.findMany({
        // where: {
        //   Label: { company_id: company.id, status_deleted: false },
        // },
        where: {
          product_label_id: { in: detailLabels.map((item) => item.id) },
        },
        include: { Product: true, Label: true },
      });

      const labeldsSet = new Set(
        detailProductLabels.map((item) => item.product_label_id)
      );

      const labelIds = [...labeldsSet];

      const response = await Promise.all(
        labelIds.map(async (label_id) => {
          // suponiendo que es todo facturas
          //  de aqui sale el producto y el label
          const detail = detailProductLabels.filter(
            (i) => i.product_label_id === label_id
          );
          const billIds: any = detail.map((item) =>
            item.Product ? item.Product.document_id : ""
          );

          const bills = await prisma.bill.findMany({
            where: {
              id: { in: billIds },
              ...filteredSuppliers,
            },
            orderBy: { issue_date: "desc" }, // Ordenar por fecha de emisión
            include: { Supplier: true },
          });

          if (bills.length === 0) {
            return null;
          }

          const lastBill = bills[0];
          const lastPrice = lastBill.amount_base;
          const currencyCode = lastBill.currency_code;

          const prices = detail
            .map((x, i) => {
              return x.Product?.price;
            })
            .filter((price) => price !== undefined) as number[];

          const averagePrice =
            prices.length > 0
              ? prices.reduce((acc, price) => acc + (price || 0), 0) /
                prices.length
              : 0;

          const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;

          const productIdMinPrice = detail.find(
            (d) => d.Product?.price === lowestPrice
          )?.Product?.supplier_id;

          const supplier = bills.find(
            (b) => b.supplier_id === productIdMinPrice
          )?.Supplier;

          const lastPurchaseDate = lastBill.issue_date;

          return {
            label: detail[0].Label?.title,
            lastPurchaseDate,
            currencyCode,
            lastPrice,
            averagePrice,
            lowestPrice,
            supplier,
          };
        })
      );

      const responseNoNull = response.filter((item) => item !== null);

      // Obtener el total de registros
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
        "Lista de etiquetas",
        formatData
      );
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
