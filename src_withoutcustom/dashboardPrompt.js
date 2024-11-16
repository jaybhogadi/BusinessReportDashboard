// dashboardPrompt.js

const dashboardPrompt = (query) => `
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

export default dashboardPrompt;
