import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './ChatBot.css';
import { runFunction } from './chatbotfunction';  // Ensure this path is correct
import axios from 'axios';






const generateServerId = () => {
  return new Date().toISOString();
};

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const messagesEndRef = React.createRef();

  useEffect(() => {
    const storedServerId = localStorage.getItem('serverId');
    const currentServerId = generateServerId();

    if (storedServerId !== currentServerId) {
      localStorage.removeItem('chatMessages');
      localStorage.setItem('serverId', currentServerId);
    } else {
      const savedMessages = localStorage.getItem('chatMessages');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: 'user' };
      setMessages([...messages, userMessage]);
      setInput('');

      try {
        // console.log("runFunction:", runFunction);
        // console.log(axios.post)
        const result = await runFunction(input);
        console.log(result);
        console.log(localStorage.getItem('tool'))
        const tool=localStorage.getItem('tool')
        if(tool==="notJS"){
          console.log("backend code")
          

          window.location.href = 'http://localhost:3000/custom_chart2/sales_dashboard';


        }else if(tool==="dashboardTool")
        {
          window.location.href = result;
        }else{

        const botMessage = { text: JSON.stringify(result), sender: 'bot' };
        setMessages(prevMessages => [...prevMessages, botMessage]);

        }
        

      } catch (error) {
        console.error('Error handling message:', error);
        const errorMessage = { text: 'An error occurred while processing the query.', sender: 'bot' };
        setMessages(prevMessages => [...prevMessages, errorMessage]);
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSend();
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
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
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
