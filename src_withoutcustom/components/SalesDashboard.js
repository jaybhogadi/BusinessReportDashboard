import React, { useEffect, useState, useRef } from 'react';
import {Link , useParams, useNavigate, useLocation } from 'react-router-dom';
import Chart from 'chart.js/auto';
import Dashboard from './Dashboard';
import './SalesDashboard.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import logo from '../Assets/logo.jpg';



const SalesDashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [products, setProducts] = useState([]);
  const [regions, setRegions] = useState([]);
  const [months, setMonths] = useState([]);
  const [years, setYears] = useState([]);
  const [quarters, setQuarters] = useState([]);
  const { chartType } = useParams();
  const barChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const histogramRef = useRef(null);
  const chartInstances = useRef({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Fetch the CSV data as JSON from the backend
    fetch('http://localhost:5000/api/sales_data-csv')
      .then(response => response.json())
      .then(data => {
        setSalesData(data);

        // Extract unique Product_IDs, Regions, Months, Years, and Quarters
        const uniqueProducts = [...new Set(data.map(item => item.Product_Name))];
        const uniqueRegions = [...new Set(data.map(item => item.Region))];
        const uniqueMonths = [...new Set(data.map(item => item.Month))];
        const uniqueYears = [...new Set(data.map(item => item.Year))].sort((a, b) => a - b).map(year => year.toString());;
        const uniqueQuarters = [...new Set(data.map(item => item.Quarter))];

        setProducts(['ALL', ...uniqueProducts]);
        setRegions(['ALL', 'North', 'South', 'East', 'West']);
        setMonths(['ALL', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
        setYears(['ALL', ...uniqueYears]);
        setQuarters(['ALL', 'Q1', 'Q2', 'Q3', 'Q4']);
      });
  }, []);

  useEffect(() => {
    // Ensure all refs are defined before fetching data and creating charts
    // if (barChartRef.current && lineChartRef.current && pieChartRef.current && histogramRef.current) {
      fetchDataAndCreateCharts();
    // } else {
    //   console.error('One or more canvas elements are not ready.');
    // }
  }, [location.search]);

  const fetchDataAndCreateCharts = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const product = urlParams.get('Product_ID') || 'ALL';
    const region = urlParams.get('Region') || 'ALL';
    const month = urlParams.get('Month') || 'ALL';
    const year = urlParams.get('Year') || 'ALL';
    // const year = yearParam === 'ALL' ? yearParam : parseInt(yearParam) || 'ALL';
    const quarter = urlParams.get('Quarter') || 'ALL';

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
    // Product_ID,Product_Name,Region,Month,Year,Quarter,Sale_Amount,Sale_Quantity


    if (barChartRef.current) {
      fetchChartData(`http://localhost:5000/salesdashboard/barchart?Product_ID=${product}&Region=${region}&Month=${month}&Quarter=${quarter}&Year=${year}`, createBarChart);
    }

    if (lineChartRef.current) {
      fetchChartData(`http://localhost:5000/salesdashboard/linechart?Product_ID=${product}&Region=${region}&Month=${month}&Quarter=${quarter}&Year=${year}`, createLineChart);
    }

    if (pieChartRef.current) {
      fetchChartData(`http://localhost:5000/salesdashboard/piechart?Product_ID=${product}&Region=${region}&Month=${month}&Quarter=${quarter}&Year=${year}`, createPieChart);
    }

    if (histogramRef.current) {
      fetchChartData(`http://localhost:5000/salesdashboard/histogram?Product_ID=${product}&Region=${region}&Month=${month}&Quarter=${quarter}&Year=${year}`, createHistogram);
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
            label: 'Sale Quantity',
            data: values,
            backgroundColor: '#79dbe0',
            borderColor: '#91dfe3',
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
              text: 'Bar Chart of',
              margin:{
                bottom: 100,
              },
              padding: {
                top: 10,  // Padding at the top
                bottom: 10,  // Padding at the bottom
                left: 0,  // Padding on the left
                right: 0  // Padding on the right
              }
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

    if (lineChartRef.current) {
      const ctx = lineChartRef.current.getContext('2d');
      chartInstances.current.lineChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
          ],
          datasets: [
            {
              label: 'Sale Amount',
              data: data.monthly_amount,
              borderColor: '#7bd0e3',
              // backgroundColor: '#d8f1f2',
              // fill: true,
              tension: 0.1
            },
            {
              label: 'Sale Quantity',
              data: data.monthly_quantity,
              borderColor: '#72eef2',
              // backgroundColor: 'rgba(54, 162, 235, 0.2)',
              // fill: true,
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
              text: 'Line Chart'
            }
          }
        }
      });
    }
  };

  const createPieChart = (data) => {
    if (chartInstances.current.pieChart) {
      chartInstances.current.pieChart.destroy();
    }

    const labels = Object.keys(data);
    const values = Object.values(data).map(item => item.Sale_Amount);

    if (pieChartRef.current) {
      const ctx = pieChartRef.current.getContext('2d');
      chartInstances.current.pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels,
          datasets: [{
            label: 'Sale Amount',
            data: values,
            backgroundColor: [
              '#91dfe3',
              '#85d8de',
              '#79d1d8',
              '#6ccbcf',
              '#60c4c6',
              '#53bdbb',
              '#47b6b2',
              '#3baeaa',
              '#2ea7a2'],
            borderColor:  [
              '#91dfe3',
              '#85d8de',
              '#79d1d8',
              '#6ccbcf',
              '#60c4c6',
              '#53bdbb',
              '#47b6b2',
              '#3baeaa',
              '#2ea7a2'],
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
              text: 'Pie Chart'
            }
          }
        }
      });
    }
  };

  const createHistogram = (data) => {
    if (chartInstances.current.histogram) {
      chartInstances.current.histogram.destroy();
    }

    const labels = Object.keys(data);
    const values = Object.values(data);

    if (histogramRef.current) {
      const ctx = histogramRef.current.getContext('2d');
      chartInstances.current.histogram = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Sale Quantity',
            data: values,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
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
              text: 'Histogram'
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
        </div>
        <div className="chart-container">
          <canvas id="lineChart" ref={lineChartRef}></canvas>
        </div>
        <div className="chart-container">
          <canvas className='pie-chart' id="pieChart" ref={pieChartRef}></canvas>
        </div>

        <div className="chart-container">
        <canvas ref={histogramRef}></canvas>
      </div>

      </div>
    );
  };

  const handleProductClick = (product) => {
    handleClick('Product',product)
  //   const searchParams = new URLSearchParams(location.search);

  // if (searchParams.has('product')) {
  //   searchParams.set('product', product);
  // } else {
  //   searchParams.append('product', product);
  // }
  // navigate(`${location.pathname}?${searchParams.toString()}`);
  };
  const handleRegionsClick = (region) => {
    handleClick('Region',region)
  
  };
  
  const handleMonthClick = (month) => {
    handleClick('Month',month)
  };
  
  const handleYearClick = (year) => {
    handleClick('Year',year)
  };
  const handleQuarterClick = (quarter) => {
    handleClick('Quarter',quarter)
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
        <li className="navbar-logo">
            <img src={logo} alt="Logo" className="logo-image" style={{ width: '90px', height: '50px' }}  />
          </li>
          <li className="navbar-title"><h1 className='left'>Sales Dashboard</h1></li>
          <li className="dropdown">
            <p className="dropdown-toggle">Products</p>
            <div className="dropdown-content">
              <ul className="product-dropdown">
                {products.map(product => (
                  <li key={product}>
                    <button onClick={() => handleProductClick(product)}>
                      {product}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </li>
          <li className="dropdown">
            <p className="dropdown-toggle">Regions</p>
            <div className="dropdown-content">
              <ul className="region-dropdown">
                {regions.map(region => (
                  <li key={region}>
                    <button onClick={() => handleRegionsClick(region)}>
                      {region}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </li>
          <li className="dropdown">
            <p className="dropdown-toggle">Months</p>
            <div className="dropdown-content">
              <ul className="months-dropdown">
                {months.map((month, index) => (
                  <li key={index}>
                    <button onClick={() => handleMonthClick(month)}>
                      {month}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </li>
          <li className="dropdown">
            <p className="dropdown-toggle">Quarters</p>
            <div className="dropdown-content">
              <ul className="quarters-dropdown">
                {quarters.map((quarter, index) => (
                  <li key={index}> <button onClick={() => handleQuarterClick(quarter)}>
                    {quarter}
                  </button></li>
                ))}
              </ul>
            </div>
          </li>
          <li className="dropdown">
            <p className="dropdown-toggle">Years</p>
            <div className="dropdown-content">
              <ul className="years-dropdown">
                {years.map((year, index) => (
                  <li key={index}> <button onClick={() => handleYearClick(year)}>
                    {year}
                  </button></li>
                ))}
              </ul>
            </div>
          </li>
          <li>

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
        apiEndpoint="sales_dashboard"
        title={`Sales Dashboard ${chartType ? `- ${chartType}` : ''}`}
      /> */}
      {renderSalesCharts()}
    </div>
  );
}
  

export default SalesDashboard;