import express from "express";
import http from "http";
import cors from "cors";
import notificationSocketServer from "../sockets/notification.socket";
import NotificationCronJob from "../cron/cron-notifications";

import { environments } from "../config/environments.constant";
import { RouteManager } from "./route-manager";
import { Server as SocketIOServer } from "socket.io";

class Server {
  public app: express.Application;
  private server: http.Server;
  private io: SocketIOServer;

  constructor() {
    this.app = express();
    this.config();
    this.server = http.createServer(this.app);
    this.io = notificationSocketServer(this.server);

    this.routes();
    // this.cronJobs();
  }

  private config(): void {
    this.app.use(
      cors({
        origin: "*", // Permitir todos los orígenes
        methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
      })
    );
    this.app.use(express.json());
  }

  private routes(): void {
    const routeManager = new RouteManager(this.app);
    routeManager.initializeRoutes();
  }

  private cronJobs(): void {
    NotificationCronJob(this.io);
  }

  public start(): void {
    this.server.listen(environments.PORT, () => {
      console.log(`The app is running on port ${environments.PORT}`);
    });
  }
}

export default Server;
