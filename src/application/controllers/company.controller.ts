import { Request, Response } from "express";
import CompanyService from "../services/company.service";
import ResponseService, { T_Response } from "../services/response.service";
import multer from "multer";
import { companyMulterProperties } from "../models/constants/multer.constant";
import path from "path";
import appRootPath from "app-root-path";
import sharp from "sharp";
import {
  createCompanyDTO,
  updateCompanyDTO,
} from "../../infrastructure/http/middlewares/dto/company.dto";

const storage = multer.memoryStorage();

class CompanyController {
  private companyService: CompanyService;
  private responseService: ResponseService;
  private upload: any;

  constructor() {
    this.companyService = new CompanyService();
    this.responseService = new ResponseService();
    this.upload = multer({ storage: storage });
  }

  //* success
  create = async (request: Request, response: Response) => {
    this.upload.single(companyMulterProperties.field)(
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
            createCompanyDTO.parse(request.body);

            //todo registramos a la empresa
            const result = await this.companyService.create(data);

            if (result.error) {
              response.status(result.statusCode).json(result);
              return;
            }

            if (request.file) {
              const id = result.payload.id;
              const direction = path.join(
                appRootPath.path,
                "public",
                companyMulterProperties.folder
              );
              const ext = path.extname(request.file.originalname);
              const fileName = `${companyMulterProperties.folder}_${id}${ext}`;
              const filePath = path.join(direction, fileName);

              sharp(request.file.buffer)
                .resize({ width: 800 })
                .toFormat("jpeg")
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
              response.status(result.statusCode).json(result);
            }
          } catch (error) {
            const customError = this.responseService.BadRequestException(
              "Error al validar los campos",
              err
            );
            response.status(customError.statusCode).json(customError);
          }
        }
      }
    );
  };

  //* success
  findAll = async (request: Request, response: Response) => {
    const result = await this.companyService.findAll();
    response.status(result.statusCode).json(result);
  };

  //* success
  findAllWithDeleted = async (request: Request, response: Response) => {
    const result = await this.companyService.findAllWithDeleted();
    response.status(result.statusCode).json(result);
  };

  //* success
  findBydId = async (request: Request, response: Response) => {
    const id = request.params.id;
    const result = await this.companyService.deleteById(+id);
    response.status(result.statusCode).json(result);
  };

  //* success
  updateById = async (request: Request, response: Response) => {
    this.upload.single(companyMulterProperties.field)(
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
            updateCompanyDTO.parse(request.body);

            //todo registramos a la empresa
            const result = await this.companyService.updateById(
              Number(request.params.id),
              data
            );

            if (result.error) {
              response.status(result.statusCode).json(result);
              return;
            }

            if (request.file) {
              const id = result.payload.id;
              const direction = path.join(
                appRootPath.path,
                "public",
                companyMulterProperties.folder
              );
              const ext = path.extname(request.file.originalname);
              const fileName = `${companyMulterProperties.folder}_${id}${ext}`;
              const filePath = path.join(direction, fileName);

              sharp(request.file.buffer)
                .resize({ width: 800 })
                .toFormat("jpeg")
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
              response.status(result.statusCode).json(result);
            }
          } catch (error) {
            const customError = this.responseService.BadRequestException(
              "Error al validar los campos",
              err
            );
            response.status(customError.statusCode).json(customError);
          }
        }
      }
    );
  };

  //* success
  deleteById = async (request: Request, response: Response) => {
    const companyId = request.params.id;

    const result = await this.companyService.deleteById(Number(companyId));

    response.status(result.statusCode).json(result);
  };
}
export default CompanyController;
