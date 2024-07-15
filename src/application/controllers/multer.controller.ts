import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import appRootPath from "app-root-path";

// Configuración de almacenamiento de multer
const storage = (folder: string) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const direction = path.join(appRootPath.path, "public", folder);
      cb(null, direction);
    },
    filename: (req, file, cb) => {
      const id = req.params.id;
      const ext = path.extname(file.originalname); // Obtener la extensión del archivo original
      const fileName = `${folder}_${id}${ext}`;
      cb(null, fileName);
    },
  });

export default class MulterController {
  async control(
    request: Request,
    response: Response,
    folder: string,
    field: string,
    id: number
  ) {
    const upload = multer({ storage: storage(folder) }).single(field);

    return new Promise((resolve, reject) => {
      upload(request, response, (err: any) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log(request.file);
          resolve(request.file);
        }
      });
    });
  }
}
