import React, { useEffect, useState, useRef } from 'react';
import {Link , useParams, useNavigate, useLocation } from 'react-router-dom';
import Chart from 'chart.js/auto';
import './SalesDashboard.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import logo from '../Assets/logo.jpg';

const SalesDashboard = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState(Product_ID: ["ALL"], Product_Name: ["ALL"], Region: ["ALL"], Month: ["ALL"], Year: ["ALL"], Quarter: ["ALL"], Sale_Amount: ["ALL"], Sale_Quantity: ["ALL"]);
  const { chartType } = useParams();
  const chartRefs = useRef({});
  const chartInstances = useRef({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetch('http://localhost:5000/api/salesdashboard_data')
      .then(response => response.json())
      .then(data => {
        setData(data);
        const uniqueValues = getUniqueValues(data, Product_ID, Product_Name, Region, Month, Year, Quarter, Sale_Amount, Sale_Quantity);
        setFilters({ ...filters, ...uniqueValues });
      });
  }, []);

  useEffect(() => {
    fetchDataAndCreateCharts();
  }, [location.search]);

  const fetchDataAndCreateCharts = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const filterParams = getFilterParams(urlParams, Product_ID, Product_Name, Region, Month, Year, Quarter, Sale_Amount, Sale_Quantity);
    fetchChartData(filterParams);
  };

  const fetchChartData = (filterParams) => {
    const fetchData = (url, callback) => {
      fetch(url)
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => console.error(`Failed to fetch data from ${url}:`, error));
    };

    Object.keys(chartRefs.current).forEach(chart => {
      const url = `http://localhost:5000/salesdashboard_data/${chart}?${filterParams}`;
      fetchData(url, data => createChart(chart, data));
    });
  };

  const createChart = (chart, data) => {
    if (chartInstances.current[chart]) {
      chartInstances.current[chart].destroy();
    }
    const ctx = chartRefs.current[chart].getContext('2d');
    chartInstances.current[chart] = new Chart(ctx, getChartConfig(chart, data));
  };

  const renderCharts = () => {
    return (
      <div className="charts-container">
        {Object.keys(chartRefs.current).map(chart => (
          <div key={chart} className="chart-container">
            <canvas ref={el => (chartRefs.current[chart] = el)}></canvas>
          </div>
        ))}
      </div>
    );
  };

  const handleFilterClick = (attribute, value) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set(attribute, value);
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  return (
    <div>
      <nav className="SalesDashboard-navbar">
        <ul>
          <li className="navbar-logo">
            <img src={logo} alt="Logo" className="logo-image" style={{ width: '90px', height: '50px' }} />
          </li>
          <li className="navbar-title"><h1 className='left'>SalesDashboard Dashboard</h1></li>
          
      <li className="dropdown">
        <p className="dropdown-toggle">Product_ID</p>
        <div className="dropdown-content">
          <ul className="Product_ID-dropdown">
            {'{'}filters.Product_ID.map(value => (
              <li key={value}>
                <button onClick={() => handleFilterClick('Product_ID', value)}>
                  {'{'}value{'}'}
                </button>
              </li>
            )){'}'}
          </ul>
        </div>
      </li>
    

      <li className="dropdown">
        <p className="dropdown-toggle">Product_Name</p>
        <div className="dropdown-content">
          <ul className="Product_Name-dropdown">
            {'{'}filters.Product_Name.map(value => (
              <li key={value}>
                <button onClick={() => handleFilterClick('Product_Name', value)}>
                  {'{'}value{'}'}
                </button>
              </li>
            )){'}'}
          </ul>
        </div>
      </li>
    

      <li className="dropdown">
        <p className="dropdown-toggle">Region</p>
        <div className="dropdown-content">
          <ul className="Region-dropdown">
            {'{'}filters.Region.map(value => (
              <li key={value}>
                <button onClick={() => handleFilterClick('Region', value)}>
                  {'{'}value{'}'}
                </button>
              </li>
            )){'}'}
          </ul>
        </div>
      </li>
    

      <li className="dropdown">
        <p className="dropdown-toggle">Month</p>
        <div className="dropdown-content">
          <ul className="Month-dropdown">
            {'{'}filters.Month.map(value => (
              <li key={value}>
                <button onClick={() => handleFilterClick('Month', value)}>
                  {'{'}value{'}'}
                </button>
              </li>
            )){'}'}
          </ul>
        </div>
      </li>
    

      <li className="dropdown">
        <p className="dropdown-toggle">Year</p>
        <div className="dropdown-content">
          <ul className="Year-dropdown">
            {'{'}filters.Year.map(value => (
              <li key={value}>
                <button onClick={() => handleFilterClick('Year', value)}>
                  {'{'}value{'}'}
                </button>
              </li>
            )){'}'}
          </ul>
        </div>
      </li>
    

      <li className="dropdown">
        <p className="dropdown-toggle">Quarter</p>
        <div className="dropdown-content">
          <ul className="Quarter-dropdown">
            {'{'}filters.Quarter.map(value => (
              <li key={value}>
                <button onClick={() => handleFilterClick('Quarter', value)}>
                  {'{'}value{'}'}
                </button>
              </li>
            )){'}'}
          </ul>
        </div>
      </li>
    

      <li className="dropdown">
        <p className="dropdown-toggle">Sale_Amount</p>
        <div className="dropdown-content">
          <ul className="Sale_Amount-dropdown">
            {'{'}filters.Sale_Amount.map(value => (
              <li key={value}>
                <button onClick={() => handleFilterClick('Sale_Amount', value)}>
                  {'{'}value{'}'}
                </button>
              </li>
            )){'}'}
          </ul>
        </div>
      </li>
    

      <li className="dropdown">
        <p className="dropdown-toggle">Sale_Quantity</p>
        <div className="dropdown-content">
          <ul className="Sale_Quantity-dropdown">
            {'{'}filters.Sale_Quantity.map(value => (
              <li key={value}>
                <button onClick={() => handleFilterClick('Sale_Quantity', value)}>
                  {'{'}value{'}'}
                </button>
              </li>
            )){'}'}
          </ul>
        </div>
      </li>
    
        </ul>
      </nav>
      {renderCharts()}
    </div>
  );
};

export default SalesDashboard;
