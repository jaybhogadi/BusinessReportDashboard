
import pandas as pd
import os
import requests,json

import datetime


#pandasAI
from pandasai import Agent
from pandasai import SmartDataframe
os.environ["PANDASAI_API_KEY"] = "$2a$10$HLYKOiUeOksE7oKn/Iyv9uWHnCZF/F3IWF4l7vSzJWUUNTB8Unp36"


from flask import Flask, jsonify, send_from_directory,request
from flask_cors import CORS,cross_origin

from backend.memory.invoking_method import *
import jwt
from backend.memory.chart_invoking_method import *

from urllib.parse import urlparse, parse_qs

app = Flask(__name__)
CORS(app)



app.config['SECRET_KEY'] = '123456'
USER_DATA = {
    'uname': 'admin',
    'password': '1234'
}
previous_answers = ""
@app.route('/api/chat', methods=['POST','GET'])
def apichat():
   global previous_answers
   data = request.json
   print("query is")
   print(data)

#    message=data
   message = data.get('message', '')
   print("Main app")
   print(message)
   if "bubble" in message:
       res='http://localhost:3000/bubble'
       return (jsonify(res))
   if "graph" in message or "plot" in message or 'chart' in message:
       print("starting chart_invoking")
       ans=chart_invoking(message)
       print(type(ans))
       print(type(ans[1]))
       regex = r'custom_chart\/([^?]+)'
       cur_db_match = re.search(regex, ans[1])
       if cur_db_match:
        cur_db = cur_db_match.group(1)
       if cur_db in previous_answers:
            parsed_url = urlparse(ans[1])

            query_params = parse_qs(parsed_url.query)

            # Extract specific parameters
            graph_name = query_params.get('graph_name', [''])[0]
            graph_type = query_params.get('graph_type', [''])[0]
            x_axis = query_params.get('x_axis', [''])[0]
            y_axis = query_params.get('y_axis', [''])[0]
            print(graph_name)
            print(graph_type)
            previous_answers+="&graph_name2="+graph_name+"&graph_type2="+graph_type+"&x_axis2"+x_axis+"&y_axis2"+y_axis
            print(previous_answers)
            return previous_answers
           
        # print("answer is", ans)
       else:    
            previous_answers=ans[1]

       return jsonify(ans[1])
#    m="display sales dashboard of region east"
   print("invoking start")
   # Process the message and generate a response
   ans=invoking(message)
   print("answer is",ans)
#    if('custom_chart' in ans[1]):
    #    print(ans)
       
    #    ans='http://127.0.0.1:3000/sales_dashboard/custom_chart?graph_name=None&graph_type=line%20chart&x_axis=Month&y_axis=Sale_Quantity'
#    if len(ans)>=1:
    #    return jsonify(ans)
#        print("url is",ans[2])
#    print("invoking end")
#    response = {
#        'reply': f'Your url: {ans}'  # Example response
#    }

   return jsonify(ans[1])


@app.route('/api/save', methods=['POST'])
def save_data():
    data = request.json.get('data')
    print(data)
    if data:
        # Define the folder path where you want to save the file
        folder_path = os.path.join(os.getcwd(), 'saved_files')
        os.makedirs(folder_path, exist_ok=True)
        
        # Define the file path
        file_path = os.path.join(folder_path, 'data1.json')
        
        # Save the data to the file
        with open(file_path, 'w') as file:
            json.dump(data, file, indent=2)
        
        return jsonify({'message': 'Data saved successfully!'}), 200
    return jsonify({'message': 'No data found!'}), 400


@app.route('/api/handlechat',methods=['POST','GET'])
def handleChat():
    data = request.json
    query = data.get('query', '')
    # query= request.args.get('query')
    print(query)
    file_path='D:/Learning/React_Main/backend/saved_files/data1.json'
    # file_path = 'backend/saved_files/data1.json'

# Read JSON data into a DataFrame
    with open(file_path, 'r') as f:
        data = json.load(f)
        sdf = SmartDataframe(data)
        print("data read successfully")
        # print(sdf.head(5))
        
        
    # os.environ["PANDASAI_API_KEY"] = "$2a$10$HLYKOiUeOksE7oKn/Iyv9uWHnCZF/F3IWF4l7vSzJWUUNTB8Unp36"

    res=sdf.chat("give all the agent id s it must not return string only")
    print(res)
    
        





@app.route('/sales_data',methods=['GET'])
def get_sales_data():
    x_axis = request.args.get('x_axis')
    y_axis = request.args.get('y_axis')
    
    print(x_axis)
    print(y_axis)
    
    url = 'http://localhost:5000/api/sales_data-csv'
    response = requests.get(url)
    
    if response.status_code != 200:
        return jsonify({'error': 'Failed to fetch data from API'}), response.status_code
    
    try:
        json_data = response.json()
        df = pd.DataFrame(json_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    if x_axis not in df.columns or y_axis not in df.columns:
        return jsonify({'error': 'Invalid x_axis or y_axis parameter'}), 400
    
    df[x_axis] = df[x_axis].astype(str)
    
    # Filter the dataframe based on y_axis values
    filtered_df = df.copy()
    if df[y_axis].dtype in [int, float]:
        if df[y_axis].between(0, 10).all():
            # Take average if all values are between 0 and 10
            result = df.groupby(x_axis)[y_axis].mean().reset_index()
        elif df[y_axis].between(0, 5).all():
            # Take average if all values are between 0 and 5
            result = df.groupby(x_axis)[y_axis].mean().reset_index()
        else:
            # Otherwise, sum up the values
            result = df.groupby(x_axis)[y_axis].sum().reset_index()
    else:
        # Handle non-numeric cases or mixed types
        result = df.groupby(x_axis)[y_axis].first().reset_index()
    
    data = {row[x_axis]: row[y_axis] for _, row in result.iterrows()}
    print("HIII")
    
    return jsonify(data)


@app.route('/agent_data',methods=['GET'])
def get_agent_data():
    x_axis=request.args.get('x_axis')
    y_axis=request.args.get('y_axis')
    print(x_axis)
    print(y_axis)
    url='http://localhost:5000/api/agent_commission_dashboard-csv'
    response=requests.get(url)
    if response.status_code!=200:
        return jsonify({'error':'Failed to fetch data from API'}),response.status_code
    try:
        json_data=response.json()
        df=pd.DataFrame(json_data)
    except Exception as e:
        return jsonify({'error':str(e)}),500
    
    if x_axis not in df.columns or y_axis not in df.columns:
        return jsonify({'error':'invalid x_axis or y_axis parameter'}),400
    df[x_axis]=df[x_axis].astype(str)
    result=df.groupby(x_axis)[y_axis].sum().reset_index()
    data={row[x_axis]:row[y_axis] for _,row in result.iterrows()}
    # print(data)
    print("HIII")
    
   


    return jsonify(data)
    
@app.route('/subscription_data',methods=['GET'])
def get_subscription_data():
    x_axis = request.args.get('x_axis')
    y_axis = request.args.get('y_axis')
    
    print(x_axis)
    print(y_axis)
    
    url = 'http://localhost:5000/api/subscriptions_data-csv'
    response = requests.get(url)
    
    if response.status_code != 200:
        return jsonify({'error': 'Failed to fetch data from API'}), response.status_code
    print("HI")
    try:
        json_data = response.json()
        df = pd.DataFrame(json_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    if x_axis not in df.columns or y_axis not in df.columns:
        return jsonify({'error': 'Invalid x_axis or y_axis parameter'}), 400
    
    df[x_axis] = df[x_axis].astype(str)
    
    # Filter the dataframe based on y_axis values
    filtered_df = df.copy()
    if df[y_axis].dtype in [int, float]:
        if df[y_axis].between(0, 10).all():
            # Take average if all values are between 0 and 10
            result = df.groupby(x_axis)[y_axis].mean().reset_index()
        elif df[y_axis].between(0, 5).all():
            # Take average if all values are between 0 and 5
            result = df.groupby(x_axis)[y_axis].mean().reset_index()
        else:
            # Otherwise, sum up the values
            result = df.groupby(x_axis)[y_axis].sum().reset_index()
    else:
        # Handle non-numeric cases or mixed types
        result = df.groupby(x_axis)[y_axis].first().reset_index()
    
    data = {row[x_axis]: row[y_axis] for _, row in result.iterrows()}
    print("HIII")
    
    return jsonify(data)      


# Define a route for your API endpoint
@app.route('/custom', methods=['POST','GET'])
def get_sums():
    if request.method == 'POST':
        # Receive data from the frontend
        data = request.get_json()
        print(data)

        # Assuming data contains x axis and y axis values
        x_axis_values = data.get('x_axis', '')
        y_axis_values = data.get('y_axis','')
        print(x_axis_values)
        # Fetch CSV data from another API endpoint
        csv_api_url = 'http://localhost:5000/api/sales_data-csv'  # Replace with your actual API endpoint
        response = requests.get(csv_api_url)
        if response.status_code == 200:
            sales_data = response.json()  # Assuming the API returns JSON data
        else:
            return jsonify({'error': 'Failed to fetch sales data'}), 500

        # Calculate sums based on fetched data
        sums = {}

        for row in sales_data:
            x_value = row[x_axis_values]  # Replace with your actual X-axis field
            y_value = float(row[y_axis_values])  # Replace with your actual Y-axis field

            if x_value in x_axis_values:
                if x_value not in sums:
                    sums[x_value] = 0
                sums[x_value] += y_value

        # Prepare response in JSON format
        response = [{'x_value': key, 'y_sum': value} for key, value in sums.items()]
        print(response)
        return jsonify(response)
    

@app.route('/bubble',methods=['GET','POST'])
def bubble():
    csv_api_url = 'http://localhost:5000/api/sales_data-csv'  # Replace with your actual API endpoint
    response = requests.get(csv_api_url)
    if response.status_code == 200:
        sales_data = response.json()
        sales_data=pd.DataFrame(sales_data)
    else:
        return jsonify({'error': 'Failed to fetch sales data'}), 500
    data={
        "Sale_Amount":sales_data['Sale_Amount'].tolist(),
        "Product_Name":sales_data['Product_Name'].to_list(),
        "Sale_Quantity":sales_data['Sale_Quantity'].tolist(),
        "Region":sales_data['Region'].to_list()
    }
    print(data)
    return jsonify(data)




@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    if data['uname'] == USER_DATA['uname'] and data['password'] == USER_DATA['password']:
        token = jwt.encode({
            'user': data['uname'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm="HS256")
        return jsonify({'token': token})
    return jsonify({'message': 'Invalid credentials'}), 401



@app.route('/api/chat', methods=['POST','GET'])
def chat():
    data = request.json
    message = data.get('message', '')
    # Process the message and generate a response
    response = {
        'reply': f'You said: {message}'  # Example response
    }
    return jsonify(response)



@app.route('/api/sales_data-csv', methods=['GET'])
def get_data_csv():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(base_dir, 'backend/data/sales_data.csv')
    df = pd.read_csv(file_path)
    return jsonify(df.to_dict(orient='records'))


@app.route('/salesdashboard/barchart', methods=['GET'])
def get_bar():
    response=requests.get('http://localhost:5000/api/sales_data-csv')
    data=response.json()
    df=pd.DataFrame(data)
    filters=request.args.to_dict()
    df=apply_filters_sales(filters,df)
    ag=df.groupby('Product_Name')['Sale_Quantity'].sum().reset_index()
    data_dict=df.set_index('Product_Name')['Sale_Quantity'].to_dict()
    json_data=json.dumps(data_dict)
    json_data=json.loads(json_data)
    return jsonify(json_data)

@app.route('/salesdashboard/linechart', methods=['GET'])
def get_linechart():
    response=requests.get('http://localhost:5000/api/sales_data-csv')
    data=response.json()
    df=pd.DataFrame(data)
    filters=request.args.to_dict()
    print('filters names')
    print(filters)
    df=apply_filters_sales(filters,df)
    ag=df.groupby('Month').agg({'Sale_Quantity':'sum','Sale_Amount':'sum'}).reindex(['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],fill_value=0)
    result={
        'monthly_quantity':ag['Sale_Quantity'].tolist(),
        'monthly_amount':ag['Sale_Amount'].tolist()

    }
    return jsonify(result)


@app.route('/salesdashboard/piechart', methods=['GET'])
def pie_chart():
    response=requests.get('http://localhost:5000/api/sales_data-csv')
    data=response.json()
    df=pd.DataFrame(data)
    filters=request.args.to_dict()
    df=apply_filters_sales(filters,df)
    ag=df.groupby('Product_Name').sum()[['Sale_Quantity','Sale_Amount']].to_dict('index')
    return jsonify(ag)



@app.route('/salesdashboard/histogram', methods=['GET'])
def histogram():
    response=requests.get('http://localhost:5000/api/sales_data-csv')
    data=response.json()
    df=pd.DataFrame(data)
    filters=request.args.to_dict()
    df=apply_filters_sales(filters,df)
    hist_data=df['Sale_Quantity'].tolist()
    #ag=df.groupby('Product_Name').sum()[['Sale_Quantity','Sale_Amount']].to_dict('index')
    return jsonify(hist_data)

def apply_filters_sales(filters,df):
    print("filters are",filters)
    product_name=filters.get('Product_Name')
    region=filters.get('Region')
    month=filters.get('Month')
    year=filters.get('Year')
    quarter=filters.get('Quarter')
    filtered_data=df
    if product_name and product_name.lower()!="all":
        filtered_data=filtered_data[filtered_data['Product_Name']==product_name]
    if region and region.lower()!="all":
        filtered_data=filtered_data[filtered_data['Region']==region]
    if month and month.lower()!="all":
        filtered_data=filtered_data[filtered_data['Month']==month]
    if year and year.lower()!="all":
        filtered_data=filtered_data[filtered_data['Year']==int(year)]
    if quarter and quarter.lower()!="all":
        filtered_data=filtered_data[filtered_data['Quarter']==quarter]
    return filtered_data


def apply_filters_agent(filters,df):
    agent=filters.get('Agent_ID')
    region=filters.get('Region')
    filtered_data=df
    print(filters)
    if agent and agent.lower()!="all":
        filtered_data=filtered_data[filtered_data['Agent_ID']==agent]
    if region and region.lower()!="all":
        filtered_data=filtered_data[filtered_data['Region']==region]
    return filtered_data

def apply_filters_subscription(filters,df):
    product=filters.get('Product_Name')
    state=filters.get('State')
    filtered_data=df
    if product and product.lower()!="all":
        filtered_data=filtered_data[filtered_data['Product_Name']==product]
    if state and state.lower()!="all":
        filtered_data=filtered_data[filtered_data['State']==state]
    return filtered_data



@app.route('/api/subscriptions_data-csv', methods=['GET'])
def get_subscriptions_data():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(base_dir, 'backend/data/subscriptions_data.csv')
    df = pd.read_csv(file_path)
    return jsonify(df.to_dict(orient='records'))


@app.route('/subscription_dashboard/barchart', methods=['GET'])
def get_subscription_bar():
    response=requests.get('http://localhost:5000/api/subscriptions_data-csv')
    data=response.json()
    df=pd.DataFrame(data)
    filters=request.args.to_dict()
    df=apply_filters_subscription(filters,df)
    ag=df.groupby('Product_Name')['Churn_new'].sum().nlargest(10).to_dict()
    return jsonify(ag)

@app.route('/subscription_dashboard/linechart', methods=['GET'])
def get_subscriptionlinechart():
    response=requests.get('http://localhost:5000/api/subscriptions_data-csv')
    data=response.json()
    df=pd.DataFrame(data)
    filters=request.args.to_dict()
    df=apply_filters_subscription(filters,df)  
    ag=df.groupby('Aging')['Customer_Satisfaction_Score'].agg(lambda x:x.value_counts().idxmax()).reset_index()

    return jsonify(ag.to_dict(orient='list'))


@app.route('/api/agent_commission_dashboard-csv', methods=['GET'])
def agentcommission():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(base_dir, 'backend/data/agent_commissions_data.csv')
    df = pd.read_csv(file_path)
    return jsonify(df.to_dict(orient='records'))


@app.route('/agent_commission_dashboard/barchart', methods=['GET'])
def get_agent_bar():
    response=requests.get('http://localhost:5000/api/agent_commission_dashboard-csv')
    data=response.json()
    df=pd.DataFrame(data)
    filters=request.args.to_dict()
    df=apply_filters_agent(filters,df)
    ag=df.groupby('Agent_ID')['Total_Commission'].sum().to_dict()
    return jsonify(ag)

@app.route('/agent_commission_dashboard/piechart', methods=['GET'])
def get_agentline():
    response=requests.get('http://localhost:5000/api/agent_commission_dashboard-csv')
    data=response.json()
    df=pd.DataFrame(data)
    filters=request.args.to_dict()
    df=apply_filters_agent(filters,df)
    ag=df.groupby('Agent_ID')['Total_Commission'].sum().reset_index()
    return jsonify(ag.to_dict(orient='list'))


if __name__ == '__main__':
    app.run(debug=True, port=5000)
