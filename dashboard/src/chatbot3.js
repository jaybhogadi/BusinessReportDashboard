const { ChatOpenAI } = require("@langchain/openai");
const { DynamicTool } = require("@langchain/core/tools");
const { ChatPromptTemplate, MessagesPlaceholder } = require("@langchain/core/prompts");
const { convertToOpenAIFunction } = require("@langchain/core/utils/function_calling");
const { RunnableSequence } = require("@langchain/core/runnables");
const { AgentExecutor } = require("langchain/agents");
const { formatToOpenAIFunctionMessages } = require("langchain/agents/format_scratchpad");
const { OpenAIFunctionsAgentOutputParser } = require("langchain/agents/openai/output_parser");
const axios = require("axios");

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

// SQL Tool using Hugging Face
const sqlTool = new DynamicTool({
  name: "sqlTool",
  description: "Converts the user query into an SQL statement and executes it against a given JSON dataset.",
  func: async (query, jsonData) => {
    const prompt = `
      Convert the following natural language query into an SQL query:
      Query: "${query}"

      Provide only the SQL query, nothing else.

      Example:
      Query: "Get the total sales amount by region for the year 2023"
      SQL: "SELECT Region, SUM(Sale_Amount) FROM sales_data WHERE Year = 2023 GROUP BY Region;"

      Query: "${query}"
      SQL:
    `;

    try {
      const modelResponse = await callHuggingFaceModel(prompt);
      const generatedText = modelResponse[0].generated_text;

      const sqlMatch = generatedText.match(/SQL:\s*(.*)/);
      if (sqlMatch) {
        const sqlQuery = sqlMatch[1].trim();

        // Placeholder for actual SQL execution logic
        const results = "Results of SQL query"; // Replace with your SQL execution logic
        return results;
      } else {
        return "Could not convert the query to SQL.";
      }
    } catch (error) {
      return "An error occurred while processing the query.";
    }
  }
});

// Dashboard Tool using Hugging Face
const dashboardTool = new DynamicTool({
  name: "dashboardTool",
  description: "Identifies the appropriate dashboard and constructs a URL with filters based on the user query.",
  func: async (query) => {
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
    `;

    try {
      const modelResponse = await callHuggingFaceModel(prompt);
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

// Define your list of tools
const tools = [sqlTool, dashboardTool];
// os.environ["OPENAI_API_KEY"] = "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"

// Define the chat model
const model = new ChatOpenAI({
    openai_api_key:"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",
  model: "gpt-3.5-turbo",
  temperature: 0,
});

// Create the prompt template
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a very powerful assistant, but you don't know current events."],
  ["human", "{input}"],
  new MessagesPlaceholder("agent_scratchpad"),
]);

// Bind the model with functions
const modelWithFunctions = model.bind({
  functions: tools.map((tool) => convertToOpenAIFunction(tool)),
});

// Create the runnable agent
const runnableAgent = RunnableSequence.from([
  {
    input: (i) => i.input,
    agent_scratchpad: (i) => formatToOpenAIFunctionMessages(i.steps),
  },
  prompt,
  modelWithFunctions,
  new OpenAIFunctionsAgentOutputParser(),
]);

// Create the agent executor
const executor = AgentExecutor.fromAgentAndTools({
  agent: runnableAgent,
  tools,
});

// Example usage inside an async function
async function runExample() {
  const input = "display the Sales dashboard of region East";
  console.log(`Calling agent executor with query: ${input}`);

  const result = await executor.invoke({
    input,
  });

  console.log(result);
}

// Call the async function
runExample();
