"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const notification_socket_1 = __importDefault(require("../sockets/notification.socket"));
const cron_notifications_1 = __importDefault(require("../cron/cron-notifications"));
const environments_constant_1 = require("../config/environments.constant");
const route_manager_1 = require("./route-manager");
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.server = http_1.default.createServer(this.app);
        this.io = (0, notification_socket_1.default)(this.server);
        this.routes();
        // this.cronJobs();
    }
    config() {
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
    }
    routes() {
        const routeManager = new route_manager_1.RouteManager(this.app);
        routeManager.initializeRoutes();
    }
    cronJobs() {
        (0, cron_notifications_1.default)(this.io);
    }
    start() {
        this.server.listen(environments_constant_1.environments.PORT, () => {
            console.log(`The app is running on port ${environments_constant_1.environments.PORT}`);
        });
    }
}
exports.default = Server;
