import { Request, Response } from "express";
import CompanyService from "../services/company.service";
import BaseController from "./config/base.controller";
import ResponseService, { T_Response } from "../services/response.service";
import multer from "multer";
import MulterController from "./multer.controller";
import { companyMulterProperties } from "../models/constants/multer.constant";
import path from "path";
import appRootPath from "app-root-path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const direction = path.join(appRootPath.path, "public", "companies");
    cb(null, direction);
  },
  filename: (req, file, cb) => {
    const id = req.params.id;

    const ext = path.extname(file.originalname); // Obtener la extensión del archivo original
    const fileName = `${companyMulterProperties.folder}_${id}${ext}`;
    cb(null, fileName);
  },
});

class CompanyController {
  private companyService: CompanyService;
  private responseService: ResponseService;
  private upload: any;

  constructor() {
    this.companyService = new CompanyService();
    this.responseService = new ResponseService();
    this.upload = multer({ storage: storage });
  }

  //todo file required
  create = async (request: Request, response: Response) => {
    const data = request.body;
    const result = await this.companyService.create(data);
    response.status(result.statusCode).json(result);
  };

  registerImage = async (request: Request, response: Response) => {
    this.upload.single(companyMulterProperties.field)(
      request,
      response,
      async (err: any) => {
        if (err) {
          response.status(500).json({ error: err.message });
        } else {
          if (request.file) {
            response.status(200).json({ message: "ok" });
          } else {
            response.status(400).json({ message: "Error, no hay imagen" });
          }
        }
      }
    );
  };

  createError = () => {
    return { BadRequestException: this.responseService.BadRequestException() };
  };

  findAll = async (request: Request, response: Response) => {
    const result = await this.companyService.findAll();
    response.status(result.statusCode).json(result);
  };

  findBydId = async (request: Request, response: Response) => {
    const id = request.params.id;
    const result = await this.companyService.deleteById(+id);
    response.status(result.statusCode).json(result);
  };

  async updateById(request: Request, response: Response) {
    const id = request.params.id;
    const data = request.body;
    const result = await this.companyService.deleteById(+id);
    response.status(result.statusCode).json(result);
  }
}
export default CompanyController;
