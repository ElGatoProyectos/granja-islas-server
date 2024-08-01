import multer from "multer";
import ResponseService from "../services/response.service";
import { voucherMulterProperties } from "../models/constants/multer.constant";
import { Request, Response } from "express";

const storage = multer.memoryStorage();

class VoucherController {
  private upload: any;
  private responseService: ResponseService;

  constructor() {
    this.responseService = new ResponseService();
    this.upload = multer({ storage: storage });
  }

  edit = async (request: Request, response: Response) => {
    console.log("in controller edit");
    this.upload.single(voucherMulterProperties.field)(
      request,
      response,
      async (err: any) => {
        //todo validamos si hay un error
        if (err) {
          console.log("primer error", err);
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

            console.log(request.body);
            const { "user-profile": userProfile, ...restData } = request.body;

            // [message] solo deberia usarse un metodo, y evaluar si soy admin, user o superadmin, por ende, deberia recibir el token por header
            const id = Number(request.params.id);
            const token = request.get("Authorization") as string;
            const result = await this.userService.updateUser(
              restData,
              id,
              token
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
                userMulterProperties.folder
              );
              const ext = path.extname(request.file.originalname);
              const fileName = `${userMulterProperties.folder}_${id}${ext}`;
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
            console.log("Error in catch", error);
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

export default VoucherController;
