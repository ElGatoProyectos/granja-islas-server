import { Request, Response } from "express";
import UserService from "../services/user.service";
import multer from "multer";
import {
  companyMulterProperties,
  userMulterProperties,
} from "../models/constants/multer.constant";
import ResponseService from "../services/response.service";
import { createUserDTO } from "../../infrastructure/http/middlewares/dto/user.dto";
import path from "path";
import appRootPath from "app-root-path";
import sharp from "sharp";

const storage = multer.memoryStorage();

class UserController {
  private userService: UserService;
  private responseService: ResponseService;
  private upload: any;

  constructor() {
    this.userService = new UserService();
    this.responseService = new ResponseService();
    this.upload = multer({ storage: storage });
  }

  findUsers = async (request: Request, response: Response) => {
    const result = await this.userService.findUsersNoSuperAdmin();

    response.status(response.statusCode).json(result);
  };

  findUserById = async (request: Request, response: Response) => {
    const id = request.params.id;
    const result = await this.userService.findUserById(Number(id));

    response.status(response.statusCode).json(result);
  };

  create = async (request: Request, response: Response) => {
    const id = request.params.id;
    const result = await this.userService.findUserById(Number(id));

    response.status(response.statusCode).json(result);
  };

  //! pendiente la validacion de que solo pueda editar mi propio usuario
  edit = async (request: Request, response: Response) => {
    this.upload.single(userMulterProperties.field)(
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
            createUserDTO.parse(request.body);
            // - esto ya se valido en el middleware

            //todo registramos a la empresa
            const id = Number(request.params.id);
            const result = await this.userService.updateUserOrAdmin(data, id);

            if (result.error) {
              response.status(result.statusCode).json(result);
              return;
            }

            if (request.file) {
              const id = result.payload.id;

              const direction = path.join(
                appRootPath.path,
                "public",
                userMulterProperties.folder
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
              error
            );
            response.status(customError.statusCode).json(customError);
          }
        }
      }
    );
  };
}

export default UserController;
