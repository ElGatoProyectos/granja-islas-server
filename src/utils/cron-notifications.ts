// src/cronJob.ts
import cron from "node-cron";
import { Server as SocketIOServer } from "socket.io";

const NotificationCronJob = (io: SocketIOServer) => {
  cron.schedule("0 * * * *", () => {
    console.log("Running a task every hour");
    io.emit("prev-give-data", { message: "This is a scheduled event" });

    io.on("credentials", (credentials) => {
      io.emit("", {});
    });
  });
};

export default NotificationCronJob;
