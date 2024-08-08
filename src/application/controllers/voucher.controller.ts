import multer from "multer";
import ResponseService from "../services/response.service";
import { voucherMulterProperties } from "../models/constants/multer.constant";
import { Request, Response } from "express";
import { registerVoucherDTO } from "../../infrastructure/http/middlewares/dto/voucher.dto";
import appRootPath from "app-root-path";
import path from "path";
import sharp from "sharp";
import VoucherService from "../services/voucher.service";
import fs from "fs/promises";
import { E_Status } from "../models/enums/voucher.enum";
const storage = multer.memoryStorage();

class VoucherController {
  private upload: any;
  private responseService: ResponseService;
  private voucherService: VoucherService;

  constructor() {
    this.responseService = new ResponseService();
    this.voucherService = new VoucherService();
    this.upload = multer({ storage: storage });
  }

  findAllForDocument = async (request: Request, response: Response) => {
    const document_id = Number(request.query.document_id);
    const document_code = request.query.document_code as string;
    const token = request.get("Authorization") as string;
    const ruc = request.get("ruc") as string;

    const result = await this.voucherService.findAll(
      document_id,
      document_code,
      ruc,
      token
    );
    response.status(result.statusCode).json(result);
  };

  getImage = async (request: Request, response: Response) => {
    const voucher_id = Number(request.params.voucher_id);
    const token = request.get("Authorization") as string;
    const ruc = request.get("ruc") as string;
    const result = await this.voucherService.getImage(voucher_id, ruc, token);
    if (result.error) {
      response.status(result.statusCode).json(result);
    } else {
      fs.readFile(result.payload);
      response.sendFile(result.payload);
    }
  };

  create = async (request: Request, response: Response) => {
    this.upload.single(voucherMulterProperties.field)(
      request,
      response,
      async (err: any) => {
        //todo validamos si hay un error
        if (err) {
          const customError = this.responseService.BadRequestException(
            "Error al procesar la imagen 2",
            err
          );
          response.status(customError.statusCode).json(customError);
        }
        //todo validamos el archivo
        else {
          const data = request.body;

          try {
            //todo validamos el parse
            registerVoucherDTO.parse(request.body);

            // - esto ya se valido en el middleware

            if (request.file) {
              const { voucher, ...restData } = request.body;

              // [note] transformamos la data, ya que todo lo recibe como string 😒

              const newFormat = {
                ...restData,
                amount_original: Number(restData.amount_original),
                exchange_rate: Number(restData.exchange_rate),
                bank_id: Number(restData.bank_id),
                document_id: Number(restData.document_id),
              };

              const token = request.get("Authorization") as string;
              const ruc = request.get("ruc") as string;
              const result = await this.voucherService.registerVoucher(
                newFormat,
                ruc,
                token
              );

              console.log(result);

              if (result.error) {
                response.status(result.statusCode).json(result);
                return;
              }

              // [note] solo creamos el voucher si hay una imagen

              const voucherId = result.payload.id;

              const direction = path.join(
                appRootPath.path,
                "public",
                voucherMulterProperties.folder
              );
              // const ext = path.extname(request.file.originalname);
              const ext = ".png";

              const fileName = `${voucherMulterProperties.folder}_${voucherId}${ext}`;
              const filePath = path.join(direction, fileName);

              sharp(request.file.buffer)
                .resize({ width: 800 })
                .toFormat("png")
                .jpeg({ quality: 80 })
                .toFile(filePath, (err) => {
                  if (err) {
                    const customError =
                      this.responseService.BadRequestException(
                        "Error al guardar la imagen",
                        err
                      );
                    response.status(customError.statusCode).json(customError);
                  } else {
                    response.status(result.statusCode).json(result);
                  }
                });
            } else {
              const customError = this.responseService.BadRequestException(
                "Error al validar los campos"
              );
              response.status(customError.statusCode).json(customError);
            }
          } catch (error) {
            const customError = this.responseService.BadRequestException(
              "Error al validar los campos",
              error
            );
            response.status(customError.statusCode).json(customError);
          }
        }
      }
    );
  };

  updateStatus = async (request: Request, response: Response) => {
    const voucher_id = Number(request.params.voucher_id);
    const status = request.query.status as E_Status;
    const token = request.get("Authorization") as string;
    const ruc = request.get("ruc") as string;
    const result = await this.voucherService.updateStatus(
      { status },
      voucher_id,
      ruc,
      token
    );
    response.status(result.statusCode).json(result);
  };

  delete = async (request: Request, response: Response) => {
    const voucher_id = Number(request.params.voucher_id);
    const token = request.get("Authorization") as string;
    const ruc = request.get("ruc") as string;
    const result = await this.voucherService.deleteById(voucher_id, ruc, token);
    response.status(result.statusCode).json(result);
  };
}

export default VoucherController;
