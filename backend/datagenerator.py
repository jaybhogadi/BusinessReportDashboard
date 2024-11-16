import pandas as pd
import numpy as np
import random

def generate_synthetic_data():
    np.random.seed(42)
    num_records=500
    agent=np.random.randint(100,120,size=(num_records))
    sales=np.random.randint(10,30,size=(num_records))
    tot=np.random.randint(2000,3000,size=(num_records))
    avg=np.random.choice([100],size=num_records)
    # pids=[f'P{str(i).zfill(4)}' for i in range(1,num_records+1)]
    product_names=np.random.choice(['Office 365 ProPlus','Office 365 Enterprise E1','Office 365 Enterprise E3','Office 365 Enterprise E5'],size=num_records)
    regions=np.random.choice(['North','South','East','West'],size=num_records)
    # months=np.random.choice(['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],size=num_records)
    year=np.random.choice(['Texas','Montana','California'],size=num_records)
    quarter=np.random.choice(['Q1','Q2','Q3','Q4'],size=num_records)
    sale_amounts=np.random.randint(30,60,size=(num_records))*100
    sale_quantities=np.random.randint(80,120,size=(num_records))
    cust=np.random.randint(1,5,size=(num_records))
    pay=np.random.choice(['CCard','Online','Cheque'],size=num_records)
    ag=np.random.randint(1,10,size=(num_records))
    ch=np.random.choice([0,1],size=num_records)
    start_date = pd.to_datetime('2024-01-01')
    end_date = pd.to_datetime('2024-05-30')
    date_range = (end_date - start_date).days

    date = start_date + pd.to_timedelta(np.random.randint(0, date_range + 1, size=num_records), unit='D')


    data={
        "Agent_ID":agent,
        'Sales_Closed':sales,
        'Total_Commission':tot,
        'Average_Commission_per_Sale':avg,
        'Region':regions,
        'Commission_Date':date
        # "Product_ID":pids,
        # "Product_Name":product_names,
        # "Subscriber_ID":regions,
        # # "Month":months,
        # "State":year,
        # 'Customer_Satisfaction_Score':cust,
        # 'Payment_Method':pay,
        # 'Aging':ag,
        # 'Churn_new':ch
        # "Quarter":quarter,
        # "Sale_Amount":sale_amounts,
        # "Sale_Quantity":sale_quantities
    }
    return pd.DataFrame(data)


df=generate_synthetic_data()
df.to_csv('data.csv', index=False)

