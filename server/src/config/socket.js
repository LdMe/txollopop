import {Server as socketIo} from "socket.io";

export function startSocket(server){
    const io = new socketIo(server,{
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });
    const users = new Map();

    io.on("connection", (socket) => {
        console.log("socket conectado con id:"+socket.id);
        socket.on("register-socket",(userId)=>{
            console.log(`usuario con id ${userId} conectado con el socket ${socket.id}`);
            users.set(userId,socket.id);
            console.log(users);
            io.emit("connected-users",Array.from(users.keys()));
        })
        socket.on("group-message",({message,senderId})=>{
            io.emit("group-message",{
                message,
                senderId
            })
        })
        socket.on("private-message",({message,senderId,receiverId})=>{
            const receiverSocketId = users.get(receiverId);
            io.to(receiverSocketId).emit("private-message",{
                message,
                senderId
            })
        })
        socket.on("disconnect", () => {
            console.log("socket desconectado con id:"+socket.id);
            users.forEach((value,key)=>{
                if(value === socket.id){
                    return users.delete(key);
                }
            })
        })
    })
    function emitToUser(userId,event,data){
        const socketId = users.get(userId.toString());
        console.log("emitiendo mensaje",userId,socketId,event,data);
        if(!socketId){
            return false;
        }
        io.to(socketId).emit(event,data);
        return true;
    }
    return {io,emitToUser}
}


export default startSocket