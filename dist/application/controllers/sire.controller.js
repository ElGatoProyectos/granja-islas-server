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
const sire_service_1 = __importDefault(require("../services/sire.service"));
class SireController {
    constructor() {
        this.captureDate = (request, response) => __awaiter(this, void 0, void 0, function* () {
            // codTipoOpe=3&page=1&perPage=100
            const codTipoOpe = parseInt(request.query.codTipoOpe);
            const page = parseInt(request.query.page);
            const perPage = parseInt(request.query.perPage);
            const result = yield this.sireService.getBills();
            response.status(result.statusCode).json(result);
        });
        this.sireService = new sire_service_1.default();
    }
}
exports.default = SireController;
