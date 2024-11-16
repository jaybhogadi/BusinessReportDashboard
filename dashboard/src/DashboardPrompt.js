// export const dashboardPrompt = (query) => `
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
// Import the JSON data (assuming you're using Node.js or bundler like Webpack)
import dashboards from './database.json';

export const dashboardPrompt = (query) => {
  // Function to format the dashboard list based on the JSON data
  const formatDashboards = (dashboardData) => {
    return Object.entries(dashboardData)
      .map(([dashboardName, columns], index) => {
        // Generate the human-readable dashboard name
        // const formattedName = dashboardName.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

        // Create the columns string
        const columnsString = columns.join(', ');

        return `${index + 1}. ${dashboardName}, Columns = ${columnsString}`;
      })
      
      .join('\n')
      .replace(/^/gm, '      ');;
  };

  // Generate the dynamic dashboard list from the JSON
  const dynamicDashboardList = formatDashboards(dashboards);

  // Construct the full prompt
  return `
      Given the user query: "${query}"
      Determine the appropriate dashboard and generate a URL with filters if applicable.

      Dashboards:
      ${dynamicDashboardList}

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
};




export const generateSqlPrompt = (query, dashboardName) => {
  // Get columns for the given dashboard
  // console.log('Dashboard Name:', dashboardName);
  // console.log('Available Dashboards:', Object.keys(dashboards));
  // const o=Object.keys(dashboards)[0];
  // console.log(typeof(dashboardName))
  // console.log(typeof(o))
      // const getCharCodes = (str) => [...str].map(char => char.charCodeAt(0));
      // const prompt=promptimported;
      // console.log(prompt)
      // console.log(prompt1)
      // console.log(getCharCodes(dashboardName));
      // console.log(getCharCodes(o));
      // console.log(prompt===prompt1)
  // console.log(o===dashboardName)
  const dashboard=dashboardName.replace(/^"|"$/g, '');
  // Get columns for the given dashboard
  const columns = dashboards[dashboard] || [];
  
  // Debugging: Check if columns are retrieved
  // console.log('Columns:', columns);
  // const columns1 = dashboards[dashboardName];
  // console.log(columns1)

  // Ensure columns are included in the SQL query
  const columnsString = columns.join(', ');

  // Check the result
  console.log('Columns String:', columnsString);
  // Construct the prompt
  return `
      Convert the following natural language query into an SQL query:
      Query: "${query}"

      Ensure that the SQL query includes one or more of the following columns:
      ${columnsString.split(', ').map(column => `"${column}"`).join(', ')}

      Use "${dashboard}" as the table name.

      Provide only the SQL query, nothing else.

      Example:
      Query: "Get the total sales amount by region for the year 2023"
      SQL: "SELECT Region, SUM(Sale_Amount) FROM ${dashboard} WHERE Year = 2023 GROUP BY Region;"

      Query: "${query}"
      SQL:
  `;
};