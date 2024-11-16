const axios = require('axios');

const huggingFaceApiToken = "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";
const huggingFaceApiToken1='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'
const modelEndpoint = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';

// const openAI = 'https://api.openai.com/v1/chat/completions';
// const openAiApiKey = "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";

function buildDashboardUrl(dashboard, filters) {
  const queryParams = new URLSearchParams(filters).toString();
  return queryParams ? `${dashboard.url}?${queryParams}` : dashboard.url;
}

// Function to call Hugging Face model
async function callHuggingFaceModel(prompt) {
  try {
    console.log("endpoint")
    const response = await axios.post(modelEndpoint, {
      inputs: prompt,
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
      3. Subscriptions Dashboard, Columns = Product_Name, Subscriber_ID, State, Customer_Satisfaction_Score, Payment_Method, Aging, Churn_new

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

    try {
      // Call the LLM with the prompt
      console.log("modelllllllllllll")
      const modelResponse = await callHuggingFaceModel(prompt);
      console.log(modelResponse)

      // Assuming the model response is a JSON string within the generated text
      const generatedText = modelResponse[0].generated_text;
      console.log("Generated Text Start:");
      console.log(generatedText);
      console.log("Generated Text End");

      // Split the generated text based on the query
      const queryStart = generatedText.indexOf(`Query: "${query}"`);
      const responseStart = generatedText.indexOf('Response:', queryStart);

      if (responseStart !== -1) {
        // Extract the part of text after 'Response:'
        const responsePart = generatedText.substring(responseStart).trim();

        // Use a regular expression to find the last JSON response
        const jsonResponseMatch = responsePart.match(/{\s*"dashboard":\s*"[^"]*"(?:,\s*"filters":\s*{[^}]*})?\s*}/g);

        if (jsonResponseMatch && jsonResponseMatch.length > 0) {
          // Take the last matched JSON response
          const jsonResponse = jsonResponseMatch[jsonResponseMatch.length - 1];
          const { dashboard, filters } = JSON.parse(jsonResponse);

          if (dashboard) {
            return buildDashboardUrl({ url: `http://localhost:5000/${dashboard}` }, filters || {});
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

// Create an async function to run the dashboardTool
async function runDashboardTool(input) {
  console.log(input)
  console.log(typeof(input))
  const result = await dashboardTool.run(input);
  console.log('Result:', result);
//   if (typeof window !== 'undefined') {
//     window.location.href = result;
//   }
  return result;
}

// Export the dashboardTool
module.exports = runDashboardTool;
