import express from "express";
import http from "http";
import cors from "cors";

import notificationSocketServer from "./sockets/notification.socket";
import NotificationCronJob from "./utils/cron-notifications";
import { InitRoutes } from "./config-routes";

const app = express();
const server = http.createServer(app);
const io = notificationSocketServer(server);

app.use(cors());
app.use(express.json());

NotificationCronJob(io);
InitRoutes(app);
