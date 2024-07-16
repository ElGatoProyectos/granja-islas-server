"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const app_root_path_1 = __importDefault(require("app-root-path"));
// Configuración de almacenamiento de multer
const storage = (folder) => multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const direction = path_1.default.join(app_root_path_1.default.path, "public", folder);
        cb(null, direction);
    },
    filename: (req, file, cb) => {
        const id = req.params.id;
        const ext = path_1.default.extname(file.originalname); // Obtener la extensión del archivo original
        const fileName = `${folder}_${id}${ext}`;
        cb(null, fileName);
    },
});
class MulterController {
    control(request, response, folder, field, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const upload = (0, multer_1.default)({ storage: storage(folder) }).single(field);
            return new Promise((resolve, reject) => {
                upload(request, response, (err) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                    }
                    else {
                        console.log(request.file);
                        resolve(request.file);
                    }
                });
            });
        });
    }
}
exports.default = MulterController;
