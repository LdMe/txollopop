import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/connectDb.js";
import router from "./routes/router.js";
dotenv.config();
const PORT = 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));// configurar body parser para recibir datos de formularios
app.use(express.json());// configurar body parser para recibir datos en formato json
app.get("/", (req,res)=>{
    res.send("Hello World");
})

app.use("",router);

async function startServer(){
    await connectDb();
    app.listen(PORT,()=>{
        console.log(`Server running on port ${PORT}`);
    })
}

startServer();
