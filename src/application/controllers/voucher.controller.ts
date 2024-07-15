import { Request, Response } from "express";
import ResponseService, { T_Response } from "../services/response.service";
import MulterController from "./multer.controller";
import multer from "multer";

export default class VoucherController {
  private multerController: MulterController = new MulterController();
  private responseService: ResponseService = new ResponseService();

  constructor() {}

  ssss() {
    const x = this.responseService.BadRequestException(
      "Error al procesar archivo"
    );
    console.log(x);
    return x;
  }

  async findVouchers(request: Request, response: Response) {}

  async findVoucher(request: Request, response: Response) {}

  async registerVoucher(request: Request, response: Response) {
    const upload = multer().single("voucher");

    upload(request, response, async (err) => {
      if (err) {
        return response.status(500).json({ error: "Error uploading file" });
      }

      const file = request.file;
      if (!file) {
        return response.status(400).json({ error: "No file uploaded" });
      }

      try {
        console.log("base de datos.....");
      } catch (error) {
        response.status(500).json(error);
      }
    });

    await this.multerController.control(request, response, "voucher");
  }

  async updateVoucher(request: Request, response: Response) {
    const voucher = request.file;
    if (!voucher) {
    }
  }

  async deleteVoucher(request: Request, response: Response) {}
}
