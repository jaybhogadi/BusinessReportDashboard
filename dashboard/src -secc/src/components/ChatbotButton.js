// src/components/ChatbotButton.js
import React from 'react';
import './ChatbotButton.css'; // Create this CSS file for styling

const ChatbotButton = () => {
  return (
    <div className="chatbot-button">
      <button onClick={() => alert('Chatbot activated!')}>
        Chat
      </button>
    </div>
  );
};

export default ChatbotButton;
