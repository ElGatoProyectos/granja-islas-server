import { Request, Response } from "express";
import ReportService from "../services/report.service";

class ReportController {
  // primer reporte registro compras [doc/images/report-1.png]
  private reportService: ReportService = new ReportService();
  reportPurchaseRecord = async (request: Request, response: Response) => {};

  generalAnaysisBasic = async (request: Request, response: Response) => {
    const ruc = request.get("ruc") as string;
    const token = request.get("Authorization") as string;
    const label_id = Number(request.params.label_id);

    const options = {
      headers: {
        ruc,
        token,
      },
      params: {
        label_id,
      },
    };
    const result = await this.reportService.generalAnaysisBasic(options);
    response.status(result.statusCode).json(result);
  };
}

export default ReportController;
