
import React, { useEffect, useState } from 'react';
import Plotly from 'plotly.js-cartesian-dist';
import logo from '../Assets/logo.jpg';
import { Link } from 'react-router-dom';


const BubbleChart = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/sales_data-csv');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.warn("Invalid or empty data received for bubble chart:", data);
      return;
    }

    // Group data by Region and calculate total Sale_Amount
    const aggregatedData = aggregateDataByRegion(data);

    console.log("Aggregated data for bubble chart:", aggregatedData);

    const trace = {
      x: Object.keys(aggregatedData), // Regions
      y: Object.values(aggregatedData).map(item => item.totalSaleAmount), // Total Sale Amount for each region
      mode: 'markers',
      marker: {
        size: Object.values(aggregatedData).map(item => item.totalSaleAmount / 20), // Size based on total Sale Amount
        sizemode: 'area', // Set sizemode to area for bubble size scaling
        color: Object.keys(aggregatedData).map(region => getColorForRegion(region)), // Assign color based on region
        opacity: 0.6,
      },
      text: Object.keys(aggregatedData).map(region => ${region}: ${aggregatedData[region].totalSaleAmount}), // Hover text
      hoverinfo: 'text'
    };

    const layout = {
      title: 'Bubble Chart: Regions vs Total Sales Amount',
      width: 900, // Adjust the width of the chart
      height: 600,
      xaxis: {
        title: 'Region'
      },
      yaxis: {
        title: 'Total Sales Amount'
      },
      margin: { t: 50 },
      hovermode: 'closest',
      showlegend: false,
      autosize: true,
    };

    const config = {
      responsive: true
    };

    const element = document.getElementById('bubble-chart');
    if (element) {
      Plotly.newPlot(element, [trace], layout, config);
    }

    // Cleanup function to remove the Plotly instance when component unmounts
    return () => {
      if (element) {
        Plotly.purge(element);
      }
    };

  }, [data]);

  const aggregateDataByRegion = (data) => {
    const aggregatedData = {};

    data.forEach(item => {
      const { Region, Sale_Amount } = item;
      if (!aggregatedData[Region]) {
        aggregatedData[Region] = {
          totalSaleAmount: 0
        };
      }
      aggregatedData[Region].totalSaleAmount += Sale_Amount;
    });

    return aggregatedData;
  };

  const getColorForRegion = (region) => {
    const colors = {
      'North': 'rgb(31, 119, 180)',
      'South': 'rgb(255, 127, 14)',
      'East': 'rgb(44, 160, 44)',
      'West': 'rgb(214, 39, 40)'
      // Add more colors or customize as needed
    };

    return colors[region] || 'rgb(31, 119, 180)'; // Default to a color (e.g., blue) if region color is not defined
  };

  return (
    <div>
            <nav className="sales-navbar">
        <ul>
        <li className="navbar-logo">
            <img src={logo} alt="Logo" className="logo-image" style={{ width: '90px', height: '50px' }}  />
          </li>
          <li className="navbar-title"><h1 className='left'>Sales Dashboard</h1></li>
          
          
          
          
           
          
          <li>

          </li>
          
          <Link to="/home" style={{ marginRight:'20px' }}>
              <i className="fas fa-home icon"></i>
            </Link>
        </ul>
      </nav>

      
    <div id="bubble-chart" style={{ width: '100%', height: '600px',alignItems:'center',alignContent:'center',display:'flex',flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} 
      >
      {/* This div will be used by Plotly to render the chart */}
    </div>
    </div>
  );
};

export default BubbleChart;