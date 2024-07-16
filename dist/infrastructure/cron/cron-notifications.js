"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/cronJob.ts
const node_cron_1 = __importDefault(require("node-cron"));
function NotificationCronJob(io) {
    node_cron_1.default.schedule("0 * * * *", () => {
        io.emit("prev-give-data", { message: "This is a scheduled event" });
        io.on("credentials", (credentials) => {
            io.emit("", {});
        });
    });
}
exports.default = NotificationCronJob;
