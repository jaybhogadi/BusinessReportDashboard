import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './ChatBot.css';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Close the chatbot when the location changes
    setIsOpen(false);
  }, [location]);

  const handleSend = () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: 'user' };
      setMessages([...messages, userMessage]);
      setInput('');

      // Simulate bot reply (replace with actual backend call)
      setTimeout(() => {
        const botMessage = { text: `Bot replies to: ${input}`, sender: 'bot' };
        setMessages(prevMessages => [...prevMessages, botMessage]);
      }, 500);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button className="chatbot-toggle-button" onClick={toggleChat}>
        💬
      </button>
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            ChatBot
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chatbot-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
