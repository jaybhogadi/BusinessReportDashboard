import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './ChatBot.css';
import axios from 'axios';
// import dashboardPrompt from './dashboardPrompt';

// Hugging Face API configuration
const huggingFaceApiToken = "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";
const modelEndpoint = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';

// Function to call Hugging Face model
async function callHuggingFaceModel(prompt) {
  try {
    const response = await axios.post(modelEndpoint, {
      inputs: prompt,
    }, {
      headers: {
        'Authorization': `Bearer ${huggingFaceApiToken}`,
        'Content-Type': 'application/json'
      }
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Tool to identify dashboard and construct URL
const dashboardTool = {
  name: "dashboardTool",
  description: "Identifies the appropriate dashboard and constructs a URL with filters based on the user query.",
  async run(query) {
    const prompt = `
      Given the user query: "${query}"
      Determine the appropriate dashboard and generate a URL with filters if applicable.

      Dashboards:
      1. Sales Dashboard, Columns = Product_ID, Product_Name, Region, Month, Year, Quarter, Sale_Amount, Sale_Quantity
      2. Agent Commissions Dashboard, Columns = Agent_ID, Sales_Closed, Total_Commission, Average_Commission_per_Sale, Region, Commission_Date
      3. Subscription Dashboard, Columns = Product_Name, Subscriber_ID, State, Customer_Satisfaction_Score, Payment_Method, Aging, Churn_new

      Your task is to identify the dashboard and provide the necessary filters based on the user query.
      Respond only in the following format:
      { "dashboard": "dashboard_name", "filters": { "key": "value" } }

      Example:
      Query: "display the Sales dashboard of region East"
      Response: 
      {
        "dashboard": "sales_dashboard",
        "filters": {
          "Region": "East"
        }
      }

      Do not include any additional information or context in the response.
    `;
    // const prompt2=dashboardPrompt(query)
    // console.log(prompt2)
    console.log(prompt)
  

    try {
      const modelResponse = await callHuggingFaceModel(prompt);

      // Assuming the model response is a JSON string within the generated text
      const generatedText = modelResponse[0].generated_text;
      console.log("Generated Text Start:");
      console.log(generatedText);
      console.log("Generated Text End");

      // Split the generated text based on the query
      const queryStart = generatedText.indexOf(`Query: "${query}"`);
      const responseStart = generatedText.indexOf('Response:', queryStart);

      if (responseStart !== -1) {
        const responsePart = generatedText.substring(responseStart).trim();

        const jsonResponseMatch = responsePart.match(/{\s*"dashboard":\s*"[^"]*"(?:,\s*"filters":\s*{[^}]*})?\s*}/g);

        if (jsonResponseMatch && jsonResponseMatch.length > 0) {
          const jsonResponse = jsonResponseMatch[jsonResponseMatch.length - 1];
          const { dashboard, filters } = JSON.parse(jsonResponse);

          if (dashboard) {
            return buildDashboardUrl({ url: `http://localhost:3000/${dashboard}` }, filters || {});
          } else {
            return "No matching dashboard found.";
          }
        } else {
          return "No matching JSON response found.";
        }
      } else {
        return "Response part not found in the generated text.";
      }
    } catch (error) {
      return "An error occurred while processing the query.";
    }
  }
};

function buildDashboardUrl(dashboard, filters) {
  const queryParams = new URLSearchParams(filters).toString();
  return queryParams ? `${dashboard.url}?${queryParams}` : dashboard.url;
}

const generateServerId = () => {
  return new Date().toISOString();
};

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

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
  }, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: 'user' };
      setMessages([...messages, userMessage]);
      setInput('');

      try {
        const result = await dashboardTool.run(input);
        console.log(result);

        const botMessage = { text: JSON.stringify(result), sender: 'bot' };
        setMessages(prevMessages => [...prevMessages, botMessage]);

        // Check if window.location.href contains "localhost"
        // if (window.location.href.includes("localhost") && result) {
        //   window.location.href = result;
        // }

      } catch (error) {
        console.error('Error handling message:', error);
        const errorMessage = { text: 'An error occurred while processing the query.', sender: 'bot' };
        setMessages(prevMessages => [...prevMessages, errorMessage]);
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent default action (like form submission)
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
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              // onKeyDown={handleSend} // Add key press handler
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