import { useLoaderData } from "react-router-dom";
import { useEffect, useContext,useState} from "react";
import {io} from "socket.io-client";
import { LoginContext } from "../context/loginContext";
import { sendMessage } from "../utils/api/fetch";

const socket = io(import.meta.env.VITE_BACKEND_URL);
function Chat() {
    const {id} = useContext(LoginContext);
    const chat = useLoaderData();
    const [messages, setMessages] = useState(chat.messages);
    useEffect(() => {
        console.log("registrado con id",id)
        socket.emit("register-socket",id);
        socket.on("product-message",data =>{
            console.log("mensaje recibido",data)
            setMessages([...messages,data])
        })
        return () => {
            socket.off("product-message");
            //socket.disconnect();
        }
    },[id])
    async function handleSendMessage(e){
        e.preventDefault();
        const message = e.target.message.value;
        const response = await sendMessage(id,message,chat._id);
        setMessages([...messages,{message,sender:id}]);
        console.log(response);
    }
    return (
        <>
            <div>Chat</div>
            {chat && messages && messages.map(message => (
                <div key={message._id}>
                    <p>{message.message}</p>
                    <p>{message.sender}</p>
                </div>
            ))}
            <form onSubmit={handleSendMessage}>
            <input type="text" placeholder="Message" name="message" />
            <button type="submit">Send</button>
            </form>
        </>
    )
}

export default Chat