import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
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
  const { chartType } = useParams(); // Fetch the route parameter for chart type
  const barChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const histogramRef = useRef(null);
  const chartInstances = useRef({});

  useEffect(() => {
    // Fetch the CSV data as JSON from the backend
    fetch('http://localhost:5000/api/data-csv')
      .then(response => response.json())
      .then(data => {
        setSalesData(data);
        
        // Extract unique Product_IDs, Regions, Months, Years, and Quarters
        const uniqueProducts = [...new Set(data.map(item => item.Product_Name))];
        const uniqueRegions = [...new Set(data.map(item => item.Region))];
        const uniqueMonths = [...new Set(data.map(item => item.Month))];
        const uniqueYears = [...new Set(data.map(item => item.Year))];
        const uniqueQuarters = [...new Set(data.map(item => item.Quarter))];

        setProducts(['ALL', ...uniqueProducts]);
        setRegions(['ALL', ...uniqueRegions]);
        setMonths(['ALL', ...uniqueMonths]);
        setYears(['ALL', ...uniqueYears]);
        setQuarters(['ALL', ...uniqueQuarters]);

        createCharts(data); // Create charts after data is fetched
      });
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup chart instances on component unmount
      Object.values(chartInstances.current).forEach(chart => chart.destroy());
    };
  }, []);

  const createCharts = (data) => {
    if (chartInstances.current.barChart) {
      chartInstances.current.barChart.destroy();
    }
    if (chartInstances.current.lineChart) {
      chartInstances.current.lineChart.destroy();
    }
    if (chartInstances.current.pieChart) {
      chartInstances.current.pieChart.destroy();
    }
    if (chartInstances.current.histogram) {
      chartInstances.current.histogram.destroy();
    }

    chartInstances.current.barChart = createBarChart(barChartRef.current.getContext('2d'), data);
    chartInstances.current.lineChart = createLineChart(lineChartRef.current.getContext('2d'), data);
    chartInstances.current.pieChart = createPieChart(pieChartRef.current.getContext('2d'), data);
    chartInstances.current.histogram = createHistogram(histogramRef.current.getContext('2d'), data);
  };

  const createBarChart = (ctx, data) => {
    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(item => `${item.Month} ${item.Year}`),
        datasets: [{
          label: 'Sale Amount',
          data: data.map(item => item.Sale_Amount),
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

  const createLineChart = (ctx, data) => {
    return new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(item => `${item.Month} ${item.Year}`),
        datasets: [{
          label: 'Sale Quantity',
          data: data.map(item => item.Sale_Quantity),
          borderColor: 'rgba(255, 99, 132, 1)',
          tension: 0.1
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
            text: 'Line Chart'
          }
        }
      }
    });
  };

  const createPieChart = (ctx, data) => {
    return new Chart(ctx, {
      type: 'pie',
      data: {
        labels: data.map(item => item.Product_Name),
        datasets: [{
          label: 'Sale Amount',
          data: data.map(item => item.Sale_Amount),
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)'
          ],
          hoverOffset: 4
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
  };

  const createHistogram = (ctx, data) => {
    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(item => `${item.Quarter} ${item.Year}`),
        datasets: [{
          label: 'Sale Amount',
          data: data.map(item => item.Sale_Amount),
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
  };

  const renderSalesCharts = (data) => {
    // Implement logic to render sales-specific charts based on 'data'
    return (
      <div>
        {/* <p>Sales Data:</p>
        <pre>{JSON.stringify(data, null, 2)}</pre> */}
        <div className="chart-container">
          <canvas id="barChart" ref={barChartRef}></canvas>
        </div>
        <div className="chart-container">
          <canvas id="lineChart" ref={lineChartRef}></canvas>
        </div>
        <div className="chart-container">
          <canvas id="pieChart" ref={pieChartRef}></canvas>
        </div>
        <div className="chart-container">
          <canvas id="histogram" ref={histogramRef}></canvas>
        </div>
      </div>
    );
  };

  return (
    <div>
      <nav className="sales-navbar">
        <ul>
          <li className="dropdown">
            <a className="dropdown-toggle" href="#">Products</a>
            <div className="dropdown-content">
              <ul className="product-dropdown">
                {products.map((product, index) => (
                  <li key={index}><Link to={`/products/${product}`}>{product}</Link></li>
                ))}
              </ul>
            </div>
          </li>
          <li className="dropdown">
            <a className="dropdown-toggle" href="#">Regions</a>
            <div className="dropdown-content">
              <ul className="region-dropdown">
                {regions.map((region, index) => (
                  <li key={index}><Link to={`/regions/${region.toLowerCase()}`}>{region}</Link></li>
                ))}
              </ul>
            </div>
          </li>
          <li className="dropdown">
            <span className="dropdown-toggle">Months</span>
            <div className="dropdown-content">
              <ul className="months-dropdown">
                {months.map((month, index) => (
                  <li key={index}><Link to={`/sales/monthly/${month.toLowerCase()}`}>{month}</Link></li>
                ))}
              </ul>
            </div>
          </li>
          <li className="dropdown">
            <span className="dropdown-toggle">Quarters</span>
            <div className="dropdown-content">
              <ul className="quarters-dropdown">
                {quarters.map((quarter, index) => (
                  <li key={index}><Link to={`/sales/quarter/${quarter.toLowerCase()}`}>{quarter}</Link></li>
                ))}
              </ul>
            </div>
          </li>
          <li className="dropdown">
            <span className="dropdown-toggle">Years</span>
            <div className="dropdown-content">
              <ul className="years-dropdown">
                {years.map((year, index) => (
                  <li key={index}><Link to={`/sales/${year}`}>{year}</Link></li>
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
      {renderSalesCharts(salesData)}
    </div>
  );
};

export default SalesDashboard;
