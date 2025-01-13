import React, { useState, useEffect } from 'react';
import { io } from "socket.io-client";

// Usuario hardcodeado para pruebas
const DUMMY_USER = {
  _id: "67850d96d2806bcc53340825",
  name: "Usuario Test"
};

const CHAT_ID = "67850db8d2806bcc53340827";
const BACKEND_URL = "http://localhost:3002";
const ChatTest = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Conectar al socket
    const newSocket = io(BACKEND_URL);
    
    newSocket.on("connect", () => {
      console.log("Conectado al socket");
      setConnected(true);
      // Registrar el usuario
      newSocket.emit("register", DUMMY_USER._id);
    });

    newSocket.on("newMessage", ({ chatId, message }) => {
      setMessages(prev => [...prev, {
        chatId,
        ...message,
        isOwn: message.sender === DUMMY_USER._id
      }]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      // Crear el chat o usar uno existente

      const response = await fetch(`${BACKEND_URL}/chat/${CHAT_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          sender: DUMMY_USER._id
        }),
      });

      if (response.ok) {
        setMessages(prev => [...prev, {
          message,
          sender: DUMMY_USER._id,
          timestamp: new Date(),
          isOwn: true
        }]);
        setMessage("");
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="mb-4 p-4 bg-gray-100 rounded-lg">
        <p className="font-bold">Estado: {connected ? 'Conectado' : 'Desconectado'}</p>
        <p className="text-sm">Usuario: {DUMMY_USER.name}</p>
      </div>

      <div className="mb-4 h-96 overflow-y-auto border rounded-lg p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded-lg max-w-[80%] ${
              msg.isOwn 
                ? 'ml-auto bg-blue-500 text-white' 
                : 'bg-gray-200'
            }`}
          >
            <p className="text-sm">{msg.message}</p>
            <span className="text-xs opacity-70">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Escribe un mensaje..."
          className="flex-1 p-2 border rounded-lg"
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default ChatTest;