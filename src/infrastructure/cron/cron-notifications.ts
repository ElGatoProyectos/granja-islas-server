// src/cronJob.ts
import cron from "node-cron";
import { Server as SocketIOServer } from "socket.io";

function NotificationCronJob(io: SocketIOServer) {
  cron.schedule("0 * * * *", () => {
    io.emit("prev-give-data", { message: "This is a scheduled event" });

    // received data user and search notifications for
    io.on("credentials", (credentials) => {
      io.emit("", {});
    });
  });
}

export default NotificationCronJob;
