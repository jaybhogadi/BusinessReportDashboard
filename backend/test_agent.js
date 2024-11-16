const axios = require('axios');

const huggingFaceApiToken = "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";
const modelEndpoint = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';

// const llm1 = axios.create({
//   baseURL: 'https://api.openai.com/v1/chat/completions',
//   headers: { 'Authorization': `Bearer ${openAiApiKey}` }
// });

const openAI='https://api.openai.com/v1/chat/completions'
const openAiApiKey = "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";

function buildDashboardUrl(dashboard, filters) {
  const queryParams = new URLSearchParams(filters).toString();
  return queryParams ? `${dashboard.url}?${queryParams}` : dashboard.url;
}




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
    return response.data;
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Function to build the dashboard URL with filters
function buildDashboardUrl(dashboard, filters) {
  const queryParams = new URLSearchParams(filters).toString();
  return queryParams ? `${dashboard.url}?${queryParams}` : dashboard.url;
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
        // Extract the part of text after 'Response:'
        const responsePart = generatedText.substring(responseStart).trim();

        // Use a regular expression to find the last JSON response
        const jsonResponseMatch = responsePart.match(/{\s*"dashboard":\s*"[^"]*"(?:,\s*"filters":\s*{[^}]*})?\s*}/g);

        if (jsonResponseMatch && jsonResponseMatch.length > 0) {
          // Take the last matched JSON response
          const jsonResponse = jsonResponseMatch[jsonResponseMatch.length - 1];
          console.log(jsonResponse)
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
        // Use a regular expression to find the JSON response
//         const jsonResponseMatch = responsePart.match(/({\s*"dashboard":\s*"[^"]*"(?:,\s*"filters":\s*{[^}]*})?\s*})/g);

//         if (jsonResponseMatch && jsonResponseMatch.length > 0) {
//           // Take the last matched JSON response
//           const jsonResponse = jsonResponseMatch[jsonResponseMatch.length - 1];
//           const { dashboard, filters } = JSON.parse(jsonResponse);

//           if (dashboard) {
//             return buildDashboardUrl(dashboards[dashboard], filters);
//           } else {
//             return "No matching dashboard found.";
//           }
//         } else {
//           return "No matching JSON response found.";
//         }
//       } else {
//         return "Delimiter not found in the response.";
//       }
//     } catch (error) {
//       return "An error occurred while processing the query.";
//     }
//   }
// };

// Example usage
const userQuery = 'display the Sales dashboard of region East';
const userQuery1= 'display the agent dashboard of region East of agent id as 101';
const userQuery2='give the agent dashboard with commission date 2024-04-11';
const userQuery3='give the subscription dashboard with product office 365';
const userQuery4='give the sales dashboard of North in 2022 in Q4 ';
const userQuery5='open me to sales dashboard ';


dashboardTool.run(userQuery5).then(result => console.log('Result:', result));
