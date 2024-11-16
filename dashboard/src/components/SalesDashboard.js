import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import Chart from 'chart.js/auto';
import './SalesDashboard.css';
import logo from '../Assets/logo.jpg';

import { saveAs } from 'file-saver';

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
    // Check if data exists in local storage
    const storedData = localStorage.getItem('sales_dashboard');
    localStorage.setItem("dashboard", JSON.stringify('sales_dashboard'));
    if (storedData) {
      console.log("loaded from local storage....")
      setSalesData(JSON.parse(storedData));

    } else {
      fetchData();
    }

    // Extract unique Product_IDs, Regions, Months, Years, and Quarters
    // const uniqueProducts = [...new Set(salesData.map(item => item.Product_Name))];
    // const uniqueRegions = [...new Set(salesData.map(item => item.Region))];
    // const uniqueMonths = [...new Set(salesData.map(item => item.Month))];
    // const uniqueYears = [...new Set(salesData.map(item => item.Year))].sort((a, b) => a - b).map(year => year.toString());
    // const uniqueQuarters = [...new Set(salesData.map(item => item.Quarter))];

    // setProducts(['ALL', ...uniqueProducts]);
    // setRegions(['ALL', 'North', 'South', 'East', 'West']);
    // setMonths(['ALL', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
    // setYears(['ALL', ...uniqueYears]);
    // setQuarters(['ALL', 'Q1', 'Q2', 'Q3', 'Q4']);
  }, []);

  const fetchData = async() => {
    // Fetch the CSV data as JSON from the backend
    fetch('http://localhost:5000/api/sales_data-csv')
      .then(response => response.json())
      .then(data => {
        setSalesData(data);
        localStorage.setItem('sales_dashboard', JSON.stringify(data));
        // const jsonBlob = new Blob([JSON.stringify(JSON.stringify(data), null, 2)], { type: 'application/json' });

// Save Blob as JSON file using FileSaver.js
// saveAs(jsonBlob, 'data.json');
      })
      .catch(error => {
        console.error('Failed to fetch data:', error);
      });
  };
  useEffect(()=>{
    const uniqueProducts = [...new Set(salesData.map(item => item.Product_Name))];
    const uniqueRegions = [...new Set(salesData.map(item => item.Region))];
    const uniqueMonths = [...new Set(salesData.map(item => item.Month))];
    const uniqueYears = [...new Set(salesData.map(item => item.Year))].sort((a, b) => a - b).map(year => year.toString());
    const uniqueQuarters = [...new Set(salesData.map(item => item.Quarter))];

    setProducts(['ALL', ...uniqueProducts]);
    setRegions(['ALL', 'North', 'South', 'East', 'West']);
    setMonths(['ALL', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
    setYears(['ALL', ...uniqueYears]);
    setQuarters(['ALL', 'Q1', 'Q2', 'Q3', 'Q4']);
  },[salesData])

  useEffect(() => {
    fetchDataAndCreateCharts();
  }, [location.search]);

  const fetchDataAndCreateCharts = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const product = urlParams.get('product') || 'ALL';
    const region = urlParams.get('region') || 'ALL';
    const month = urlParams.get('month') || 'ALL';
    const year = urlParams.get('year') || 'ALL';
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
            backgroundColor: '#00695C',
            borderColor: '#00695C',
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
              text: 'Bar Chart',
              margin: {
                bottom: 100,
              },
              padding: {
                top: 10,
                bottom: 10,
                left: 0,
                right: 0
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
              borderColor: '#00695C',
              tension: 0.1
            },
            {
              label: 'Sale Quantity',
              data: data.monthly_quantity,
              borderColor: '#4DB6AC',
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
            },
            datalabels: {
              display: false
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
            label: 'Total Commission',
            data: values,
            backgroundColor: [
              '#004D40',
              '#009688',
              '#00695C',
              '#00796B',
              '#00897B',
              '#009688',
              '#26A69A',
              '#4DB6AC',
              '#80CBC4',
              '#009688',
              '#B2DFDB'
            ],
            borderColor: [
              '#004D40',
              '#009688',
              '#00695C',
              '#00796B',
              '#00897B',
              '#009688',
              '#26A69A',
              '#4DB6AC',
              '#80CBC4',
              '#009688',
              '#B2DFDB'
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
            tooltip: false,
            title: {
              display: true,
              text: 'Agent Commissions Pie Chart',
            },
            datalabels: {
              display: true,
              color: '#fff',
              font: {
                weight: 'bold'
              },
              formatter: (value, ctx) => {
                let sum = 0;
                let dataArr = ctx.chart.data.datasets[0].data;
                dataArr.map(data => {
                  sum += data;
                });
                let percentage = (value * 100 / sum).toFixed(2) + "%";
                return percentage;
              },
              anchor: 'end',
              align: 'start',
              offset: 10,
              padding: {
                left: 5,
                right: 5,
                top: 5,
                bottom: 5
              }
            }
          },
          layout: {
            padding: 0
          },
          aspectRatio: 1,
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
            backgroundColor: '#00695C',
            borderColor: '#00695C',
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
            },
            datalabels: {
              display: false
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
    handleClick('product', product)
  };

  const handleRegionsClick = (region) => {
    handleClick('region', region)
  };

  const handleMonthClick = (month) => {
    handleClick('month', month)
  };

  const handleYearClick = (year) => {
    handleClick('year', year)
  };

  const handleQuarterClick = (quarter) => {
    handleClick('quarter', quarter)
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

  const spinnerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  };

  const spinnerIconStyle = {
    fontSize: '3em',
    color: '#3498db',
    animation: 'spin 1s infinite linear',
  };

  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;



  return (
    <div>
      <style>
        {keyframes}
      </style>

      <nav className="sales-navbar">
        <ul>
          <li className="navbar-logo">
            <img src={logo} alt="Logo" className="logo-image" style={{ width: '90px', height: '50px' }} />
          </li>
          <li className="navbar-title"><h1 className='left'>Sales Dashboard</h1></li>
          <li className="dropdown">
            <p className="dropdown-toggle">Products
              <i className="fas fa-chevron-down" style={{ paddingLeft: '8px', fontSize: '0.8em' }}></i>
            </p>
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
            <p className="dropdown-toggle">Regions
              <i className="fas fa-chevron-down" style={{ paddingLeft: '8px', fontSize: '0.8em' }}></i>
            </p>
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
            <p className="dropdown-toggle">Months
              <i className="fas fa-chevron-down" style={{ paddingLeft: '8px', fontSize: '0.8em' }}></i>
            </p>
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
            <p className="dropdown-toggle">Quarters
              <i className="fas fa-chevron-down" style={{ paddingLeft: '8px', fontSize: '0.8em' }}></i>
            </p>
            <div className="dropdown-content">
              <ul className="quarters-dropdown">
                {quarters.map((quarter, index) => (
                  <li key={index}>
                    <button onClick={() => handleQuarterClick(quarter)}>
                      {quarter}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </li>
          <li className="dropdown">
            <p className="dropdown-toggle">Years
              <i className="fas fa-chevron-down" style={{ fontSize: '0.8em' }}></i>
            </p>
            <div className="dropdown-content">
              <ul className="years-dropdown">
                {years.map((year, index) => (
                  <li key={index}>
                    <button onClick={() => handleYearClick(year)}>
                      {year}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </li>
          <li>
            <Link to="/home" style={{ marginLeft: '50px', marginRight: '20px' }}>
              <i className="fas fa-home icon"></i>
            </Link>
          </li>
        </ul>
      </nav>
      
      {renderSalesCharts()}
    </div>
  );
}

export default SalesDashboard;