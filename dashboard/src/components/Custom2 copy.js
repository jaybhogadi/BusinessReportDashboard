import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Chart from 'chart.js/auto';
import axios from 'axios';
import logo from '../Assets/logo.jpg';

const CustomChart2 = () => {
  const [dashboardType, setDashBoardType] = useState('');
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);

  const [graphName, setGraphName] = useState('');
  const [graphName2, setGraphName2] = useState('');
//   const [graphNames, setGraphNames] = useState(['']);
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [xAxis2, setXAxis2] = useState(''); // For second chart
  const [yAxis2, setYAxis2] = useState(''); // For second chart
  const [xAxis3, setXAxis3] = useState('');
  const [yAxis3, setYAxis3] = useState('');
  const [chartType, setChartType] = useState('');
  const [chartType2, setChartType2] = useState('');

  const chartContainer1 = useRef(null);
  const chartInstance1 = useRef(null);
  const chartContainer2 = useRef(null);
//   const chartContainer3 = useRef(null);
  const chartInstance2 = useRef(null);
//   const chartInstance3 = useRef(null);
  const [label1, setLabel1] = useState([]);
  const [label2, setLabel2] = useState([]);
  const [label3, setLabel3] = useState([]);
  const [dbname, setDbname] = useState('');

  useEffect(() => {
    const getUrlParams = () => {
      const params = new URLSearchParams(window.location.search);
      const regex = /\/custom_chart2\/([^?#]+)/;
      const url = window.location.href;
      const match = url.match(regex);

      if (match) {
        setDashBoardType(match[1]);
      } else {
        console.log('Dashboard type not found in URL');
      }
    //   const gname=params.get('graph_name') || 'Chart';
    //   const gname2=params.get('graph_name2') || 'Chart'
    //   setGraphNames([...graphNames, gname]);
    //   setGraphNames([...graphNames, gname2]);
      setGraphName(params.get('graph_name') || 'Chart');
      setChartType(params.get('graph_type') || 'scatter plot');
      setGraphName2(params.get('graph_name2') || 'Chart');
      setChartType2(params.get('graph_type2') || 'line');
      setXAxis(params.get('x_axis') || 'Product_Name');
      setYAxis(params.get('y_axis') || 'Sale_Quantity');
      setXAxis2(params.get('x_axis2') || 'Product_Name'); // Set second chart x-axis
      setYAxis2(params.get('y_axis2') || 'Sale_Quantity'); // Set second chart y-axis
      setXAxis3(params.get('x_axis3') || 'Product_Name');
      setYAxis3(params.get('y_axis3') || 'Sale_Quantity');
    };

    getUrlParams();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      let url_data = '';

      if (dashboardType === 'sales_dashboard') {
        url_data = 'http://localhost:5000/sales_data';
        setDbname('Sales Dashboard');
      } else if (dashboardType === 'agent_commission_dashboard') {
        url_data = 'http://localhost:5000/agent_data';
        setDbname('Agent Commission Dashboard');
      } else if (dashboardType === 'subscription_dashboard') {
        url_data = 'http://localhost:5000/subscription_data';
        setDbname('Subscription Dashboard');
      }

      try {
        console.log(url_data)
        const response1 = await axios.get(url_data, {
          params: {
            x_axis: xAxis,
            y_axis: yAxis
          }
        });
        const labelData1 = Object.keys(response1.data);
        const dataValues1 = Object.values(response1.data);
        setLabel1(labelData1);
        setData1(dataValues1);
        console.log(labelData1)
        console.log(dataValues1)

        const response2 = await axios.get(url_data, {
          params: {
            x_axis: xAxis2, // Fetch data for second chart
            y_axis: yAxis2
          }
        });

        // const labelData1 = Object.keys(response1.data);
        // const dataValues1 = Object.values(response1.data);
        // setLabel1(labelData1);
        // setData1(dataValues1);
        // console.log(labelData1)
        // console.log(dataValues1)

        const labelData2 = Object.keys(response2.data);
        const dataValues2 = Object.values(response2.data);
        setLabel2(labelData2);
        setData2(dataValues2);

        const response3 = await axios.get(url_data, {
            params: {
              x_axis: xAxis3, // Fetch data for second chart
              y_axis: yAxis3
            }
          });
          const labelData3 = Object.keys(response3.data);
          const dataValues3 = Object.values(response3.data);
          setLabel3(labelData3);
          setData3(dataValues3);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Fetch data when xAxis, yAxis, xAxis2, or yAxis2 are updated
    if (xAxis || yAxis ||( xAxis2 && yAxis2)) {
      fetchData();
    }
  }, [xAxis, yAxis, xAxis2, yAxis2]);

  useEffect(() => {
    if (label1.length > 0 && label2.length > 0 && chartType && xAxis && yAxis && xAxis2 && yAxis2) {
      destroyChart();
      createCharts();
    }
  }, [label1, label2, chartType, xAxis, yAxis, xAxis2, yAxis2]);

  const destroyChart = () => {
    if (chartInstance1.current) {
      chartInstance1.current.destroy();
    }
    if (chartInstance2.current) {
      chartInstance2.current.destroy();
    }
    // if (chartInstance3.current) {
    //     chartInstance3.current.destroy();
    //   }
  };

  const createCharts = () => {
    const ctx1 = chartContainer1.current.getContext('2d');
    const ctx2 = chartContainer2.current.getContext('2d');
    // const ctx3 = chartContainer3.current.getContext('2d');
    if (chartType === "Bar" || chartType === "Bar Chart" || chartType === "Bar chart") {
        setChartType("bar")
    }
    if (chartType === "Line" || chartType === "Line Chart" || chartType === "Line chart") {
        setChartType("line")
    }
    if (chartType === "Scatter" || chartType === "Scatter plot" || chartType === "scatter") {
        setChartType("scatter")
    }
    if (chartType2 === "Bar" || chartType2 === "Bar Chart" || chartType2 === "Bar chart") {
        setChartType2("bar")
    }
    if (chartType2 === "Line" || chartType2 === "Line Chart" || chartType2 === "Line chart") {
        setChartType2("line")
    }
    if (chartType2 === "Scatter" || chartType2 === "Scatter plot" || chartType2 === "scatter") {
        setChartType2("scatter")
    }
    


    // First chart (Line Chart)
    chartInstance1.current = new Chart(ctx1, {
      type: "line",
      data: {
        labels: label1,
        datasets: [{
          label: graphName,
          data: data1,
          borderColor: '#00695C',
          tension: 0.1
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
              text: xAxis
            }
          },
          y: {
            title: {
              display: true,
              text: yAxis
            }
          }
        }
      }
    });

    // Second chart (Bar Chart)
    chartInstance2.current = new Chart(ctx2, {
      type: chartType2,
      data: {
        labels: label2,
        datasets: [{
          label: graphName2,
          data: data2,
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
              text: xAxis2
            }
          },
          y: {
            title: {
              display: true,
              text: yAxis2
            }
          }
        }
      }
    });

    // chartInstance3.current = new Chart(ctx3, {
    //     type: 'line',
    //     data: {
    //       labels: label1,
    //       datasets: [{
    //         label: graphName,
    //         data: data3,
    //         borderColor: '#00695C',
    //         tension: 0.1
    //       }]
    //     },
    //     options: {
    //       responsive: true,
    //       plugins: {
    //         legend: {
    //           position: 'top'
    //         }
    //       },
    //       scales: {
    //         x: {
    //           type: 'category',
    //           title: {
    //             display: true,
    //             text: xAxis3
    //           }
    //         },
    //         y: {
    //           title: {
    //             display: true,
    //             text: yAxis3
    //           }
    //         }
    //       }
    //     }
    //   });
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

      <div style={{ display: 'flex', justifyContent: 'center' ,flexWrap: 'wrap'}}>
      <div style={{ width: '700px', height: '500px',alignItems:'center',alignContent:'center',display:'flex',flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}} >
          <canvas ref={chartContainer1}></canvas>
        </div>
        <div style={{ width: '700px', height: '500px',alignItems:'center',alignContent:'center',display:'flex',flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} >
          <canvas ref={chartContainer2}></canvas>

        </div>
        {/* <div style={{ width: '700px', height: '500px',alignItems:'center',alignContent:'center',display:'flex',flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} >
          <canvas ref={chartContainer3}></canvas>
          
        </div> */}
      </div>
    </div>
  );
};

export default CustomChart2;

// 127.0.0.1:3000/custom_chart2/sales_dashboard?graph_name=None&graph_type=line%20chart&x_axis=Month&y_axis=Sale_Quantity