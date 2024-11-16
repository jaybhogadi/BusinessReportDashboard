// const axios = require("axios");
// const initSqlJs = require('sql.js');

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
// const dataFrame = [
//   { Product_ID: 1, Product_Name: 'Product A', Region: 'East', Month: 'January', Year: 2023, Sale_Amount: 1000, Sale_Quantity: 10 },
//   { Product_ID: 2, Product_Name: 'Product B', Region: 'West', Month: 'February', Year: 2023, Sale_Amount: 2000, Sale_Quantity: 20 },
//   { Product_ID: 3, Product_Name: 'Product C', Region: 'East', Month: 'March', Year: 2023, Sale_Amount: 3000, Sale_Quantity: 30 },
//   // Add more rows as needed
// ];

// // SQL Tool for executing SQL queries generated from NLP
// // const sqlTool = {
// //   name: "sqlTool",
// //   description: "Converts the user query into an SQL statement and executes it against the internal DataFrame.",
// //   func: async (query) => {
// //     const prompt = `
// //       Convert the following natural language query into an SQL query:
// //       Query: "${query}"

// //       Provide only the SQL query, nothing else.

// //       Example:
// //       Query: "Get the total sales amount by region for the year 2023"
// //       SQL: "SELECT Region, SUM(Sale_Amount) FROM sales_data WHERE Year = 2023 GROUP BY Region;"

// //       Query: "${query}"
// //       SQL:
// //     `;

// //     try {
// //       const modelResponse = await callHuggingFaceModel(prompt);
// //       const generatedText = modelResponse[0].generated_text;

// //       // You can extract the SQL query from the response and execute it as needed.
// //       // Assuming the generated SQL query is correctly formatted, you can implement further logic here.

// //       // Placeholder for the actual implementation:
// //       console.log("answer from sql query")
// //       console.log(generatedText);

// //       // Example response:
// //       return generatedText;
// //     } catch (error) {
// //       console.error(error);
// //       return "An error occurred while processing the query.";
// //     }
// //   }
// // };
// const sqlTool = {
//   name: "sqlTool",
//   description: "Converts the user query into an SQL statement and executes it against the data retrieved from localStorage.",
//   func: async (query) => {
//     const prompt = `
//       Convert the following natural language query into an SQL query:
//       Query: "${query}"

//       Provide only the SQL query, nothing else.

//       Example:
//       Query: "Get the total sales amount by region for the year 2023"
//       SQL: "SELECT Region, SUM(Sale_Amount) FROM sales_data WHERE Year = 2023 GROUP BY Region;"

//       Query: "${query}"
//       SQL:
//     `;

//     try {
//       const modelResponse = await callHuggingFaceModel(prompt);
//       const generatedText = modelResponse[0].generated_text.trim();

//       // Retrieve data from localStorage
//       const storedData = localStorage.getItem('salesdata');
//       if (!storedData) {
//         return "No data found in localStorage.";
//       }

//       // Parse the stored data
//       let dataFrame;
//       try {
//         dataFrame = JSON.parse(storedData);
//       } catch (e) {
//         return "Failed to parse data from localStorage.";
//       }

//       // Initialize SQL.js and create a database
//       const SQL = await initSqlJs();
//       const db = new SQL.Database();

//       // Convert the DataFrame to SQL.js compatible table
//       if (dataFrame.length > 0) {
//         const columns = Object.keys(dataFrame[0]);
//         const values = dataFrame.map(row => columns.map(col => row[col]));
//         const createTableQuery = `
//           CREATE TABLE sales_data (${columns.map(col => `${col} TEXT`).join(', ')});
//           INSERT INTO sales_data (${columns.join(', ')})
//           VALUES ${values.map(row => `(${row.map(value => `'${value}'`).join(', ')})`).join(', ')};
//         `;

//         // Run the create table query
//         db.run(createTableQuery);

//         // Execute the generated SQL query on the DataFrame
//         try {
//           const results = db.exec(generatedText);

//           // Format the results
//           if (results.length > 0) {
//             return results[0].values;
//           } else {
//             return "No results found.";
//           }
//         } catch (error) {
//           return `SQL query execution error: ${error.message}`;
//         }
//       } else {
//         return "DataFrame is empty.";
//       }
//     } catch (error) {
//       console.error(error);
//       return "An error occurred while processing the query.";
//     }
//   }
// };


// // Dashboard Tool for generating URLs
// const dashboardTool = {
//   name: "dashboardTool",
//   description: "Identifies the appropriate dashboard and constructs a URL with filters based on the user query.",
//   func: async (query) => {
//     const prompt = `
//       Given the user query: "${query}"
//       Determine the appropriate dashboard and generate a URL with filters if applicable.

//       Dashboards:
//       1. Sales Dashboard, Columns = Product_ID, Product_Name, Region, Month, Year, Quarter, Sale_Amount, Sale_Quantity
//       2. Agent Commissions Dashboard, Columns = Agent_ID, Sales_Closed, Total_Commission, Average_Commission_per_Sale, Region, Commission_Date
//       3. Subscription Dashboard, Columns = Product_Name, Subscriber_ID, State, Customer_Satisfaction_Score, Payment_Method, Aging, Churn_new

//       Your task is to identify the dashboard and provide the necessary filters based on the user query.
//       Respond only in the following format:
//       { "dashboard": "dashboard_name", "filters": { "key": "value" } }

//       Example:
//       Query: "display the Sales dashboard of region East"
//       Response: 
//       {
//         "dashboard": "sales_dashboard",
//         "filters": {
//           "Region": "East"
//         }
//       }

//       Do not include any additional information or context in the response.
//     `;

//     try {
//       const modelResponse = await callHuggingFaceModel(prompt);
//       console.log(modelResponse);
//       const generatedText = modelResponse[0].generated_text;

//       const jsonResponseMatch = generatedText.match(/{\s*"dashboard":\s*"[^"]*"(?:,\s*"filters":\s*{[^}]*})?\s*}/g);
//       if (jsonResponseMatch && jsonResponseMatch.length > 0) {
//         const jsonResponse = jsonResponseMatch[jsonResponseMatch.length - 1];
//         const { dashboard, filters } = JSON.parse(jsonResponse);

//         if (dashboard) {
//           const queryParams = new URLSearchParams(filters || {}).toString();
//           return queryParams ? `http://localhost:3000/${dashboard}?${queryParams}` : `http://localhost:3000/${dashboard}`;
//         } else {
//           return "No matching dashboard found.";
//         }
//       } else {
//         return "No matching JSON response found.";
//       }
//     } catch (error) {
//       return "An error occurred while processing the query.";
//     }
//   }
// };

// module.exports = { sqlTool, dashboardTool };


// const axios = require("axios");
import axios from "axios";
import alasql from 'alasql';
import { dashboardPrompt, generateSqlPrompt } from './DashboardPrompt';

import config from './config';
import initSqlJs from "sql.js";


// const { sqlTool, dashboardTool } = require('./chatbottools');

// Hugging Face API configuration
const { huggingFaceApiToken1 } = config;
const huggingFaceApiToken = huggingFaceApiToken1;


// const initSqlJs = require('sql.js');


// Hugging Face API configuration
// 
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

// SQL Tool for executing SQL queries generated from NLP
// import initSqlJs from 'sql.js'; // Import SQL.js
// import { callHuggingFaceModel } from './huggingFaceAPI'; // Import your function that calls the model

// const sqlMatch = generatedText.match(/SQL:\s*([\s\S]*?);/g);
// console.log(sqlMatch)
// var extractedSQL=""
// if(sqlMatch) {
// const extractedSQL1 = sqlMatch[1].trim();
// const cleanedSQL = extractedSQL1.replace(/^SQL:\s*"/, "").replace(/"$/, "");
// console.log(cleanedSQL);
// extractedSQL=cleanedSQL;

// } else {
// console.log("Failed to extract the SQL query.");
// }

async function convertSQLResultsToNLP(question, sqlResults) {
  const resultsText = JSON.stringify(sqlResults); // Convert results to text
  const prompt = `Given the question: "${question}" and the SQL query results: ${resultsText}, convert the results into a natural language response. Response:`;
  const modelResponse = await callHuggingFaceModel(prompt);
  // console.log(modelResponse[0].generated_text)
  const answer=modelResponse[0].generated_text;
  const regex = /Response:\s*(.*)/;
const match = answer.match(regex);

if (match) {
  const responseText = match[1].replace(/^"|"$/g, '').replace(/^"$/g, '').trim();
  console.log(responseText);
  const quoteIndex = responseText.indexOf('"');
    
    // If a quote is found, return the substring before it
    if (quoteIndex !== -1) {
        return responseText.substring(0, quoteIndex).trim();
    }
  return responseText;
   // Outputs: "The South region has the maximum sales."
} else {
  console.log("No response found.");
}
  // const nlpResponse = modelResponse.generated_text();
  // return nlpResponse;
  return "Hiii"
}

export const sqlTool = {
  name: "sqlTool",
  description: "Converts the user query into an SQL statement and executes it against the data retrieved from localStorage.",
  func: async (query) => {
    // Prompt to convert the user query into an SQL query
    // const prompt1 = `
    //   Convert the following natural language query into an SQL query:
    //   Query: "${query}"

    //   Ensure that the SQL query includes one or more of the following columns:
    //   "Product_ID", "Product_Name", "Region", "Month", "Year", "Quarter", "Sale_Amount", "Sale_Quantity"

    //   Provide only the SQL query, nothing else.

    //   Example:
    //   Query: "Get the total sales amount by region for the year 2023"
    //   SQL: "SELECT Region, SUM(Sale_Amount) FROM sales_dashboard WHERE Year = 2023 GROUP BY Region;"

    //   Query: "${query}"
    //   SQL:
    // `;
//     const prompt=`
//     Convert the following natural language query into an SQL query:
//   Query: "${query}"

//   Ensure that the SQL query includes one or more of the following columns:
//   "Product_ID", "Product_Name", "Region", "Month", "Year", "Quarter", "Sale_Amount", "Sale_Quantity"

//   Provide only the SQL query, nothing else.

//   Example:
//   Query: "Get the total sales amount by region for the year 2023"
//   SQL: "SELECT Region, SUM(Sale_Amount) FROM sales_dashboard WHERE Year = 2023 GROUP BY Region;"

//   Query: "${query}"
//   SQL:
// `
    const dbname=localStorage.getItem('dashboard').replace(/^"|"$/g, '');
    console.log(dbname)
    const prompt=generateSqlPrompt(query,dbname) 
    console.log(prompt)   
    // console.log(prompt1)

    try {
      // Call Hugging Face to convert the query into SQL
      const modelResponse = await callHuggingFaceModel(prompt);
      const generatedText = modelResponse[0].generated_text.trim();
      console.log("Generated Text:", generatedText);

      // Extract the SQL query using a regular expression
      const sqlMatch = generatedText.match(/SQL:\s*([\s\S]*?);/g);
console.log(sqlMatch)
var extractedSQL=""
if(sqlMatch) {
  console.log("SQLLLLL")
        const extractedSQL1 = sqlMatch[1].trim();
        const cleanedSQL = extractedSQL1.replace(/^SQL:\s/, "").replace(/"$/, "").replace(/\s+/g, ' ').trim();  
        // Replace multiple spaces with a single space
        console.log(cleanedSQL);
        extractedSQL=cleanedSQL.replace(/"/g, '').replace(/^```sql\s*/, '');
        // const cleanedQuery = query.replace(/^```sql\s*/, '');


        // Retrieve data from localStorage
        const storedData = localStorage.getItem(dbname);
        // Initialize `alasql` and create a database in memory
        if (storedData) {
          // Parse the JSON data
          let dataFrame;
          try {
            dataFrame = JSON.parse(storedData);
            console.log("retrieved stored data")
            // console.log(storedData)
          } catch (e) {
            return "Failed to parse data from localStorage.";
          }

          if (dataFrame.length > 1) {
          //   // Create a schema based on the data
          //   const columns = Object.keys(dataFrame[0]);
          //   const columnDefinitions = columns.map(col => `${col} TEXT`).join(', ');
          const sampleRow = dataFrame[1];
          const columns = Object.keys(sampleRow);

        // Function to infer SQL data type
        const inferDataType = (value) => {
            if (value === null || value === undefined) return 'TEXT'; // Default to TEXT if null or undefined
            if (typeof value === 'number') return Number.isInteger(value) ? 'INTEGER' : 'FLOAT';
            if (typeof value === 'string') return 'TEXT';
            return 'TEXT'; // Default to TEXT if type cannot be inferred
        };

        // Create column definitions based on inferred data types
        const columnDefinitions = columns
            .map(col => {
                const dataType = inferDataType(sampleRow[col]);
                return `${col} ${dataType}`;
            })
            .join(', ');

            // Create the table if it does not exist
            console.log("creating col")
            console.log(columnDefinitions)
            alasql(`CREATE TABLE IF NOT EXISTS ${dbname} (${columnDefinitions})`);

            console.log("Table created")

            // Insert data into the table if it was just created
            // const tableExists = alasql('SELECT * FROM sqlite_master WHERE type="table" AND name="sales_data"').length > 0;
            // if (tableExists) {
            //   // If the table exists, do not insert data
            //   console.log("Table already exists. No data inserted.");
            // } else {
              // Insert data if table was just created
              // dataFrame.forEach(row => {
              //   const values = columns.map(col => row[col]);
              //   alasql(`INSERT INTO ${dbname} VALUES (${values.map(v => `'${v}'`).join(', ')})`);
              //   console.log("Inserted the values")

              // });

              const formatValue = (value, dataType) => {
                if (value === null || value === undefined) return 'NULL';
                if (dataType === 'INTEGER' || dataType === 'FLOAT') return value; // No quotes for INTEGER and FLOAT
                if (dataType === 'TEXT') return `'${value.replace(/'/g, "''")}'`; // Escape single quotes for TEXT
                return `'${value}'`; // Default case
            };
        
            // Insert data into the table
            dataFrame.forEach(row => {
                const values = columns.map(col => {
                    const dataType = inferDataType(row[col]);
                    return formatValue(row[col], dataType);
                });
                const query = `INSERT INTO ${dbname} (${columns.join(', ')}) VALUES (${values.join(', ')})`;
                alasql(query);
                // console.log("Inserted the values:", values);
            });

              // console.log(alasql("SELECT * FROM subscription_dashboard LIMIT 10;") )
              // console.log(alasql("SELECT max(Customer_Satisfaction_Score) FROM subscription_dashboard;"))
              // console.log(alasql("SELECT Customer_Satisfaction_Score FROM subscription_dashboard LIMIT 10;"))
              // // const checkTypes = alasql("SELECT typeof(Customer_Satisfaction_Score) FROM subscription_dashboard LIMIT 10;");
              // // console.log(checkTypes);
              // const sampleData = alasql("SELECT Customer_Satisfaction_Score FROM subscription_dashboard LIMIT 10;");
              // console.log(sampleData);

            // }
          }
        }

        // Execute the extracted SQL query
        try {
          localStorage.setItem('tool','sqlTool')
          console.log("extracted query is",extractedSQL)
          const results = alasql(extractedSQL);
          console.log(results)

          // Format the results
          if (results.length > 0) {
            const result=await convertSQLResultsToNLP(query,results)
            return result;
          } else {
            return "No results found.";
          }
        } catch (error) {
          return `SQL query execution error: ${error.message}`;
        }
      } else {
        return "Failed to extract the SQL query.";
      }
    } catch (error) {
      console.error(error);
      return "An error occurred while processing the query.";
    }
  }
};


// Dashboard Tool for generating URLs
export const dashboardTool = {
  name: "dashboardTool",
  description: "Identifies the appropriate dashboard and constructs a URL with filters based on the user query.",
  func: async (query) => {
    // const dbname=localStorage.getItem('dashboard')
    // console.log(dbname)
    // const prompt1 = `
    //   Given the user query: "${query}"
    //   Determine the appropriate dashboard and generate a URL with filters if applicable.

    //   Dashboards:
    //   1. Sales Dashboard, Columns = Product_ID, Product_Name, Region, Month, Year, Quarter, Sale_Amount, Sale_Quantity
    //   2. Agent Commissions Dashboard, Columns = Agent_ID, Sales_Closed, Total_Commission, Average_Commission_per_Sale, Region, Commission_Date
    //   3. Subscription Dashboard, Columns = Product_Name, Subscriber_ID, State, Customer_Satisfaction_Score, Payment_Method, Aging, Churn_new

    //   Your task is to identify the dashboard and provide the necessary filters based on the user query.
    //   Respond only in the following format:
    //   { "dashboard": "dashboard_name", "filters": { "key": "value" } }

    //   Example:
    //   Query: "display the Sales dashboard of region East"
    //   Response: 
    //   {
    //     "dashboard": "sales_dashboard",
    //     "filters": {
    //       "Region": "East"
    //     }
    //   }

    //   Do not include any additional information or context in the response.
    // `;
    const promptimported = dashboardPrompt(query);
    // const getCharCodes = (str) => [...str].map(char => char.charCodeAt(0));
    const prompt=promptimported;
// console.log(prompt)
// console.log(prompt1)
// console.log(getCharCodes(prompt));
// console.log(getCharCodes(prompt1));
// console.log(prompt===prompt1)

    try {
      const modelResponse = await callHuggingFaceModel(prompt);
      console.log("dashboard tool response")
      console.log(modelResponse);
      const generatedText = modelResponse[0].generated_text;

      const jsonResponseMatch = generatedText.match(/{\s*"dashboard":\s*"[^"]*"(?:,\s*"filters":\s*{[^}]*})?\s*}/g);
      if (jsonResponseMatch && jsonResponseMatch.length > 0) {
        const jsonResponse = jsonResponseMatch[jsonResponseMatch.length - 1];
        const { dashboard, filters } = JSON.parse(jsonResponse);

        if (dashboard) {
          localStorage.setItem('tool','dashboardTool')
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
};

// module.exports = { sqlTool, dashboardTool };
