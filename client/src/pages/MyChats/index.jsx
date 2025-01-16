// src/pages/MyChats.jsx
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../../context/loginContext';
import './MyChats.css';

function ChatCard({ chat, onClick }) {
  const [otherUser, setOtherUser] = useState(null);
  const { id } = useContext(LoginContext);
  
  useEffect(() => {
    const fetchUser = async () => {
      const userId = chat.buyer._id === id ? chat.seller : chat.buyer;
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/${userId}`);
        const userData = await response.json();
        setOtherUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, [chat, id]);

  const lastMessage = chat.messages[chat.messages.length - 1];

  return (
    <div className="chat-card" onClick={onClick}>
      <h3 className="chat-title">
        Chat with {otherUser?.name || 'Loading...'}
      </h3>
      <p className="chat-product">
        Product: {chat.product?.name || 'Unknown Product'}
      </p>
      {lastMessage && (
        <div className="chat-message">
          <p className="chat-last-message">{lastMessage.message}</p>
          <p className="chat-timestamp">
            {new Date(lastMessage.timestamp).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
}

function MyChats() {
  const { id } = useContext(LoginContext);
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/user/${id}/chats`
        );
        const chatsData = await response.json();
        setChats(chatsData);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    if (id) {
      fetchChats();
    }
  }, [id]);

  return (
    <div className="chats-container">
      <h1>My Chats</h1>
      <div className="chats-list">
        {chats.map((chat) => (
          <ChatCard
            key={chat._id}
            chat={chat}
            onClick={() => navigate(`/chat/${chat._id}`)}
          />
        ))}
        {chats.length === 0 && (
          <p className="no-chats">No chats found</p>
        )}
      </div>
    </div>
  );
}

export default MyChats;