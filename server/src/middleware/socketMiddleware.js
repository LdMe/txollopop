import { getIO } from "../config/socket.js";

export const socketMiddleware = (req, res, next) => {
    const {io, userSockets}= getIO();
    req.io = io;
    req.userSockets = userSockets;
    next();
};