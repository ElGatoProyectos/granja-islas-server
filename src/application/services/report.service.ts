import { Bill, Company, Product, User } from "@prisma/client";
import prisma from "../../infrastructure/database/prisma";
import { T_Header } from "../models/types/methods.type";
import ProductLabelService from "./product-label.service";
import ResponseService from "./response.service";
import InfoService from "./info.service";

type T_GeneralAnalysisBasic = {
  params: {
    label_id: number;
  };
  headers: T_Header;
};

type T_GeneralAnalysisDetail = {
  params: {
    filter_month: number;
  };
  headers: T_Header;
};

class ReportService {
  private responseService: ResponseService = new ResponseService();
  private productLabelService: ProductLabelService = new ProductLabelService();
  private infoService: InfoService = new InfoService();

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
      const responseInfo = await this.infoService.getCompanyAndUser(
        data.headers.token,
        data.headers.ruc
      );
      if (responseInfo.error) return responseInfo;

      const { user, company }: { user: User; company: Company } =
        responseInfo.payload;

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
            where: {
              id: product.document_id,
              Supplier: { company_id: company.id },
            },
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

  detailGeneralAnalysis_Supplier = async (data: T_GeneralAnalysisDetail) => {
    try {
      const responseInfo = await this.infoService.getCompanyAndUser(
        data.headers.token,
        data.headers.ruc
      );
      if (responseInfo.error) return responseInfo;

      const { user, company }: { user: User; company: Company } =
        responseInfo.payload;

      const year = new Date().getFullYear();
      const month = new Date().getMonth() - 1;

      let period: any = `${year}-${(month + 1).toString().padStart(2, "0")}`;

      if (data.params.filter_month === 6 || data.params.filter_month === 12) {
        const months = [];
        for (let i = 0; i < data.params.filter_month; i++) {
          const date = new Date(year, month - i);
          const y = date.getFullYear();
          const m = (date.getMonth() + 1).toString().padStart(2, "0");
          months.push(`${y}-${m}`);
        }

        period = { in: months };
      }

      let filtereds = {
        period: period, // Asegurarte que `period` esté en la estructura correcta
        Supplier: { company_id: company.id },
      };

      const detailProducts = await prisma.bill.findMany({
        where: filtereds,
        include: { Supplier: true },
      });

      const groupedSuppliers = detailProducts.reduce((acc: any, bill: any) => {
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

      console.log(filtereds);

      const result = Object.values(groupedSuppliers);

      result.sort((a: any, b: any) => b.total - a.total);
      return this.responseService.SuccessResponse("Report detalle", result);
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  detailGeneralAnalysis_ExpenditureComposition = async (
    data: T_GeneralAnalysisDetail
  ) => {
    try {
      const responseInfo = await this.infoService.getCompanyAndUser(
        data.headers.token,
        data.headers.ruc
      );
      if (responseInfo.error) return responseInfo;

      const { user, company }: { user: User; company: Company } =
        responseInfo.payload;

      const year = new Date().getFullYear();
      const month = new Date().getMonth() - 1;

      let period: any = `${year}-${(month + 1).toString().padStart(2, "0")}`;

      if (data.params.filter_month === 6 || data.params.filter_month === 12) {
        const months = [];
        for (let i = 0; i < data.params.filter_month; i++) {
          const date = new Date(year, month - i);
          const y = date.getFullYear();
          const m = (date.getMonth() + 1).toString().padStart(2, "0");
          months.push(`${y}-${m}`);
        }

        period = { in: months };
      }

      let filtereds = {
        period: period,
        Supplier: { company_id: company.id },
      };

      const detailBills = await prisma.bill.findMany({
        where: filtereds,
      });

      const detailProducts = await prisma.product.findMany({
        where: { document_id: { in: detailBills.map((item: any) => item.id) } },
      });

      const detailLabels = await prisma.detailProductLabel.findMany({
        where: {
          product_id: { in: detailProducts.map((item: any) => item.id) },
        },
        include: { Label: true, Product: true },
      });

      const labelTotals = detailLabels.reduce((acc: any, current: any) => {
        const labelName = current.Label.title;
        const bill = detailBills.find(
          (bill: any) => bill.id === current.Product.document_id
        );
        const totalBillAmount = bill ? bill.total : 0;

        if (!acc[labelName]) {
          acc[labelName] = 0;
        }

        acc[labelName] += totalBillAmount;
        return acc;
      }, {});

      const topLabels = Object.entries(labelTotals)
        .map(([label, total]: any) => ({ label, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 3);

      return this.responseService.SuccessResponse("Report detalle", topLabels);
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };
}

export default ReportService;
