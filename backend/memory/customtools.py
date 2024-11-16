import requests
from langchain.agents import Tool  
from langchain_core.tools import tool
import webbrowser
import json
from langchain_huggingface import HuggingFaceEndpoint,ChatHuggingFace
from langchain_core.prompts import ChatPromptTemplate
import os
import ast
from .get_prompt import load_prompts
import pandas as pd
from langchain.prompts import PromptTemplate
from .parsing import *
from langchain_community.utilities import SQLDatabase
from sqlalchemy import create_engine
from langchain.chains import create_sql_query_chain
from langchain_community.tools.sql_database.tool import QuerySQLDataBaseTool

# backend/data/sales_data.csv
# df=pd.read_csv("backend/data/sales_data.csv")
def csv_to_sql(file_path):
    df=pd.read_csv(file_path)
    base_name=os.path.splitext(os.path.basename(file_path))[0]
    engine = create_engine("sqlite:///{base_name}")
    df.to_sql("sales_data", engine, index=False,if_exists='replace')
# Creating the SQLDatabase instance
    db = SQLDatabase(engine=engine)
    print(db.dialect)
    print(db.get_usable_table_names)
    return db


def fetchdata(api_url,params=None):
  try:
    response=requests.get(api_url,params=params)  # Send GET request to custom API
    response.raise_for_status()  # Raise exception for any HTTP error
    
    return response.json()  # Return JSON response from API
  except requests.exceptions.RequestException as e:
    print("error fetching data from api",e)  # Print error message if API call fails
    return None  # Return None if API call fails
api_url="http://127.0.0.1:5000"
api_url2="http://127.0.0.1:3000"


repo_id="mistralai/Mistral-7B-Instruct-v0.3"
os.environ["HUGGINGFACEHUB_API_TOKEN"]="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"
llm=HuggingFaceEndpoint(
  repo_id=repo_id,token=os.environ["HUGGINGFACEHUB_API_TOKEN"]
)
prompts=load_prompts("backend/memory/custom_tools_prompt.json")
def agent(prompt,query):
   chain=prompt|llm
   result=chain.invoke(query)
   json_start=result.find('{')
   json_string=result[json_start:]
   output=json.loads(json_string)
   print("output of tool:",output)
   print(type(output))
   return output
@tool 
def display_sales_dashboard_url(query):
    """Displays sales dashboard based on the given query."""
    print("entering into the display_sales_dashboard_url") 
    if query.lower()=="get sales dashboard" or query.lower()=="display sales dashboard" or query.lower()=="show sales dashboard" or query.lower()=="sales dashboard":
       url=f"{api_url2}/sales_dashboard"
       return "sales_dashboard",url
    system_prompt=prompts['sales_dashboard_prompt']['prompt_content']
    sales_dashboard_prompt=system_prompt.format(query=query)
    prompt = ChatPromptTemplate.from_messages(
        [("system", sales_dashboard_prompt), ("user", "{query}")]
    )
 
    output=agent(prompt,query)
    region=output['region']
    quarter=output['quarter']
    month=output['month']
    year=output['year']
    if region!="all":
       region=region.capitalize()
    if quarter!="all":
       quarter=quarter.capitalize()
    if month!="all":
       month=month.capitalize()
    if year!="all":
       year=year
    
    url=f"{api_url2}/sales_dashboard?month={month}&region={region}&quarter={quarter}&year={year}"
    print("url:",url)
    return "sales_dashboard",url

# @tool
# def display_barchart_sales_dashboard():
#    """display bar chart of sales dashboard"""
#    return "barchart of sales dashboard"

@tool 
def display_subscription_dashboard_url(query):
    """Displays subscription dashboard based on the given query."""
    print("entering into the display_subscription_dashboard_url")
    if query.lower()=="get subscription dashboard" or query.lower()=="display subscription dashboard" or query.lower()=="show subscription dashboard" or query.lower()=="subscription dashboard":
       url=f"{api_url2}/subscription_dashboard"
       return "subscription_dashboard",url
    system_prompt=prompts['subscription_dashboard_prompt']['prompt_content']
    subscription_dashboard_prompt=system_prompt.format(query=query)   
    prompt = ChatPromptTemplate.from_messages(
        [("system", subscription_dashboard_prompt), ("user", "{input}")]
    )

    
    output=agent(prompt,query)
    state=output['state'].capitalize()
    name=output['product_name']
    name=name.replace(' ','%')    

    url=f"{api_url2}/subscription_dashboard?state={state}&product={name}"
    print("url:",url)
    return "subscription_dashboard",url

# @tool
# def display_barchart_subscription_dashboard():
#    """display bar chart of subscription dashboard"""
#    return "barchart of subscription dashboard"



@tool 
def display_agent_dashboard_url(query):
    """Displays agent dashboard based on the given query."""
    print("entering into the display_agent_dashboard_url")
    if query.lower()=="get agent dashboard" or query.lower()=="display agent dashboard" or query.lower()=="show agent dashboard" or query.lower()=="agent dashboard" or query.lower()=="get agent commission dashboard" or query.lower()=="display agent commission dashboard" or query.lower()=="show agent commission dashboard" or query.lower()=="agent commission dashboard":
       url=f"{api_url2}/agent_commission_dashboard"
       return "agent_dashboard",url
    system_prompt=prompts['agent_dashboard_prompt']['prompt_content']
    agent_dashboard_prompt=system_prompt.format(query=query)  
    prompt = ChatPromptTemplate.from_messages(
        [("system", agent_dashboard_prompt), ("user", "{input}")]
    )
    output=agent(prompt,query)
    region=output['region']
    agent_id=output['agent_id']
    if region!="all":
      region=region.capitalize()
    if agent_id!="all":
      agent_id=agent_id.capitalize()
    url=f"{api_url2}/agent_commission_dashboard?region={region}&agent={agent_id}"
    print("url:",url)
    return "agent_dashboard",url

# @tool
# def display_barchart_agent_dashboard():
#    """display bar chart of agent dashboard or agent commission dashbaord"""
#    return "barchart of agent dashboard"

@tool 
def customer_satisfaction_state(query):
   """Gets which state has maximum customer satisfaction rate"""
   url=f"{api_url2}/subscription_dashboard/state_cust_satisfaction"
   print(url)
   return url
    
   

@tool
def max_avg_aging(query):
   """Gets which product has maximum average aging"""
   url=f"{api_url2}/subscription_dashboard/product_avg_rating"
   print(url)
   return url

@tool
def product_high_satisfaction(query):
   """Gets Which product has highest customer satisfaction"""
   url=f"{api_url2}/subscription_dashboard/prod_cust_satisfaction"
   print(url)
   return url

@tool 
def agent_max_commission(query):
   """Gets which agent earns maximum commission"""
   url=f"{api_url2}/agent_commission_dashboard/agent_earn_max"
   print(url)
   return url


# from langchain_openai import ChatOpenAI
# os.environ["OPENAI_API_KEY"] = "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"
 
# # Initialize OpenAI model with API key and temperature
# llm1 = ChatOpenAI(openai_api_key=os.environ["OPENAI_API_KEY"], temperature=0)

@tool
def creating_custom_sales_chart(query):
    """create custom charts for sales dashboard based on the user query"""
    print("entering into sales custom chart tool")
    print("--------------------------")
    system_prompt=prompts['sales_custom_chart_prompt']['prompt_content']
    prompt1a = PromptTemplate(template=system_prompt, input_variables=["query"])
    # print(prompt1a.invoke(user_query))
    first_chain = prompt1a|llm
    graph_config = first_chain.invoke(query)
    print("graph",graph_config)
    print("type", type(graph_config))
    try :
        #for open ai 
        output=parse_response_string_for_customchart(graph_config)
      #for huggig face 
      #   output=parse_response_string_for_customchart(graph_config)

        print(output)
        
        graph_name=output.get("Graph Name")
        graph_type=output.get("Graph Type")
        x_axis=output.get("x-axis")
        y_axis=output.get("y-axis")
        url = f"http://127.0.0.1:3000/custom_chart/sales_dashboard?graph_name={graph_name}&graph_type={graph_type}&x_axis={x_axis}&y_axis={y_axis}"
        print(url)
        return "sales_dashboard",url
    
    except ValueError as e:
        print(f"Error parsing response string: {e}")
        return None
    

@tool
def creating_custom_agent_chart(query):
    """create custom charts for agent commission dashboard based on the user query.If query contains the strings like Agent_ID,Sales_Closed,Total_Commission,Average_Commission_per_Sale,Region,Commission_Date"""
    print("entering into agent custom chart tool")
    print("--------------------------")
    system_prompt=prompts['agent_custom_chart_prompt']['prompt_content']
    prompt1a = PromptTemplate(template=system_prompt, input_variables=["query"])
    # print(prompt1a.invoke(user_query))
    #for open ai we use llm1 
    first_chain = prompt1a|llm
    #for hugging face we use llm
   #  first_chain = prompt1a|llm
    print(first_chain)
    graph_config = first_chain.invoke(query)
    print("graph",graph_config)
    print("type", type(graph_config))
    try:
        output=parse_response_string_for_customchart(graph_config)
        print(output)
        
        graph_name=output.get("Graph Name")
        graph_type=output.get("Graph Type")
        x_axis=output.get("x-axis")
        y_axis=output.get("y-axis")
        url = f"http://127.0.0.1:3000/custom_chart/agent_commission_dashboard?graph_name={graph_name}&graph_type={graph_type}&x_axis={x_axis}&y_axis={y_axis}"
        print(url)
        return "agent_dashboard",url
    
    except ValueError as e:
        print(f"Error parsing response string: {e}")
        return None
       


@tool
def creating_custom_subscription_chart(query):
    """create custom charts for subscription dashboard based on the user query.If query contains strings like Product_Name,Subscriber_ID,State,Customer_Satisfaction_Score,Payment_Method,Aging,Churn_new
"""
    print("entering into subscription custom chart tool")
    print("--------------------------")
    system_prompt=prompts['subscription_custom_chart_prompt']['prompt_content']
    prompt1a = PromptTemplate(template=system_prompt, input_variables=["query"])
    

    # print(prompt1a.invoke(user_query))
    first_chain = prompt1a|llm
    print(first_chain)
    graph_config = first_chain.invoke(query)
    print("graph",graph_config)
    print("type", type(graph_config))
    try:
        output=parse_response_string_for_customchart(graph_config)
        print(output)
        
        graph_name=output.get("Graph Name")
        graph_type=output.get("Graph Type")
        x_axis=output.get("x-axis")
        y_axis=output.get("y-axis")
        url = f"http://127.0.0.1:3000/custom_chart/subscription_dashboard?graph_name={graph_name}&graph_type={graph_type}&x_axis={x_axis}&y_axis={y_axis}"
        print(url)
        return "subscription_dashboard",url
    
    except ValueError as e:
        print(f"Error parsing response string: {e}")
        return None

@tool
def sales_query(query):
   """Answers the query related to sales data"""
   db=csv_to_sql("backend\data\sales_data.csv")
   model=ChatHuggingFace(llm=llm)
   execute_query=QuerySQLDataBaseTool(db=db)
   write_query=create_sql_query_chain(llm,db)
   sql_query=write_query.invoke({"question":query})
   selected_columns =sql_query.split("SELECT ", 1)[1].split(" FROM", 1)[0].strip()
   columns = [col.strip() for col in selected_columns.split(',')]

   chain=write_query|execute_query
   result=chain.invoke({"question":query})
   print(columns)
   print(result)
   print(type(result))
   result_list = ast.literal_eval(result)
   print(result_list)
   output = ", ".join(f"{columns[i]}: {result_list[0][i]}" for i in range(len(columns)))

   return "sales_dashboard",output

@tool
def subscription_query(query):
   """Answers the query related to subscription data. If query contains strings like Product_Name,Subscriber_ID,State,Customer_Satisfaction_Score,Payment_Method,Aging,Churn_new select this tool """
   db=csv_to_sql("backend/data/subscriptions_data.csv")
   model=ChatHuggingFace(llm=llm)
   execute_query=QuerySQLDataBaseTool(db=db)
   write_query=create_sql_query_chain(llm,db)
   print(write_query.invoke({"question":query}))
   sql_query=write_query.invoke({"question":query})
   selected_columns =sql_query.split("SELECT ", 1)[1].split(" FROM", 1)[0].strip()
   columns = [col.strip() for col in selected_columns.split(',')]

   chain=write_query|execute_query
   result=chain.invoke({"question":query})
   print(columns)
   print(result)
   print(type(result))
   result_list = ast.literal_eval(result)
   print(result_list)
   output = ", ".join(f"{columns[i]}: {result_list[0][i]}" for i in range(len(columns)))
   return "subscription_dashboard",output

@tool
def agent_query(query):
   """Answers the query related to agent data"""
   db=csv_to_sql("backend/data/agent_commissions_data.csv")
   model=ChatHuggingFace(llm=llm)
   execute_query=QuerySQLDataBaseTool(db=db)
   write_query=create_sql_query_chain(llm,db)
   print(write_query.invoke({"question":query}))
   sql_query=write_query.invoke({"question":query})
   selected_columns =sql_query.split("SELECT ", 1)[1].split(" FROM", 1)[0].strip()
   columns = [col.strip() for col in selected_columns.split(',')]

   chain=write_query|execute_query
   result=chain.invoke({"question":query})
   print(columns)
   print(result)
   print(type(result))
   result_list = ast.literal_eval(result)
   print(result_list)
   output = ", ".join(f"{columns[i]}: {result_list[0][i]}" for i in range(len(columns)))

   return "agent_dashboard",output