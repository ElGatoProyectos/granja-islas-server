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
const response_service_1 = __importDefault(require("./response.service"));
class BillService {
    constructor() {
        this.searchBillForCode = (code) => __awaiter(this, void 0, void 0, function* () {
            try {
            }
            catch (error) {
                return this.responseService.InternalServerErrorException();
            }
        });
        this.findAll = (period, month) => __awaiter(this, void 0, void 0, function* () {
            try {
                let bills;
                if (period && !month) {
                }
                else if (month && !period) {
                }
                else if (period && month) {
                }
                return this.responseService.SuccessResponse("Lista de facturas", bills);
            }
            catch (error) {
                return this.responseService.InternalServerErrorException();
            }
        });
        this.responseService = new response_service_1.default();
    }
}
exports.default = BillService;
