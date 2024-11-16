const axios = require('axios');

// Define your Hugging Face access token and model endpoint
const modelEndpoint = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';


const openAiApiKey = "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";
const huggingFaceApiToken = "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";

const llm1 = axios.create({
  baseURL: 'https://api.openai.com/v1/chat/completions',
  headers: { 'Authorization': `Bearer ${openAiApiKey}` }
});

const dashboards = {
  sales_dashboard: {
    url: 'http://localhost:5000/sales_dashboard',
    columns: ['Product_ID', 'Product_Name', 'Region', 'Month', 'Year', 'Quarter', 'Sale_Amount', 'Sale_Quantity']
  },
  agent_commissions_dashboard: {
    url: 'http://localhost:5000/agent_commissions_dashboard',
    columns: ['Agent_ID', 'Sales_Closed', 'Total_Commission', 'Average_Commission_per_Sale', 'Region', 'Commission_Date']
  },
  subscriptions_dashboard: {
    url: 'http://localhost:5000/subscriptions_dashboard',
    columns: ['Product_Name', 'Subscriber_ID', 'State', 'Customer_Satisfaction_Score', 'Payment_Method', 'Aging', 'Churn_new']
  }
};

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

// Define your tool
const dashboardTool = {
  name: "dashboardTool",
  description: "Uses LLM to identify the appropriate dashboard and construct a URL with filters based on user query.",
  async run(query) {
    // Define the prompt to send to the LLM
    const prompt = `
      Given the user query: "${query}"
      Determine the appropriate dashboard and identify the filters if applicable.

      Dashboards:
      1. Sales Dashboard: Columns = Product_ID, Product_Name, Region, Month, Year, Quarter, Sale_Amount, Sale_Quantity
      2. Agent Commissions Dashboard:  Columns = Agent_ID, Sales_Closed, Total_Commission, Average_Commission_per_Sale, Region, Commission_Date
      3. Subscriptions Dashboard: URL =  Columns = Product_Name, Subscriber_ID, State, Customer_Satisfaction_Score, Payment_Method, Aging, Churn_new

      Your task is to identify the dashboard name for the given query base on the query and filter values if present.
      return the dashboard name and  column name found.
    `;

    try {
      // Call the LLM with the prompt
      const modelResponse = await callHuggingFaceModel(prompt);
      return modelResponse;
    } catch (error) {
      return "An error occurred while processing the query.";
    }
  }
};

// Example usage
const userQuery = 'Show me the agent dashboard with agentID 112';
dashboardTool.run(userQuery).then(result => console.log('Result:', result));
