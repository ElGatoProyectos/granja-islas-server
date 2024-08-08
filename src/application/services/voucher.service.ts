import { Company, StatusVoucher, User } from "@prisma/client";
import {
  I_CreateVoucher,
  I_StatusVoucher,
} from "../models/interfaces/voucher.interface";
import InfoService from "./info.service";
import ResponseService from "./response.service";
import prisma from "../../infrastructure/database/prisma";
import { E_Status } from "../models/enums/voucher.enum";
import appRootPath from "app-root-path";
import { voucherMulterProperties } from "../models/constants/multer.constant";
import fs from "fs/promises";

class VoucherService {
  private responseService: ResponseService;
  private infoService: InfoService;

  constructor() {
    this.responseService = new ResponseService();
    this.infoService = new InfoService();
  }

  findAll = async (
    document_id: number,
    document_code: string,
    rucFromHeader: string,
    token: string
  ) => {
    try {
      const responseInfo = await this.infoService.getCompanyAndUser(
        token,
        rucFromHeader
      );
      if (responseInfo.error) return responseInfo;

      const { user, company }: { user: User; company: Company } =
        responseInfo.payload;

      const vouchers = await prisma.voucher.findMany({
        where: { company_id: company.id, document_id, document_code },
      });

      return this.responseService.SuccessResponse(
        "Lista de vouchers",
        vouchers
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    } finally {
      prisma.$disconnect();
    }
  };

  getImage = async (
    voucherId: number,
    rucFromHeader: string,
    token: string
  ) => {
    try {
      const responseInfo = await this.infoService.getCompanyAndUser(
        token,
        rucFromHeader
      );
      if (responseInfo.error) return responseInfo;

      const { user, company }: { user: User; company: Company } =
        responseInfo.payload;

      const voucher = await prisma.voucher.findFirst({
        where: {
          company_id: company.id,
          id: voucherId,
        },
      });

      if (!voucher)
        return this.responseService.NotFoundException(
          "El voucher no existe para esta factura"
        );

      const imagePath =
        appRootPath +
        "/public/" +
        voucherMulterProperties.folder +
        "/" +
        voucherMulterProperties.folder +
        "_" +
        voucher.id +
        ".png";

      try {
        await fs.access(imagePath, fs.constants.F_OK);
      } catch (error) {
        return this.responseService.BadRequestException("Imagen no encontrada");
      }

      return this.responseService.SuccessResponse(undefined, imagePath);
    } catch (error) {
      error;
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    } finally {
      prisma.$disconnect();
    }
  };

  registerVoucher = async (
    data: I_CreateVoucher,
    rucFromHeader: string,
    token: string
  ) => {
    try {
      const responseInfo = await this.infoService.getCompanyAndUser(
        token,
        rucFromHeader
      );
      if (responseInfo.error) return responseInfo;

      const { user, company }: { user: User; company: Company } =
        responseInfo.payload;

      const formatData = {
        ...data,
        amount_original: data.amount_original,
        amount_converted: data.amount_original * data.exchange_rate,
        company_id: company.id,
        user_id_created: user.id,
        exchange_rate: data.exchange_rate,
      };

      let document = undefined;

      if (data.document_code === "01") {
        document = await prisma.bill.findFirst({
          where: { id: data.document_id, company_id: company.id },
        });
      } else if (data.document_code === "07") {
        document = await prisma.creditNote.findFirst({
          where: { id: data.document_id, company_id: company.id },
        });
      }

      // const bill = await prisma.bill.findFirst({
      //   where: { document_code: data.document_code,
      //     document_id: data.document_id,
      //     company_id: company.id },
      // });
      if (!document)
        return this.responseService.BadRequestException(
          "Ocurrio un error al solicitar la informacion"
        );

      const created = await prisma.voucher.create({ data: formatData });

      return this.responseService.CreatedResponse(
        "Voucher creado satisfactoriamente",
        created
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    } finally {
      prisma.$disconnect();
    }
  };

  updateStatus = async (
    data: I_StatusVoucher,
    voucher_id: number,
    rucFromHeader: string,
    token: string
  ) => {
    try {
      const responseInfo = await this.infoService.getCompanyAndUser(
        token,
        rucFromHeader
      );

      if (responseInfo.error) return responseInfo;

      const { user, company }: { user: User; company: Company } =
        responseInfo.payload;

      // const bill = await prisma.bill.findFirst({
      //   where: { id: billId, company_id: company.id },
      // });

      // if (!bill)
      //   return this.responseService.BadRequestException(
      //     "La factura o la empresa seleccionada no corresponden"
      //   );

      const voucher = await prisma.voucher.findFirst({
        where: { company_id: company.id, id: voucher_id },
      });

      if (!voucher)
        return this.responseService.NotFoundException(
          "El voucher no peternece a la empresa seleccionada"
        );

      let status: StatusVoucher = voucher.status;
      if (data.status === E_Status.APPROVED) status = StatusVoucher.APPROVED;
      if (data.status === E_Status.REFUSED) status = StatusVoucher.REFUSED;
      if (data.status === E_Status.PENDING) status = StatusVoucher.PENDING;

      const updated = await prisma.voucher.update({
        where: { id: voucher_id },
        data: { status },
      });

      return this.responseService.CreatedResponse(
        "Voucher modificado satisfactoriamentente",
        updated
      );
    } catch (error) {
      error;
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    } finally {
      prisma.$disconnect();
    }
  };

  deleteById = async (
    voucherId: number,
    rucFromHeader: string,
    token: string
  ) => {
    try {
      const responseInfo = await this.infoService.getCompanyAndUser(
        token,
        rucFromHeader
      );

      if (responseInfo.error) return responseInfo;

      const { user, company }: { user: User; company: Company } =
        responseInfo.payload;

      // const bill = await prisma.bill.findFirst({
      //   where: { id: billId, company_id: company.id },
      // });

      // if (!bill)
      //   return this.responseService.BadRequestException(
      //     "La factura o la empresa seleccionada no corresponden"
      //   );

      const voucher = await prisma.voucher.findFirst({
        where: { company_id: company.id, id: voucherId },
      });

      if (!voucher)
        return this.responseService.NotFoundException(
          "El voucher no peternece a la empresa seleccionada"
        );

      const pathImage =
        appRootPath + "/public/vouchers/vouchers_" + voucher.id + ".png";

      // validamos la imagen

      try {
        await fs.access(pathImage, fs.constants.F_OK);
        fs.unlink(pathImage)
          .then(() => {
            console.log("Imagen eliminada");
          })
          .catch((error) => {
            return this.responseService.BadRequestException(
              "Error al eliminar la imagen",
              error
            );
          });
      } catch (error) {
        return this.responseService.BadRequestException("Imagen no encontrada");
      }

      const deleted = await prisma.voucher.delete({
        where: { id: voucherId },
      });

      return this.responseService.CreatedResponse(
        "Voucher eliminado satisfactoriamentente",
        deleted
      );
    } catch (error) {
      error;
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    } finally {
      prisma.$disconnect();
    }
  };
}

export default VoucherService;
