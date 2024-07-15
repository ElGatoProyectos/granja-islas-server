// import express from "express";
// import http from "http";
// import cors from "cors";

// import notificationSocketServer from "./infrastructure/sockets/notification.socket";
// import NotificationCronJob from "./infrastructure/cron/cron-notifications";
// import { InitRoutes } from "./infrastructure/config/config-routes";
// import { environments } from "./infrastructure/config/environments.constant";

// const app = express();
// const server = http.createServer(app);
// const io = notificationSocketServer(server);

// app.use(cors());
// app.use(express.json());

// NotificationCronJob(io);
// InitRoutes(app);

// app.listen(environments.PORT, () => {
//   console.log(`The app is running on port ${environments.PORT}`);
// });

import Server from "./infrastructure/server/server";

const server = new Server();
server.start();
