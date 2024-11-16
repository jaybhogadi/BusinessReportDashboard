const axios = require('axios');

// Replace with your OpenAI API key
const openAiApiKey = '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';

// Define the dashboard URLs and their columns
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

const llm = axios.create({
  baseURL: 'https://api.openai.com/v1/chat/completions',
  headers: { 'Authorization': `Bearer ${openAiApiKey}` }
});

const systemPrompt = `
You are an intelligent assistant. You have access to the following dashboards and their columns:
1. Dashboard1: Column1, Column2, Column3
2. Dashboard2: ColumnA, ColumnB, ColumnC
3. Dashboard3: ColumnX, ColumnY, ColumnZ

When a user asks for a specific dashboard or mentions a column related to a dashboard, respond with the appropriate dashboard URL. If the query doesn't match any dashboard, respond with "No matching dashboard found".
`;

const getResponse = async (query) => {
  const response = await llm.post('', {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: query }
    ]
  });

  return response.data.choices[0].message.content.trim();
};

const processQuery = async (query) => {
  try {
    const response = await getResponse(query);
    console.log(response);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Example user queries
const userQueries = [
  'Show me the dashboard with Column1',
  'I need the dashboard for ColumnB',
  'Give me the URL for Dashboard3'
];

userQueries.forEach(query => processQuery(query));
