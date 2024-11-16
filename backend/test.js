// 

const axios = require('axios');

// Define your Hugging Face access token and model endpoint
const huggingFaceApiToken = "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";
const modelEndpoint = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';

// Define your custom tool (e.g., for dashboard queries)
const dashboardTool = {
  name: "dashboardTool",
  async run(query) {
    const dashboards = {
      dashboard1: {
        url: 'http://example.com/dashboard1',
        columns: ['Column1', 'Column2', 'Column3']
      },
      dashboard2: {
        url: 'http://example.com/dashboard2',
        columns: ['ColumnA', 'ColumnB', 'ColumnC']
      },
      dashboard3: {
        url: 'http://example.com/dashboard3',
        columns: ['ColumnX', 'ColumnY', 'ColumnZ']
      }
    };

    // Simple matching logic
    for (const [key, dashboard] of Object.entries(dashboards)) {
      if (dashboard.columns.some(column => query.includes(column))) {
        return dashboard.url;
      }
    }
    return "No matching dashboard found";
  }
};

// Initialize the Hugging Face model
async function callHuggingFaceModel(inputs) {
  try {
    const response = await axios.post(modelEndpoint, {
      inputs: inputs
    }, {
      headers: {
        'Authorization': `Bearer ${huggingFaceApiToken}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Define the agent
class HfAgent {
  constructor(token, model, tools) {
    this.token = token;
    this.model = model;
    this.tools = tools;
  }

  async run(query) {
    // Check if the query is related to dashboards
    let result;
    if (query.toLowerCase().includes('dashboard')) {
      result = await dashboardTool.run(query);
    } else {
      result = await callHuggingFaceModel(query);
    }
    return result;
  }
}

// Initialize the Hugging Face agent with your access token, model, and tools
const agent = new HfAgent(
  huggingFaceApiToken,
  modelEndpoint,
  [dashboardTool]
);

// Function to handle user queries
async function handleUserQuery(userQuery) {
  try {
    // Use the agent to handle the query
    const response = await agent.run(userQuery);
    console.log('Response:', response); // Outputs the dashboard URL or model response
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example user query

const userQuery = 'Which dashboard contains ColumnQQ?';

// Process the user query
handleUserQuery(userQuery);
