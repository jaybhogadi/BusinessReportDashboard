import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams , useNavigate , useLocation } from 'react-router-dom';
import Chart from 'chart.js/auto';
import Dashboard from './Dashboard';
import './AgentDashboard.css';

const AgentDashboard   = () => {
  const [agentData, setAgentData] = useState([]);
  const [agentID, setAgentID] = useState([]);
  const [regions, setRegions] = useState([]);
  const { chartType } = useParams(); // Fetch the route parameter for chart type
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const chartInstances = useRef({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Fetch the CSV data as JSON from the backend
    fetch('http://localhost:5000/api/agent_commission_dashboard-csv')
      .then(response => response.json())
      .then(data => {
        setAgentData(data);
        
        // Extract unique Product_IDs, Regions, Months, Years, and Quarters
        const uniqueAgents = [...new Set(data.map(item => item.Agent_ID))];
        const uniqueRegions = [...new Set(data.map(item => item.Region))];

        setAgentID(['ALL', ...uniqueAgents]);
        setRegions(['ALL', ...uniqueRegions]);
 
      });
  }, []);

  useEffect(()=>{
    const urlParams = new URLSearchParams(window.location.search);
    const agent = urlParams.get('agent') || 'ALL';
    const region = urlParams.get('region') || 'ALL';
  // Fetch the bar chart data
  fetch(`http://localhost:5000/agent_commission_dashboard/barchart?agent=${agent}&region=${region}`)
  .then(response => response.json())
  .then(data => {
    createBarChart(data);
  });

// Fetch the line chart data
  fetch(`http://localhost:5000/agent_commission_dashboard/piechart?agent=${agent}&region=${region}`)
  .then(response => response.json())
  .then(data => {
    createPieChart(data);
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
          label: 'Sale Agent_ID',
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

  const createPieChart = (data) => {
    // Destroy the existing chart instance if it exists
    if (chartInstances.current.pieChart) {
      chartInstances.current.pieChart.destroy();
    }
  
    // Extract labels (Agent IDs) and values (Total Commissions) from the data
    const labels = data.Agent_ID.map(id => `Agent ${id}`);
    const values = data.Total_Commission;
  
    // Get the context of the canvas where the chart will be rendered
    const ctx = pieChartRef.current.getContext('2d');
  
    // Create the new pie chart
    chartInstances.current.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          label: 'Total Commission',
          data: values,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Agent Commissions Pie Chart',
          }
        },
        layout: {
          padding: 0
        },
        aspectRatio: 1,
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
          <canvas className='pie-chart' id="pieChart" ref={pieChartRef} width={50} height={50}></canvas>
        </div>

    

      </div>
    );
  };

  const handleRegionClick = (region) => {
    handleClick('region',region)
  };
  const handleAgentClick = (agent) => {
    handleClick('agent',agent)
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
            <a className="dropdown-toggle" href="#">Agent_ID</a>
            <div className="dropdown-content">
              <ul className="product-dropdown">
                {agentID.map((agent, index) => (
                  <li key={index}>
                    <button onClick={() => handleAgentClick(agent)}>{agent}</button>
                    </li>
                ))}
              </ul>
            </div>
          </li>
          <li className="dropdown">
            <a className="dropdown-toggle" href="#">Regions</a>
            <div className="dropdown-content">
              <ul className="region-dropdown">
                {regions.map((region, index) => (
                  <li key={index}>
                     <button onClick={() => handleRegionClick(region)}>{region}</button>
                    </li>
                ))}
              </ul>
            </div>
          </li>
          
        </ul>
      </nav>
      <Dashboard
        apiEndpoint="Agent Commissions Dashboard"
        title={`agent_commission_dashboard-csv ${chartType ? `- ${chartType}` : ''}`}
      />
      {renderSalesCharts()}
    </div>
  );
};

export default AgentDashboard;
