// CSV data
const { DynamicTool } = require("@langchain/core/tools");
const axios = require("axios");
const initSqlJs = require('sql.js');
const huggingFaceApiToken = "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";
const modelEndpoint = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';

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
  
const csvData = `Product_ID,Product_Name,Region,Month,Year,Quarter,Sale_Amount,Sale_Quantity
P0001,Product_7,South,Sep,2022,Q2,4900,81
P0002,Product_4,North,Jun,2022,Q1,3400,84
`;

// Step 1: Convert CSV to JSON
const rows = csvData.trim().split('\n');
const headers = rows[0].split(',');
const jsonData = [];

for (let i = 1; i < rows.length; i++) {
    const row = rows[i].split(',');
    const rowObject = {};
    headers.forEach((header, index) => {
        rowObject[header] = row[index];
    });
    jsonData.push(rowObject);
}

// Output the JSON data
console.log("Converted JSON Data: ", JSON.stringify(jsonData, null, 2));

// Step 2: Define the `sqlTool` for executing SQL queries
const sqlTool = new DynamicTool({
  name: "sqlTool",
  description: "Converts the user query into an SQL statement and executes it against the internal DataFrame.",
  func: async (query) => {
    const prompt = `just provide the query as result
    Query: ${query}`;

    try {
      const modelResponse = await callHuggingFaceModel(prompt);
      const generatedText = modelResponse[0].generated_text;
      const sqlQuery = generatedText.trim();  // Directly use the generated SQL query

      // Step 3: Execute SQL query on jsonData
      const SQL = await initSqlJs();
      const db = new SQL.Database();

      // Create a table based on JSON data
      const columns = Object.keys(jsonData[0]);
      const createTableQuery = `CREATE TABLE sales_data (${columns.join(', ')});`;
      db.run(createTableQuery);

      // Insert JSON data into the table
      jsonData.forEach(row => {
        const values = columns.map(col => `'${row[col]}'`).join(', ');
        db.run(`INSERT INTO sales_data (${columns.join(', ')}) VALUES (${values});`);
      });
      console.log(sqlQuery)
      // Execute the generated SQL query
      const results = db.exec(sqlQuery);

      // Return the results
      if (results.length > 0) {
        return results[0].values;
      } else {
        return "No results found.";
      }
    } catch (error) {
      console.error(error);
      return "An error occurred while processing the query.";
    }
  }
});

// Example usage:
const userQuery = "Get the total sales amount by region for the year 2022";
sqlTool.func(userQuery).then(result => {
  console.log("Query Result: ", result);
});
