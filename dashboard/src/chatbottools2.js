const { DynamicTool } = require("@langchain/core/tools");
// const {DynamicTool}=require("@langchain/core/dist/tools/index.js")
const axios = require("axios");
const initSqlJs = require('sql.js');

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
    return response.data;
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Sample data to be used as a DataFrame (Array of objects)
const dataFrame = [
  { Product_ID: 1, Product_Name: 'Product A', Region: 'East', Month: 'January', Year: 2023, Sale_Amount: 1000, Sale_Quantity: 10 },
  { Product_ID: 2, Product_Name: 'Product B', Region: 'West', Month: 'February', Year: 2023, Sale_Amount: 2000, Sale_Quantity: 20 },
  { Product_ID: 3, Product_Name: 'Product C', Region: 'East', Month: 'March', Year: 2023, Sale_Amount: 3000, Sale_Quantity: 30 },
  // Add more rows as needed
];

// SQL Tool for executing SQL queries generated from NLP
const sqlTool = new DynamicTool({
  name: "sqlTool",
  description: "Converts the user query into an SQL statement and executes it against the internal DataFrame.",
  func: async (query) => {
    const prompt1 = `
      Convert the following natural language query into an SQL query:
      Query: "${query}"

      Provide only the SQL query, nothing else.

      Example:
      Query: "Get the total sales amount by region for the year 2023"
      SQL: "SELECT Region, SUM(Sale_Amount) FROM sales_data WHERE Year = 2023 GROUP BY Region;"

      Query: "${query}"
      SQL:
    `;
    const prompt=`just provide the query as result
    Query: ${query}`

    try {
      const modelResponse = await callHuggingFaceModel(prompt);
      const generatedText = modelResponse[0].generated_text;
    //   const sqlMatch = generatedText.match(/SELECT.*;/);

    //   if (sqlMatch) {
    //     const sqlQuery = sqlMatch[0].trim();

    //     // Initialize sql.js and create a database
    //     const SQL = await initSqlJs();
    //     const db = new SQL.Database();

    //     // Convert the DataFrame to SQL.js compatible table
    //     const columns = Object.keys(dataFrame[0]);
    //     const values = dataFrame.map(row => columns.map(col => row[col]));
    //     const createTableQuery = `
    //       CREATE TABLE sales_data (${columns.join(', ')});
    //       INSERT INTO sales_data (${columns.join(', ')})
    //       VALUES ${values.map(row => `(${row.map(value => `'${value}'`).join(', ')})`).join(', ')};
    //     `;

    //     // Run the create table query
    //     db.run(createTableQuery);

    //     // Execute the generated SQL query on the DataFrame
    //     const results = db.exec(sqlQuery);

    //     // Format the results
    //     if (results.length > 0) {
    //       return results[0].values;
    //     } else {
    //       return "No results found.";
    //     }
    //   } else {
    //     return "Could not convert the query to SQL.";
    //   }
    } catch (error) {
      console.error(error);
      return "An error occurred while processing the query.";
    }
  }
});

// Dashboard Tool for generating URLs
const dashboardTool = new DynamicTool({
  name: "dashboardTool",
  description: "Identifies the appropriate dashboard and constructs a URL with filters based on the user query.",
  func: async (query) => {
    // const prompt = `
    //   Given the user query: "${query}"
    //   Determine the appropriate dashboard and generate a URL with filters if applicable.

    //   Dashboards:
    //   1. Sales Dashboard, Columns = Product_ID, Product_Name, Region, Month, Year, Quarter, Sale_Amount, Sale_Quantity
    //   2. Agent Commissions Dashboard, Columns = Agent_ID, Sales_Closed, Total_Commission, Average_Commission_per_Sale, Region, Commission_Date
    //   3. Subscription Dashboard, Columns = Product_Name, Subscriber_ID, State, Customer_Satisfaction_Score, Payment_Method, Aging, Churn_new

    //   Your task is to identify the dashboard and provide the necessary filters based on the user query.
    //   Respond only in the following format:
    //   { "dashboard": "dashboard_name", "filters": { "key": "value" } }
    // `;
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

    try {
      const modelResponse = await callHuggingFaceModel(prompt);
      console.log(modelResponse)
      const generatedText = modelResponse[0].generated_text;

      const jsonResponseMatch = generatedText.match(/{\s*"dashboard":\s*"[^"]*"(?:,\s*"filters":\s*{[^}]*})?\s*}/g);
      if (jsonResponseMatch && jsonResponseMatch.length > 0) {
        const jsonResponse = jsonResponseMatch[jsonResponseMatch.length - 1];
        const { dashboard, filters } = JSON.parse(jsonResponse);

        if (dashboard) {
          const queryParams = new URLSearchParams(filters || {}).toString();
          return queryParams ? `http://localhost:3000/${dashboard}?${queryParams}` : `http://localhost:3000/${dashboard}`;
        } else {
          return "No matching dashboard found.";
        }
      } else {
        return "No matching JSON response found.";
      }
    } catch (error) {
      return "An error occurred while processing the query.";
    }
  }
});
module.exports = { sqlTool, dashboardTool };