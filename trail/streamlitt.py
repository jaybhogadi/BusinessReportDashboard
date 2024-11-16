import streamlit as st
import json

st.title('Generate React Dashboard Component')

dashboard_name = st.text_input('Dashboard Name', 'SalesDashboard')
column_names = st.text_area('Column Names (comma separated)', 'Product_ID,Product_Name,Region,Month,Year,Quarter,Sale_Amount,Sale_Quantity')

if st.button('Generate'):
    config = {
        'dashboard_name': dashboard_name,
        'column_names': [name.strip() for name in column_names.split(',')]
    }
    with open(f'{dashboard_name.lower()}_config.json', 'w') as f:
        json.dump(config, f)
    st.success(f'Configuration for {dashboard_name} saved successfully!')
