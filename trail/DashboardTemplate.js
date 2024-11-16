import React, { useEffect, useState, useRef } from 'react';
import {Link , useParams, useNavigate, useLocation } from 'react-router-dom';
import Chart from 'chart.js/auto';
import './{DASHBOARD_NAME}.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import logo from '../Assets/logo.jpg';

const {DASHBOARD_NAME} = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({FILTER_STATES});
  const { chartType } = useParams();
  const chartRefs = useRef({});
  const chartInstances = useRef({});
  const navigate = useNavigate();
  const location = useLocation();

  const getUniqueValues = (data, ...columns) => {
    const uniqueValues = {};
  
    columns.forEach(column => {
      uniqueValues[column] = [...new Set(data.map(item => item[column]))];
    });
  
    return uniqueValues;
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/{API_ENDPOINT}')
      .then(response => response.json())
      .then(data => {
        setData(data);
        const uniqueValues = getUniqueValues(data, {COLUMN_NAMES});
        setFilters({ ...filters, ...uniqueValues });
      });
  }, []);

  useEffect(() => {
    fetchDataAndCreateCharts();
  }, [location.search]);

  const fetchDataAndCreateCharts = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const filterParams = getFilterParams(urlParams, {COLUMN_NAMES});
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
      const url = `http://localhost:5000/{API_ENDPOINT}/${chart}?${filterParams}`;
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
      <nav className="{DASHBOARD_NAME}-navbar">
        <ul>
          <li className="navbar-logo">
            <img src={logo} alt="Logo" className="logo-image" style={{ width: '90px', height: '50px' }} />
          </li>
          <li className="navbar-title"><h1 className='left'>{DASHBOARD_NAME} Dashboard</h1></li>
          {FILTER_DROPDOWNS}
        </ul>
      </nav>
      {renderCharts()}
    </div>
  );
};

export default {DASHBOARD_NAME};
