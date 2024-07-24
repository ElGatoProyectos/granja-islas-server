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
const bill_service_1 = __importDefault(require("../services/bill.service"));
class BillController {
    constructor() {
        this.findAll = (request, response) => __awaiter(this, void 0, void 0, function* () {
            // filtro por periodo
            const period = parseInt(request.query.period);
            // filtro por mes
            const month = parseInt(request.query.month);
            const result = yield this.billService.findAll(period, month);
            response.status(result.statusCode).json(result);
        });
        this.captureData = (request, response) => __awaiter(this, void 0, void 0, function* () {
            // necesitamos capturar todos los detalles y validarlo con los proveedores y facturas, en conclusion, primero registrar la factura y luego lo demas
        });
        this.excelFindAll = (request, response) => { };
        this.billService = new bill_service_1.default();
    }
}
exports.default = BillController;
