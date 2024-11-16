const axios = require('axios');
const { readCSV } = require('pandas-js');
const fs = require('fs');
const Papa = require('papaparse');

// Read the CSV file
const csvData = fs.readFileSync('data/sales_data.csv', 'utf8');

// Parse the CSV data
const parsedData = Papa.parse(csvData, {
  header: true,
  dynamicTyping: true
});

// Access the DataFrame (parsed data)
const df = parsedData.data;

// Access columns
const columns = parsedData.meta.fields;
console.log(columns);

// Access shape
const shape = [df.length, columns.length];
console.log(shape);

const exampleOutput = `
query="plot sales vs month graph"
{
"graph_type"="line graph",
"x-axis"="month"
"y-axis"="sales"
}
`;

const systemPrompt = `
You are a data analyst assistant. Your task is to decide which type of graph should be used to plot data based on the given column names from a CSV file and to choose the appropriate x and y axis. Consider the following steps:

1. Understand the Data:
• The CSV file contains the following columns: ${columns}
2. Analyze the User Request:
• If the user specifies columns to plot (e.g., sales vs month), use those columns.
• If the user does not specify columns, analyze the data to suggest potential graph types and suitable column combinations.
3. Determine the Suitable Graph Type:
• Line Graph: Suitable for time series data or continuous numerical data over a period of time.
• Bar Graph: Suitable for categorical data to show comparisons among discrete categories.
• Scatter Plot: Suitable for showing relationships between two numerical variables.
• Histogram: Suitable for showing the distribution of a numerical variable.
• Pie Chart: Suitable for showing the composition of categorical data.
4. Choose the x and y Axis:
• For time series data (e.g., month), use it on the x-axis.
• For numerical data (e.g., sales, revenue), use it on the y-axis.
• For scatter plots, choose two numerical columns.
Based on the columns ${columns}, suggest the most appropriate type of graph to plot and return the output in the json format like ${exampleOutput}.
If the graph cannot be plotted, then just return "graph cannot be plotted".
else give me only graph_type,x_axis and y_axis values.
`;

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
// const userQuery = "How does the revenue vary across different months?";
const userQuery="No of sales happens in various regions"

// const userQuery="Give bubble chart for sales data"
const openAiApiKey = "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";
const huggingFaceApiToken = "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";

const llm1 = axios.create({
  baseURL: 'https://api.openai.com/v1/chat/completions',
  headers: { 'Authorization': `Bearer ${openAiApiKey}` }
});

const llm2 = axios.create({
  baseURL: 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
  headers: { 'Authorization': `Bearer ${huggingFaceApiToken}` }
});

const getOpenAiResponse = async (query) => {
  const response = await llm1.post('', {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: query }
    ]
  });

  return response.data.choices[0].message.content;
};

const getHuggingFaceResponse = async (query) => {
  const response = await llm2.post('', {
    inputs: `${systemPrompt}\n${query}`
  });

  return response.data;
};

const processResponse = (output) => {
  const startIndex = output.indexOf('{');
  const dictString = output.substring(startIndex);
  const formattedString = dictString.replace(/=/g, ':');

  try {
    const dicts = JSON.parse(formattedString);
    console.log(dicts);
    return dicts;
  } catch (error) {
    console.error('JSONDecodeError:', error);
  }
};

const main = async () => {
  try {
    const openAiOutput = await getOpenAiResponse(userQuery);
    console.log("OpenAI Output:");
    console.log(openAiOutput);
    processResponse(openAiOutput);

    const huggingFaceOutput = await getHuggingFaceResponse(userQuery);
    console.log("Hugging Face Output:");
    console.log(huggingFaceOutput);
    // processResponse(huggingFaceOutput);
  } catch (error) {
    console.error(error);
  }
};

main();
