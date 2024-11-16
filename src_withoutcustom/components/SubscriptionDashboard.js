import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import Chart from 'chart.js/auto';
import Dashboard from './Dashboard';
import './SubscriptionDashboard.css';
import logo from '../Assets/logo.jpg';

const SubscriptionDashboard = () => {
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

  useEffect(() => {
    // Ensure all refs are defined before fetching data and creating charts
    // if (barChartRef.current && lineChartRef.current) {
    //   setTimeout(() => {
        fetchDataAndCreateCharts();
    //   }, 0);
    // } else {
    //   console.error('One or more canvas elements are not ready.');
    // }
  }, [location.search]);

  const fetchDataAndCreateCharts = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const product = urlParams.get('Product_Name') || 'ALL';
    const state = urlParams.get('State') || 'ALL';

    const fetchChartData = (url, callback) => {
      fetch(url)
        .then(response => response.json())
        .then(data => {
          callback(data);
        })
        .catch(error => {
          console.error(`Failed to fetch data from ${url}:`, error);
        });
    };
    // Product_Name,Subscriber_ID,State,Customer_Satisfaction_Score,Payment_Method,Aging,Churn_new

    if (barChartRef.current) {
      fetchChartData(`http://localhost:5000/subscription_dashboard/barchart?Product_Name=${product}&State=${state}`, createBarChart);
    }

    if (lineChartRef.current) {
      fetchChartData(`http://localhost:5000/subscription_dashboard/linechart?Product_Name=${product}&State=${state}`, createLineChart);
    }
  };

  const createBarChart = (data) => {
    if (chartInstances.current.barChart) {
      chartInstances.current.barChart.destroy();
    }

    const labels = Object.keys(data);
    const values = Object.values(data);

    if (barChartRef.current) {
      const ctx = barChartRef.current.getContext('2d');
      chartInstances.current.barChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Products',
            data: values,
            backgroundColor:'#79dbe0',
            // backgroundColor: 'rgba(54, 162, 235, 0.5)',
            // borderColor: 'rgba(54, 162, 235, 1)',
            borderColor:'#79dbe0',
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
    }
  };

  const createLineChart = (data) => {
    if (chartInstances.current.lineChart) {
      chartInstances.current.lineChart.destroy();
    }

    const labels = data.Aging.map(age => `Age ${age}`);
    const values = data.Customer_Satisfaction_Score;

    if (lineChartRef.current) {
      const ctx = lineChartRef.current.getContext('2d');
      chartInstances.current.lineChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Customer Satisfaction Score',
              data: values,
              borderColor:'#79dbe0',
              // borderColor: 'rgba(54, 162, 235, 1)',
              // backgroundColor: 'rgba(54, 162, 235, 0.2)',
              backgroundColor:'#e3fffc',
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
    }
  };

  const renderSalesCharts = () => {
    return (
      <div className="charts-container">
        <div className="chart-container">
        <canvas id="barChart" ref={barChartRef}></canvas> 
          {/* {barChartRef.current ?  <canvas id="barChart" ref={barChartRef}></canvas> : <h1>error</h1>}  */}
         
        </div>
        <div className="chart-container">
          <canvas className="line-chart" id="lineChart" ref={lineChartRef}></canvas>
        </div>
      </div>
    );
  };

  const handleProductClick = (product) => {
    handleClick('Product', product);
  };
  
  const handleStateClick = (state) => {
    handleClick('state', state);
  };

  const handleClick = (attribute, value) => {
    const searchParams = new URLSearchParams(location.search);

    if (searchParams.has(attribute)) {
      searchParams.set(attribute, value);
    } else {
      searchParams.append(attribute, value);
    }
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  return (
    <div>
      <nav className="sales-navbar">
        <ul>
          <li className="navbar-logo">
            <img src={logo} alt="Logo" className="logo-image" style={{ width: '90px', height: '50px' }}  />
          </li>
        <li className="navbar-title"><h1 className='left'>Subscription Dashboard</h1></li>

          <li className="dropdown">
            <p className="dropdown-toggle">Product</p>
            <div className="dropdown-content">
              <ul className="product-dropdown">
                {product_Name.map((product, index) => (
                  <li key={index}>
                    <button onClick={() => handleProductClick(product)}>{product}</button>
                  </li>
                ))}
              </ul>
            </div>
          </li>
          <li className="dropdown">
            <p className="dropdown-toggle" href="#">State</p>
            <div className="dropdown-content">
              <ul className="region-dropdown">
                {state.map((st, index) => (
                  <li key={index}>
                    <button onClick={() => handleStateClick(st)}>{st}</button>
                  </li>
                ))}
              </ul>
            </div>
          </li>
          <li>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </li>
          <Link to="/home">
              <i className="fas fa-home icon"></i>
            </Link>
       
        </ul>
      </nav>
      {/* <Dashboard
        apiEndpoint="Subscription Dashboard"
        title={`subscriptions_dashboard-csv ${chartType ? `- ${chartType}` : ''}`}
      /> */}
      {renderSalesCharts()}
    </div>
  );
};

export default SubscriptionDashboard;
