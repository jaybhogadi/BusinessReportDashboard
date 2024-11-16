function extractLastResponse(generatedText) {
    // Split the generated text at each 'Response:'

    const responses = generatedText.split(/(?<=\s)Response:\s*/);
    console.log(responses)
  
    // If there are no responses, return an empty result
    if (responses.length === 0) {
      return "No response found.";
    }
  
    // The last part of the split contains the last response
    const lastResponsePart = responses[responses.length - 1].trim();
    console.log(lastResponsePart)
  
    // Extract the JSON object from the last response part using regex
    const jsonResponseMatch = lastResponsePart.match(/{\s*"dashboard":\s*"[^"]*"(?:,\s*"filters":\s*{[^}]*})?\s*}/);
  
    // If a JSON response is found, return it
    if (jsonResponseMatch) {
      const jsonResponse = jsonResponseMatch[jsonResponseMatch.length - 1].trim();
      return jsonResponse;
    } else {
      return "No valid JSON response found.";
    }
  }
  
  const gt=`
        Given the user query: "give the sales dashboard of North with product Poo123 of 2022 in Q4 "
      Determine the appropriate dashboard and generate a URL with filters if applicable.

      Dashboards:
      1. Sales Dashboard: URL = http://localhost:5000/sales_dashboard, Columns = Product_ID, Product_Name, Region, Month, Year, Quarter, Sale_Amount, Sale_Quantity        
      2. Agent Commissions Dashboard: URL = http://localhost:5000/agent_commissions_dashboard, Columns = Agent_ID, Sales_Closed, Total_Commission, Average_Commission_per_Sale, Region, Commission_Date
      3. Subscriptions Dashboard: URL = http://localhost:5000/subscriptions_dashboard, Columns = Product_Name, Subscriber_ID, State, Customer_Satisfaction_Score, Payment_Method, Aging, Churn_new

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
    -----------------------------------------------
      Query: "give the sales dashboard of North with product Poo123 of 2022 in Q4"

      Response:
      {
        "dashboard": "sales_dashboard",
        "filters": {
          "Region": "North",
          "Product_ID": "Poo123",
          "Year": "2022",
          "Quarter": "Q4"
        }
    }   
          `
  // Example usage
  const generatedText = `
  Given the user query: "display the Sales dashboard"
  Determine the appropriate dashboard and generate a URL with filters if applicable.
  
  Dashboards:
  1. Sales Dashboard: URL = http://localhost:5000/sales_dashboard, Columns = Product_ID, Product_Name, Region, Month, Year, Quarter, Sale_Amount, Sale_Quantity        
  2. Agent Commissions Dashboard: URL = http://localhost:5000/agent_commissions_dashboard, Columns = Agent_ID, Sales_Closed, Total_Commission, Average_Commission_per_Sale, Region, Commission_Date
  3. Subscriptions Dashboard: URL = http://localhost:5000/subscriptions_dashboard, Columns = Product_Name, Subscriber_ID, State, Customer_Satisfaction_Score, Payment_Method, Aging, Churn_new
  
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
  ------------------------------------------------------------------------------
  Query: "display the Sales dashboard"
  Response:
  {
    "dashboard": "sales_dashboard",
    "filters": {}
  }
  `;
  
  console.log(extractLastResponse(gt));
  