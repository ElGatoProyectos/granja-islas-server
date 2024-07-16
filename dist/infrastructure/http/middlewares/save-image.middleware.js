"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_root_path_1 = __importDefault(require("app-root-path"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const multer_constant_1 = require("../../../application/models/constants/multer.constant");
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const direction = path_1.default.join(app_root_path_1.default.path, "public", multer_constant_1.companyMulterProperties.folder);
        cb(null, direction);
    },
    filename: (req, file, cb) => {
        // console.log("companyId", companyId);
        const ext = path_1.default.extname(file.originalname); // Obtener la extensión del archivo original
        const fileName = `${multer_constant_1.companyMulterProperties.folder}_${222}${ext}`;
        cb(null, fileName);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
class SaveImageMiddleware {
    saveFile(request, response) {
        console.log("in middleware!");
        upload.single("company-profile")(request, response, (err) => {
            if (err) {
                return response.status(500).json({ error: err.message });
            }
            else {
                response
                    .status(200)
                    .json({ message: "File uploaded successfully", file: request.file });
            }
        });
    }
}
exports.default = SaveImageMiddleware;
