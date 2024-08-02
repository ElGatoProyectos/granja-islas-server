import appRootPath from "app-root-path";
import { Request, Response } from "express";
import path from "path";
import multer from "multer";
import { companyMulterProperties } from "../../../application/models/constants/multer.constant";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const direction = path.join(
      appRootPath.path,
      "public",
      companyMulterProperties.folder
    );
    cb(null, direction);
  },
  filename: (req, file, cb) => {
    //  ("companyId", companyId);
    const ext = path.extname(file.originalname); // Obtener la extensión del archivo original
    const fileName = `${companyMulterProperties.folder}_${222}${ext}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

class SaveImageMiddleware {
  saveFile(request: Request, response: Response) {
    ("in middleware!");
    upload.single("company-profile")(request, response, (err) => {
      if (err) {
        return response.status(500).json({ error: err.message });
      } else {
        response
          .status(200)
          .json({ message: "File uploaded successfully", file: request.file });
      }
    });
  }
}

export default SaveImageMiddleware;
