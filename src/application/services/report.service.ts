import { Bill, Product } from "@prisma/client";
import prisma from "../../infrastructure/database/prisma";
import { T_Header } from "../models/types/methods.type";
import ProductLabelService from "./product-label.service";
import ResponseService from "./response.service";

type T_GeneralAnalysisBasic = {
  params: {
    label_id: number;
  };
  headers: T_Header;
};

type T_GeneralAnalysisDetail = {
  params: {
    label_id: number;
    filter_month: number;
  };
  headers: T_Header;
};

class ReportService {
  private responseService: ResponseService = new ResponseService();
  private productLabelService: ProductLabelService = new ProductLabelService();

  principalSuppliers(response: any) {
    const groupedSuppliers = response.reduce((acc: any, bill: any) => {
      const supplierId = bill.supplier_id;
      const supplier = bill.Supplier;

      if (!acc[supplierId]) {
        acc[supplierId] = {
          ruc: supplier.ruc,
          business_name: supplier.business_name,
          total: 0,
        };
      }

      acc[supplierId].total += bill.total;

      return acc;
    }, {});

    const result = Object.values(groupedSuppliers);

    result.sort((a: any, b: any) => b.total - a.total);

    return result;
  }

  buyForMonth(response: any) {
    const year = new Date().getFullYear();

    // Inicializar objeto con los meses y total en 0
    const monthMap: { [key: string]: string } = {
      "01": "enero",
      "02": "febrero",
      "03": "marzo",
      "04": "abril",
      "05": "mayo",
      "06": "junio",
      "07": "julio",
      "08": "agosto",
      "09": "septiembre",
      "10": "octubre",
      "11": "noviembre",
      "12": "diciembre",
    };

    // Inicializar objeto con los meses y total en 0, con tipo definido
    const formatData: { [key: string]: number } = {
      enero: 0,
      febrero: 0,
      marzo: 0,
      abril: 0,
      mayo: 0,
      junio: 0,
      julio: 0,
      agosto: 0,
      septiembre: 0,
      octubre: 0,
      noviembre: 0,
      diciembre: 0,
    };

    response.forEach((item: any) => {
      const month: string = item.period.split("-")[1];
      const monthName: string = monthMap[month];
      const period: string = `${year}-${month}`;

      if (item.period === period) {
        formatData[monthName] += item.total;
      }
    });

    return formatData;
  }

  generalAnaysisBasic = async (data: T_GeneralAnalysisBasic) => {
    try {
      const detailProducts = await prisma.detailProductLabel.findMany({
        where: {
          product_label_id: data.params.label_id,
        },
        include: { Product: true },
      });

      const response = await Promise.all(
        detailProducts.map(async (detail) => {
          const product = detail.Product as any;

          return await prisma.bill.findFirst({
            where: { id: product.document_id },
            include: { Supplier: true },
          });
        })
      );

      const principalSuppliers = this.principalSuppliers(response);
      const buyForMonth = this.buyForMonth(response);

      return this.responseService.SuccessResponse("Report basico", {
        principalSuppliers,
        buyForMonth,
      });
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  detailGeneralAnaysis_Supplier = async (data: T_GeneralAnalysisDetail) => {
    try {
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;

      let period: any = `${year}-${month.toString().padStart(2, "0")}`;

      if (data.params.filter_month === 6 || data.params.filter_month === 12) {
        const months = Array.from(
          { length: data.params.filter_month },
          (_, i) => `${year}-${(i + 1).toString().padStart(2, "0")}`
        );

        period = { in: months };
      }

      let filtereds = {
        product_label_id: data.params.label_id,
        period,
      };

      const detailProducts = await prisma.detailProductLabel.findMany({
        where: filtereds,

        include: { Product: true },
      });

      const response = await Promise.all(
        detailProducts.map(async (detail) => {
          const product = detail.Product as any;

          return await prisma.bill.findFirst({
            where: { id: product.document_id },
            include: { Supplier: true },
          });
        })
      );

      const groupedSuppliers = response.reduce((acc: any, bill: any) => {
        const supplierId = bill.supplier_id;
        const supplier = bill.Supplier;

        if (!acc[supplierId]) {
          acc[supplierId] = {
            ruc: supplier.ruc,
            business_name: supplier.business_name,
            total: 0,
          };
        }

        acc[supplierId].total += bill.total;

        return acc;
      }, {});

      const result = Object.values(groupedSuppliers);

      result.sort((a: any, b: any) => b.total - a.total);
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };
}

export default ReportService;
