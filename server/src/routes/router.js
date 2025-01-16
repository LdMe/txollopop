import { Router } from "express";

import { upload } from "../services/fileService.js";
import userController from "../controllers/userController.js";
import productController from "../controllers/productController.js";
import chatController from "../controllers/chatController.js";
const router = Router();

// user routes
router.post("/register",userController.register);
router.post("/login",userController.login);
router.get("/user/:id",userController.getUser);

// product routes
router.get("/products",productController.getAllProducts);
router.get("/user/:userId/products", productController.getMyProducts);
router.post("/product",upload.array("images",5),productController.createProduct);
router.get("/product/:id",productController.getProduct);
router.delete("/product/:id",productController.deleteProduct);

// chat routes
router.get("/user/:userId/chats",chatController.getAllChatsByUser);
router.post("/chat",chatController.createChat);
router.get("/chat/:id",chatController.getById);
router.post("/chat/:chatId",chatController.addMessage);

export default router;

