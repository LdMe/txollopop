import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    messages: [
        {
            sender: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            message: {
                type: String,
                required: true,
            },
            timestamp: {
                type: Date,
                default: Date.now,
            }
        }
    ]
}, {
    timestamps: true,
});

const Chat = mongoose.model('Chat', ChatSchema);

export default Chat;
