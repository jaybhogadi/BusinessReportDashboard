import React, { useEffect, useState, useRef } from 'react';
import {Link , useParams, useNavigate, useLocation } from 'react-router-dom';
import Chart from 'chart.js/auto';
import Dashboard from './Dashboard';
import './SalesDashboard.css';

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
    const product = urlParams.get('product') || 'ALL';
    const region = urlParams.get('region') || 'ALL';
    const month = urlParams.get('month') || 'ALL';
    const year = urlParams.get('year') || 'ALL';
    // const year = yearParam === 'ALL' ? yearParam : parseInt(yearParam) || 'ALL';
    const quarter = urlParams.get('quarter') || 'ALL';

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

    if (barChartRef.current) {
      fetchChartData(`http://localhost:5000/salesdashboard/barchart?product=${product}&region=${region}&month=${month}&quarter=${quarter}&year=${year}`, createBarChart);
    }

    if (lineChartRef.current) {
      fetchChartData(`http://localhost:5000/salesdashboard/linechart?product=${product}&region=${region}&month=${month}&quarter=${quarter}&year=${year}`, createLineChart);
    }

    if (pieChartRef.current) {
      fetchChartData(`http://localhost:5000/salesdashboard/piechart?product=${product}&region=${region}&month=${month}&quarter=${quarter}&year=${year}`, createPieChart);
    }

    if (histogramRef.current) {
      fetchChartData(`http://localhost:5000/salesdashboard/histogram?product=${product}&region=${region}&month=${month}&quarter=${quarter}&year=${year}`, createHistogram);
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
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              fill: true,
              tension: 0.1
            },
            {
              label: 'Sale Quantity',
              data: data.monthly_quantity,
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
              'rgba(255, 159, 64, 0.5)'
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
              'rgba(255, 159, 64, 1)'
            ],
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
          <canvas className='pie-chart' id="pieChart" ref={pieChartRef} width={50} height={50}></canvas>
        </div>

        <div className="chart-container">
        <canvas ref={histogramRef}></canvas>
      </div>

      </div>
    );
  };

  const handleProductClick = (product) => {
    handleClick('product',product)
  //   const searchParams = new URLSearchParams(location.search);

  // if (searchParams.has('product')) {
  //   searchParams.set('product', product);
  // } else {
  //   searchParams.append('product', product);
  // }
  // navigate(`${location.pathname}?${searchParams.toString()}`);
  };
  const handleRegionsClick = (region) => {
    handleClick('region',region)
  
  };
  
  const handleMonthClick = (month) => {
    handleClick('month',month)
  };
  
  const handleYearClick = (year) => {
    handleClick('year',year)
  };
  const handleQuarterClick = (quarter) => {
    handleClick('quarter',quarter)
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
      <div className="navbar-title">
          <h1>Sales Dashboard</h1>
        </div>
        <ul>
          <li className="dropdown">
            <a className="dropdown-toggle" href="#">Products</a>
            <div className="dropdown-content">
              {/* <ul className="product-dropdown">
                {products.map((product, index) => (
                  <li key={index}><Link to={`/sales_dashboard?product=${product}`}>{product}</Link></li>
                ))}
              </ul> */}
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
            <a className="dropdown-toggle" href="#">Regions</a>
            <div className="dropdown-content">
              {/* <ul className="region-dropdown">
                {regions.map((region, index) => (
                  <li key={index}><Link to={`/regions/${region.toLowerCase()}`}>{region}</Link></li>
                ))}
              </ul> */}
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
            <span className="dropdown-toggle">Months</span>
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
            <span className="dropdown-toggle">Quarters</span>
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
            <span className="dropdown-toggle">Years</span>
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
        </ul>
      </nav>
      <Dashboard
        apiEndpoint="sales_dashboard"
        title={`Sales Dashboard ${chartType ? `- ${chartType}` : ''}`}
      />
      {renderSalesCharts()}
      
    </div>
  
  );
};

export default SalesDashboard;