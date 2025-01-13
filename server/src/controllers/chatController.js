import Chat from "../models/chatModel.js";

async function createChat(req,res){
    try {
        const {product,buyer,seller} = req.body;
        const chat = await Chat.create({
            product,
            buyer,
            seller
        })
        return res.status(201).json(chat);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message:"Error interno del servidor"
        })
    }
}
async function getById(req,res){
    try {
        const {id} = req.params;
        const chat = await Chat.findById(id);
        return res.status(200).json(chat);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message:"Error interno del servidor"
        })
    }
}
async function getAllChatsByUser(req,res){
    try {
        const {userId} = req.params;
        const chats = await Chat.find({$or:[{buyer:userId},{seller:userId}]});
        return res.status(200).json(chats);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message:"Error interno del servidor"
        })
    }
}
async function addMessage(req,res){
    try {
        const {chatId} = req.params;
        const {message,sender} = req.body;
        const chat = await Chat.findById(chatId);
        if(!chat){
            return res.status(400).json({
                message:"El chat no existe"
            })
        }
        chat.messages.push({message,sender});
        console.log(req.userSockets)
        const receiver = chat.buyer.toString() === sender.toString() ? chat.seller : chat.buyer;
        const userSocket = req.userSockets.get(receiver.toString());
        const formattedMessage = chat.messages.find((m) => m.sender.toString() === sender.toString() && m.message === message);
        console.log("formattedMessage",formattedMessage)
        req.io.to(userSocket).emit("newMessage", {chatId, message:formattedMessage});
        await chat.save();
        return res.status(200).json(chat);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message:"Error interno del servidor"
        })
    }
}


export default {
    createChat,
    addMessage,
    getAllChatsByUser,
    getById
}