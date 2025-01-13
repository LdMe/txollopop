import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { initSocket } from "./config/socket.js";
import { socketMiddleware } from "./middleware/socketMiddleware.js";
import connectDb from "./config/connectDb.js";
import router from "./routes/router.js";


dotenv.config();
const PORT = 3000;
const app = express();
const httpServer = createServer(app);
initSocket(httpServer);

app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));// configurar body parser para recibir datos de formularios
app.use(express.json());// configurar body parser para recibir datos en formato json

app.use(socketMiddleware);
app.get("/", (req,res)=>{
    res.send("Hello World");
})

app.use("",router);

async function startServer(){
    await connectDb();
    httpServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

startServer();
