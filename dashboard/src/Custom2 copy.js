//        http://localhost:3000/custom_chart2/sales_dashboard?graph_name1=None&graph_type1=line%20chart&x_axis1=Month&y_axis1=Sale_Quantity&graph_name2=None&graph_type2=line%20chart&x_axis2=Month&y_axis2=Sale_Quantity&graph_name3=HI&graph_type3=bar&x_axis3=Month&y_axis3=Sale_Quantity
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Chart from 'chart.js/auto';
import axios from 'axios';
import logo from './Assets/logo.jpg';
import jsondata from './Customgraphs'

const CustomChart2 = () => {
  const [dashboardType, setDashBoardType] = useState('');
  const [graphConfigs, setGraphConfigs] = useState([]);
  const [dataSets, setDataSets] = useState([]);
  const [dbname, setDbname] = useState('');
  const chartRefs = useRef([]);
  const chartInstances = useRef([]);

  useEffect(() => {
    const getUrlParams = () => {
      const params = new URLSearchParams(window.location.search);
      const regex = /\/custom_chart2\/([^?#]+)/;
      const url = window.location.href;
      const match = url.match(regex);

      if (match) {
        setDashBoardType(match[1]);
        console.log("Dashboard name is", match[1]); // Log the dashboard name correctly
      } else {
        console.log('Dashboard type not found in URL');
      }

      // const graphs = [];
      // let i = 1;
      // while (params.get(`graph_name${i}`)) {
      //   graphs.push({
      //     graphName: params.get(`graph_name${i}`) || `Chart ${i}`,
      //     graphType: params.get(`graph_type${i}`) || 'line',
      //     xAxis: params.get(`x_axis${i}`) || 'Product_Name',
      //     yAxis: params.get(`y_axis${i}`) || 'Sale_Quantity'
      //   });

      //   i++;
      // }
      // console.log("Graphs",graphs);
      // setGraphConfigs(graphs);
    };

    getUrlParams();
  }, []);

  useEffect(() => {
    // Fetch graph configurations from Customgraphs.json
    const fetchGraphConfigs = async () => {
      try {
        // const response = await axios.get('/Customgraphs.json');
        const configData = jsondata;

        // Log the fetched data for debugging
        console.log("Fetched Graph Configurations:", configData);

        // Update the graph configurations state
        setGraphConfigs(configData.graphs);
      } catch (error) {
        console.error('Error fetching graph configurations:', error);
      }
    };

    fetchGraphConfigs();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      let url_data = '';

      switch (dashboardType) {
        case 'sales_dashboard':
          url_data = 'http://localhost:5000/sales_data';
          setDbname('Sales Dashboard');
          console.log("Heree")
          break;
        case 'agent_commission_dashboard':
          url_data = 'http://localhost:5000/agent_data';
          setDbname('Agent Commission Dashboard');
          break;
        case 'subscription_dashboard':
          url_data = 'http://localhost:5000/subscription_data';
          setDbname('Subscription Dashboard');
          break;
        default:
          console.error('Unknown dashboard type');
          return;
      }

      try {
        const dataPromises = graphConfigs.map(config => axios.get(url_data, {
          params: {
            x_axis: config.xAxis,
            y_axis: config.yAxis
          }
        }));
        const responses = await Promise.all(dataPromises);

        const dataSets = responses.map((response, index) => ({
          labels: Object.keys(response.data),
          data: Object.values(response.data),
          ...graphConfigs[index]
        }));

        setDataSets(dataSets);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (graphConfigs.length > 0) {
      fetchData();
    }
  }, [graphConfigs, dashboardType]);

  useEffect(() => {
    if (dataSets.length > 0) {
      destroyCharts();
      createCharts();
    }
  }, [dataSets]);

  const destroyCharts = () => {
    chartInstances.current.forEach(chartInstance => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    });
    chartInstances.current = [];
  };

  const normalizeChartType = (type) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("bar")) return "bar";
    if (lowerType.includes("line")) return "line";
    if (lowerType.includes("scatter")) return "scatter";
    return type;
  };

  const createCharts = () => {
    dataSets.forEach((dataset, index) => {
      const ctx = chartRefs.current[index].getContext('2d');
      const chartType = normalizeChartType(dataset.graphType);

      const newChart = new Chart(ctx, {
        type: chartType,
        data: {
          labels: dataset.labels,
          datasets: [{
            label: dataset.graphName,
            data: dataset.data,
            backgroundColor: '#00695C',
            borderColor: '#00695C',
            borderWidth: 1,
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top'
            }
          },
          scales: {
            x: {
              type: 'category',
              title: {
                display: true,
                text: dataset.xAxis
              }
            },
            y: {
              title: {
                display: true,
                text: dataset.yAxis
              }
            }
          }
        }
      });

      chartInstances.current[index] = newChart;
    });
  };

  return (
    <div>
      <nav className="sales-navbar">
        <ul>
          <li className="navbar-logo">
            <img src={logo} alt="Logo" className="logo-image" style={{ width: '90px', height: '50px' }} />
          </li>
          <li className="navbar-title"><h1 className='left'>{dbname}</h1></li>
          <Link to="/home" style={{ marginRight: '20px' }}>
            <i className="fas fa-home icon"></i>
          </Link>
        </ul>
      </nav>
    {/* <div>{graphConfigs}</div> */}
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        {graphConfigs.map((_, index) => (
          <div key={index} style={{ width: '700px', height: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <canvas ref={el => chartRefs.current[index] = el}></canvas>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomChart2;
