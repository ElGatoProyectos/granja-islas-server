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
const response_service_1 = __importDefault(require("../services/response.service"));
const multer_controller_1 = __importDefault(require("./multer.controller"));
const multer_1 = __importDefault(require("multer"));
class VoucherController {
    constructor() {
        this.multerController = new multer_controller_1.default();
        this.responseService = new response_service_1.default();
    }
    ssss() {
        const x = this.responseService.BadRequestException("Error al procesar archivo");
        console.log(x);
        return x;
    }
    findVouchers(request, response) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    findVoucher(request, response) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    registerVoucher(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const upload = (0, multer_1.default)().single("voucher");
            upload(request, response, (err) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    return response.status(500).json({ error: "Error uploading file" });
                }
                const file = request.file;
                if (!file) {
                    return response.status(400).json({ error: "No file uploaded" });
                }
                try {
                    console.log("base de datos.....");
                }
                catch (error) {
                    response.status(500).json(error);
                }
            }));
            yield this.multerController.control(request, response, "voucher");
        });
    }
    updateVoucher(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const voucher = request.file;
            if (!voucher) {
            }
        });
    }
    deleteVoucher(request, response) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.default = VoucherController;
