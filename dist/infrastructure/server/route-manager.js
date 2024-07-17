"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteManager = void 0;
const auth_route_1 = __importDefault(require("../http/routes/auth.route"));
const user_route_1 = __importDefault(require("../http/routes/user.route"));
const test_route_1 = __importDefault(require("../http/routes/test.route"));
const company_route_1 = __importDefault(require("../http/routes/company.route"));
const sire_route_1 = __importDefault(require("../http/routes/sire.route"));
const sunat_route_1 = __importDefault(require("../http/routes/sunat.route"));
const seed_route_1 = __importDefault(require("../http/routes/seed.route"));
class RouteManager {
    constructor(app) {
        this.app = app;
        this._globalPrefix = "/api";
    }
    initializeRoutes() {
        this.app.use(this._globalPrefix, auth_route_1.default);
        this.app.use(this._globalPrefix, user_route_1.default);
        this.app.use(this._globalPrefix, test_route_1.default);
        // this.app.use(this._globalPrefix, voucherRoute);
        this.app.use(this._globalPrefix, company_route_1.default);
        this.app.use(this._globalPrefix, sire_route_1.default);
        this.app.use(this._globalPrefix, sunat_route_1.default);
        this.app.use(this._globalPrefix, seed_route_1.default);
    }
}
exports.RouteManager = RouteManager;
