import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams , useNavigate , useLocation } from 'react-router-dom';
import Chart from 'chart.js/auto';
import Dashboard from './Dashboard';
import './SubscriptionDashboard.css';

const SubscriptionDashboard   = () => {
  const [subscriptiontData, setSubscriptionData] = useState([]);
  const [product_Name, setProductName] = useState([]);
  const [state, setState] = useState([]);
  const { chartType } = useParams(); // Fetch the route parameter for chart type
  const barChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const chartInstances = useRef({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Fetch the CSV data as JSON from the backend
    fetch('http://localhost:5000/api/subscriptions_data-csv')
      .then(response => response.json())
      .then(data => {
        setProductName(data);
        
        // Extract unique Product_IDs, Regions, Months, Years, and Quarters
        const uniqueProducts = [...new Set(data.map(item => item.Product_Name))];
        const uniqueStates = [...new Set(data.map(item => item.State))];

        setProductName(['ALL', ...uniqueProducts]);
        setState(['ALL', ...uniqueStates]);
 
      });
  }, []);

  useEffect(()=>{
    const urlParams = new URLSearchParams(window.location.search);
    const product = urlParams.get('product') || 'ALL';
    const state = urlParams.get('state') || 'ALL';
    fetch(`http://localhost:5000/subscription_dashboard/barchart?product=${product}&state=${state}`)
    .then(response => response.json())
    .then(data => {
      createBarChart(data);
    });

  // Fetch the line chart data
  fetch(`http://localhost:5000/subscription_dashboard/linechart?product=${product}&state=${state}`)
    .then(response => response.json())
    .then(data => {
      createLineChart(data);
    });
    

    return () => {
      // Cleanup chart instances on component unmount
      Object.values(chartInstances.current).forEach(chart => chart.destroy());
    };
  }, [location.search]);


  const createBarChart = (data) => {
    if (chartInstances.current.barChart) {
      chartInstances.current.barChart.destroy();
    }

    const labels = Object.keys(data);
    const values = Object.values(data);

    const ctx = barChartRef.current.getContext('2d');
    chartInstances.current.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Products',
          data: values,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Bar Chart'
          }
        }
      }
    });
  };

  const createLineChart = (data) => {
    // Destroy the existing chart instance if it exists
    if (chartInstances.current.lineChart) {
      chartInstances.current.lineChart.destroy();
    }
  
    // Extract labels (Aging) and values (Customer Satisfaction Score) from the data
    const labels = data.Aging.map(age => `Age ${age}`);
    const values = data.Customer_Satisfaction_Score;
  
    // Get the context of the canvas where the chart will be rendered
    const ctx = lineChartRef.current.getContext('2d');
  
    // Create the new line chart
    chartInstances.current.lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Customer Satisfaction Score',
            data: values,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: true,
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Customer Satisfaction Over Time'
          }
        }
      }
    });
  };
  
  

  

  const renderSalesCharts = () => {
    return (
      <div className="charts-container">
        <div className="chart-container">
          <canvas id="barChart" ref={barChartRef}></canvas>
        </div>
    
        <div className="chart-container">
          <canvas className='line-chart' id="lineChart" ref={lineChartRef}></canvas>
        </div>

    

      </div>
    );
  };

  const handleProductClick = (product) => {
    handleClick('product',product)
  };
  const handleStateClick = (state) => {
    handleClick('state',state)
  };
  
  
  const handleClick=(attribute,value)=>{
    const searchParams = new URLSearchParams(location.search);

  if (searchParams.has(attribute)) {
    searchParams.set(attribute, value);
  } else {
    searchParams.append(attribute, value);
  }
  navigate(`${location.pathname}?${searchParams.toString()}`);

  }

  return (
    <div>
      <nav className="sales-navbar">
        <ul>
          <li className="dropdown">
            <a className="dropdown-toggle" href="#">Product</a>
            <div className="dropdown-content">
              <ul className="product-dropdown">
                {product_Name.map((product, index) => (
                  <li key={index}>
                    <button onClick={()=>handleProductClick(product)}>{product}</button>
                    </li>
                ))}
              </ul>
            </div>
          </li>
          <li className="dropdown">
            <a className="dropdown-toggle" href="#">State</a>
            <div className="dropdown-content">
              <ul className="region-dropdown">
                {state.map((st, index) => (
                  <li key={index}>
                    <button onClick={()=> handleStateClick(st)}>{st}</button>
                  </li>
                ))}
              </ul>
            </div>
          </li>
          
        </ul>
      </nav>
      <Dashboard
        apiEndpoint="Subscription Dashboard"
        title={`subscriptions_dashboard-csv ${chartType ? `- ${chartType}` : ''}`}
      />
      {renderSalesCharts()}
    </div>
  );
};

export default SubscriptionDashboard;