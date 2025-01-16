import { useLoaderData } from "react-router-dom";
import { useEffect, useContext, useState, useRef } from "react";
import { io } from "socket.io-client";
import { LoginContext } from "../../context/loginContext";
import { sendMessage } from "../../utils/api/fetch";
import "./Chat.css";

const socket = io(import.meta.env.VITE_BACKEND_URL);

function Chat() {
  const { id } = useContext(LoginContext);
  const chat = useLoaderData();
  const [messages, setMessages] = useState(chat.messages);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    socket.emit("register-socket", id);
    
    socket.on("product-message", data => {
      setMessages(prevMessages => [...prevMessages, data]);
    });

    return () => {
      socket.off("product-message");
    };
  }, [id]);

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const messageText = e.target.message.value.trim();
    
    if (!messageText || loading) return;
    
    setLoading(true);
    try {
      await sendMessage(id, messageText, chat._id);
      setMessages([...messages, { 
        message: messageText, 
        sender: id,
        timestamp: new Date().toISOString()
      }]);
      e.target.reset();
      inputRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const isOwnMessage = (senderId) => senderId === id;

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat with {isOwnMessage(chat.seller) ? 'Buyer' : 'Seller'}</h2>
      </div>

      <div className="chat-messages">
        {messages && messages.map((message, index) => (
          <div
            key={index}
            className={`message ${
              isOwnMessage(message.sender) ? 'message-sent' : 'message-received'
            }`}
          >
            <div className="message-content">{message.message}</div>
            <div className="message-timestamp">
              {formatTimestamp(message.timestamp)}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <form onSubmit={handleSendMessage} className="chat-input-form">
          <input
            type="text"
            name="message"
            className="chat-input"
            placeholder="Type your message..."
            ref={inputRef}
            disabled={loading}
          />
          <button 
            type="submit" 
            className="send-button"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;