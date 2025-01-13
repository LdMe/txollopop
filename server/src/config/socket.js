
import { Server } from "socket.io";

let io;

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: "*", // En producción, cambiar por el origen específico del frontend
            methods: ["GET", "POST"]
        }
    });

    const userSockets = new Map(); // userId -> socket.id

    io.on("connection", (socket) => {
        console.log("Usuario conectado:", socket.id);

        socket.on("register", (userId) => {
            userSockets.set(userId, socket.id);
            console.log(`Usuario ${userId} registrado con socket ${socket.id}`);
        });

        socket.on("disconnect", () => {
            for (const [userId, socketId] of userSockets.entries()) {
                if (socketId === socket.id) {
                    userSockets.delete(userId);
                    console.log(`Usuario ${userId} desconectado`);
                    break;
                }
            }
        });
    });

    return { io, userSockets };
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io no está inicializado");
    }
    return io;
};