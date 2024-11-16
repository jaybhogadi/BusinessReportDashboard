// // const { DynamicTool } = require("@langchain/core/tools");
// const axios = require("axios");
// const initSqlJs = require('sql.js');
// const { sqlTool, dashboardTool } = require('./chatbottools');

// // Hugging Face API configuration
// const huggingFaceApiToken = "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";
// const modelEndpoint = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';

// // Function to call Hugging Face model
// async function callHuggingFaceModel(prompt) {
//   try {
//     const response = await axios.post(modelEndpoint, {
//       inputs: prompt,
//     }, {
//       headers: {
//         'Authorization': `Bearer ${huggingFaceApiToken}`,
//         'Content-Type': 'application/json'
//       }
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error:', error.response ? error.response.data : error.message);
//     throw error;
//   }
// }

// // Sample data to be used as a DataFrame (Array of objects)
// // const dataFrame = [
// //   { Product_ID: 1, Product_Name: 'Product A', Region: 'East', Month: 'January', Year: 2023, Sale_Amount: 1000, Sale_Quantity: 10 },
// //   { Product_ID: 2, Product_Name: 'Product B', Region: 'West', Month: 'February', Year: 2023, Sale_Amount: 2000, Sale_Quantity: 20 },
// //   { Product_ID: 3, Product_Name: 'Product C', Region: 'East', Month: 'March', Year: 2023, Sale_Amount: 3000, Sale_Quantity: 30 },
// //   // Add more rows as needed
// // ];

// // SQL Tool for executing SQL queries generated from NLP
// // const sqlTool = new DynamicTool({
// //   name: "sqlTool",
// //   description: "Converts the user query into an SQL statement and executes it against the internal DataFrame.",
// //   func: async (query) => {
// //     const prompt1 = `
// //       Convert the following natural language query into an SQL query:
// //       Query: "${query}"

// //       Provide only the SQL query, nothing else.

// //       Example:
// //       Query: "Get the total sales amount by region for the year 2023"
// //       SQL: "SELECT Region, SUM(Sale_Amount) FROM sales_data WHERE Year = 2023 GROUP BY Region;"

// //       Query: "${query}"
// //       SQL:
// //     `;
// //     const prompt=`just provide the query as result
// //     Query: ${query}`

// //     try {
// //       const modelResponse = await callHuggingFaceModel(prompt);
// //       const generatedText = modelResponse[0].generated_text;
// //     //   const sqlMatch = generatedText.match(/SELECT.*;/);

// //     //   if (sqlMatch) {
// //     //     const sqlQuery = sqlMatch[0].trim();

// //     //     // Initialize sql.js and create a database
// //     //     const SQL = await initSqlJs();
// //     //     const db = new SQL.Database();

// //     //     // Convert the DataFrame to SQL.js compatible table
// //     //     const columns = Object.keys(dataFrame[0]);
// //     //     const values = dataFrame.map(row => columns.map(col => row[col]));
// //     //     const createTableQuery = `
// //     //       CREATE TABLE sales_data (${columns.join(', ')});
// //     //       INSERT INTO sales_data (${columns.join(', ')})
// //     //       VALUES ${values.map(row => `(${row.map(value => `'${value}'`).join(', ')})`).join(', ')};
// //     //     `;

// //     //     // Run the create table query
// //     //     db.run(createTableQuery);

// //     //     // Execute the generated SQL query on the DataFrame
// //     //     const results = db.exec(sqlQuery);

// //     //     // Format the results
// //     //     if (results.length > 0) {
// //     //       return results[0].values;
// //     //     } else {
// //     //       return "No results found.";
// //     //     }
// //     //   } else {
// //     //     return "Could not convert the query to SQL.";
// //     //   }
// //     } catch (error) {
// //       console.error(error);
// //       return "An error occurred while processing the query.";
// //     }
// //   }
// // });

// // Dashboard Tool for generating URLs
// // const dashboardTool = new DynamicTool({
// //   name: "dashboardTool",
// //   description: "Identifies the appropriate dashboard and constructs a URL with filters based on the user query.",
// //   func: async (query) => {
// //     // const prompt = `
// //     //   Given the user query: "${query}"
// //     //   Determine the appropriate dashboard and generate a URL with filters if applicable.

// //     //   Dashboards:
// //     //   1. Sales Dashboard, Columns = Product_ID, Product_Name, Region, Month, Year, Quarter, Sale_Amount, Sale_Quantity
// //     //   2. Agent Commissions Dashboard, Columns = Agent_ID, Sales_Closed, Total_Commission, Average_Commission_per_Sale, Region, Commission_Date
// //     //   3. Subscription Dashboard, Columns = Product_Name, Subscriber_ID, State, Customer_Satisfaction_Score, Payment_Method, Aging, Churn_new

// //     //   Your task is to identify the dashboard and provide the necessary filters based on the user query.
// //     //   Respond only in the following format:
// //     //   { "dashboard": "dashboard_name", "filters": { "key": "value" } }
// //     // `;
// //     const prompt = `
// //       Given the user query: "${query}"
// //       Determine the appropriate dashboard and generate a URL with filters if applicable.

// //       Dashboards:
// //       1. Sales Dashboard, Columns = Product_ID, Product_Name, Region, Month, Year, Quarter, Sale_Amount, Sale_Quantity
// //       2. Agent Commissions Dashboard, Columns = Agent_ID, Sales_Closed, Total_Commission, Average_Commission_per_Sale, Region, Commission_Date
// //       3. Subscription Dashboard, Columns = Product_Name, Subscriber_ID, State, Customer_Satisfaction_Score, Payment_Method, Aging, Churn_new

// //       Your task is to identify the dashboard and provide the necessary filters based on the user query.
// //       Respond only in the following format:
// //       { "dashboard": "dashboard_name", "filters": { "key": "value" } }

// //       Example:
// //       Query: "display the Sales dashboard of region East"
// //       Response: 
// //       {
// //         "dashboard": "sales_dashboard",
// //         "filters": {
// //           "Region": "East"
// //         }
// //       }

// //       Do not include any additional information or context in the response.
// //     `;

// //     try {
// //       const modelResponse = await callHuggingFaceModel(prompt);
// //       console.log(modelResponse)
// //       const generatedText = modelResponse[0].generated_text;

// //       const jsonResponseMatch = generatedText.match(/{\s*"dashboard":\s*"[^"]*"(?:,\s*"filters":\s*{[^}]*})?\s*}/g);
// //       if (jsonResponseMatch && jsonResponseMatch.length > 0) {
// //         const jsonResponse = jsonResponseMatch[jsonResponseMatch.length - 1];
// //         const { dashboard, filters } = JSON.parse(jsonResponse);

// //         if (dashboard) {
// //           const queryParams = new URLSearchParams(filters || {}).toString();
// //           return queryParams ? `http://localhost:3000/${dashboard}?${queryParams}` : `http://localhost:3000/${dashboard}`;
// //         } else {
// //           return "No matching dashboard found.";
// //         }
// //       } else {
// //         return "No matching JSON response found.";
// //       }
// //     } catch (error) {
// //       return "An error occurred while processing the query.";
// //     }
// //   }
// // });

// // Define your list of tools
// const tools = { "sqlTool": sqlTool, "dashboardTool": dashboardTool };

// // System prompt to select the tool
// async function selectTool(query) {
//   const systemPrompt = `
//   You are an intelligent assistant that helps users by selecting the most appropriate tool from a given list based on their query. Your task is to understand the user's query, select the most suitable tool, and pass the query as an argument to the selected tool without making any changes to the query. The tools available are:

//   1. "sqlTool" - Converts natural language queries into SQL statements and executes them against an internal data frame.
//   2. "dashboardTool" - Identifies the appropriate dashboard and generates a URL with filters based on the user query.

//   Given the user's query, follow these steps:

//   1. Analyze the user's query to understand the context and the specific task they want to perform.
//   2. Choose the tool from the list that is best suited for fulfilling the user's query.
//   3. Pass the user's query exactly as it is to the selected tool.

//   Example:
//   - Query: "Get the total sales amount by region for the year 2023"
//     Selected Tool: sqlTool
//   - Query: "Show the sales dashboard for the East region"
//     Selected Tool: dashboardTool

//   Output the result in the following JSON format:
//   {
//     "tool": "selected_tool_name",
//     "query": "user_query"
//   }

//   Now, perform the task for the following user query:
//   "${query}"
// `;

//   try {
//     const modelResponse = await callHuggingFaceModel(systemPrompt);
//     console.log(modelResponse)
//     function extractLastTool(output) {
//         // Regular expression to match all tool names in the JSON format
//         const toolMatches = output.generated_text.match(/"tool":\s*"([^"]+)"/g);
//         if (toolMatches && toolMatches.length > 0) {
//           // Get the last tool name
//           const lastToolMatch = toolMatches[toolMatches.length - 1];
//           const lastToolName = lastToolMatch.match(/"tool":\s*"([^"]+)"/)[1];
//           return lastToolName;
//         } else {
//           return null;
//         }
//       }
      
//       // Parse the model output to extract the last tool
//       const lastTool = extractLastTool(modelResponse[0]);
      
//       if (lastTool) {
//         console.log("Last Tool:", lastTool);
//       } else {
//         console.log("No tool could be extracted.");
//       }
//       return lastTool
//     // const generatedText = modelResponse[0].generated_text;
//     // const jsonResponseMatch = generatedText.match(/{\s*"tool":\s*"[^"]*"\s*,\s*"query":\s*"[^"]*"\s*}/);

//     // if (jsonResponseMatch) {
//     //   const jsonResponse = JSON.parse(jsonResponseMatch[0]);
//     //   return jsonResponse;
//     // } else {
//     //   return null;
//     // }
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// }

// // Create the runnable agent
// async function runFunction(query) {

// //   const userQuery = "show agent dashboard of agent id 121";
// console.log(query)
// const userQuery=query
// // const userQuery="give me max sale amount"

//   // Select the tool based on the query
//   const selection = await selectTool(userQuery);
//   console.log(selection)
//   console.log(tools[selection])

//   if (selection && tools[selection]) {
//     console.log(`Selected Tool: ${selection}`);
//     console.log(`Executing Query: ${userQuery}`);

//     const result = await tools[selection].func(userQuery);
//     console.log(result);
//     return result
//   } else {
//     console.log("No appropriate tool was selected or there was an error in selection.");
//   }
// }

// // const input1="give me max count of sales"
// //  const res=runFunction(input1)
// // console.log(res)
// //Call the async function
// module.exports = runFunction;

const axios = require("axios");
// import axios from 'axios';
// Importing CommonJS exports in an ES Module
// import { sqlTool, dashboardTool } from './chatbottools';

const { sqlTool, dashboardTool } = require('./chatbottools2');

// Hugging Face API configuration
const huggingFaceApiToken = "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";
const modelEndpoint = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';

// Function to call Hugging Face model
async function callHuggingFaceModel(prompt) {
  try {
    console.log(axios)
    console.log(axios.post)
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

// System prompt to select the tool
async function selectTool(query) {
  const systemPrompt = `
  You are an intelligent assistant that helps users by selecting the most appropriate tool from a given list based on their query. Your task is to understand the user's query, select the most suitable tool, and pass the query as an argument to the selected tool without making any changes to the query. The tools available are:

  1. "sqlTool" - Converts natural language queries into SQL statements and executes them against an internal data frame.
  2. "dashboardTool" - Identifies the appropriate dashboard and generates a URL with filters based on the user query.

  Given the user's query, follow these steps:

  1. Analyze the user's query to understand the context and the specific task they want to perform.
  2. Choose the tool from the list that is best suited for fulfilling the user's query.
  3. Pass the user's query exactly as it is to the selected tool.

  Example:
  - Query: "Get the total sales amount by region for the year 2023"
    Selected Tool: sqlTool
  - Query: "Show the sales dashboard for the East region"
    Selected Tool: dashboardTool

  Output the result in the following JSON format:
  {
    "tool": "selected_tool_name",
    "query": "user_query"
  }

  Now, perform the task for the following user query:
  "${query}"
`;

  try {
    const modelResponse = await callHuggingFaceModel(systemPrompt);
    console.log(modelResponse);
    
    function extractLastTool(output) {
        // Regular expression to match all tool names in the JSON format
        const toolMatches = output.generated_text.match(/"tool":\s*"([^"]+)"/g);
        if (toolMatches && toolMatches.length > 0) {
          // Get the last tool name
          const lastToolMatch = toolMatches[toolMatches.length - 1];
          const lastToolName = lastToolMatch.match(/"tool":\s*"([^"]+)"/)[1];

          return lastToolName;
        } else {
          return null;
        }
      }
      
      // Parse the model output to extract the last tool
      const lastTool = extractLastTool(modelResponse[0]);
      
      if (lastTool) {
        console.log("Last Tool:", lastTool);
      } else {
        console.log("No tool could be extracted.");
      }
      return lastTool;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Create the runnable agent
async function runFunction(query) {
  console.log(query);
  const userQuery = query;

  // Determine which tool to use
  const selectedTool = await selectTool(userQuery);
  console.log(selectedTool)

  if (!selectedTool) {
    return "Error: No valid tool selected.";
  }

  // Execute the selected tool
  let result;
  switch (selectedTool) {
    case 'sqlTool':
      console.log(sqlTool)
      result = await sqlTool.func(userQuery);
      break;
    case 'dashboardTool':
      console.log(dashboardTool)
      result = await dashboardTool.func(userQuery);
      break;
    default:
      result = "Error: No such tool available.";
  }

  return result;
}
// give me sales dashboard of region east and product 123

const res=runFunction("give the sales of product 123")
console.log(res)

// module.exports = { runFunction };
