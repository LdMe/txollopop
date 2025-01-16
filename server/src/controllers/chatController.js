import Chat from "../models/chatModel.js";

async function createChat(req,res){
    try {
        const {product,buyer,seller} = req.body;
        if(buyer.toString() === seller.toString()){
            console.log("El usuario no puede ser el mismo");
            const chat = await Chat.findOne({product,seller});
            return res.status(200).json(chat);
        }
        const oldChat = await Chat.findOne({product,buyer,seller});
        if(oldChat){
            return res.status(200).json(oldChat);
        }
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
        await chat.populate("product","_id name");

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
        //populate product
        for(const chat of chats){
            await chat.populate("product","_id name");
        }
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
        await chat.save();
        const receiverId = sender.toString() === chat.buyer.toString() ? chat.seller : chat.buyer;
        const response = req.emitToUser(receiverId,"product-message",{message,sender,chatId:chat._id});
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