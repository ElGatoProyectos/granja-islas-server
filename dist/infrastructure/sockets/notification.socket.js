"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const notificationSocketServer = (server) => {
    const io = new socket_io_1.Server(server, {
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
exports.default = notificationSocketServer;
