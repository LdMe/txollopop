import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/connectDb.js";
import router from "./routes/router.js";
import cors from "cors";
import {createServer} from "http";
import startSocket from "./config/socket.js";

dotenv.config();
const PORT = 3000;
const app = express();
app.use(cors());
const httpServer = createServer(app);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));// configurar body parser para recibir datos de formularios
app.use(express.json());// configurar body parser para recibir datos en formato json

const {io,emitToUser} = startSocket(httpServer);

app.use((req, res, next) => {
    req.io = io;
    req.emitToUser = emitToUser;
    next();
});

app.get("/", (req,res)=>{
    res.send("Hello World");
})

app.use("",router);

async function startServer(){
    await connectDb();
    httpServer.listen(PORT,()=>{
        console.log(`Server running on port ${PORT}`);
    })
}

startServer();
