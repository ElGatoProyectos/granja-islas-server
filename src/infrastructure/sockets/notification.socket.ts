// src/socketServer.ts
import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

const notificationSocketServer = (server: HttpServer): SocketIOServer => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*", // Configura esto según tus necesidades
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });

    // Add more event listeners here
  });

  return io;
};

export default notificationSocketServer;
