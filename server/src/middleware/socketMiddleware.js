import { getIO } from "../config/socket.js";

export const socketMiddleware = (req, res, next) => {
    req.io = getIO();
    next();
};