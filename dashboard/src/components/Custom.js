import React, { useEffect, useState, useRef , useParams } from 'react';
import { Link } from 'react-router-dom';
import Chart from 'chart.js/auto';
import axios from 'axios';
import logo from '../Assets/logo.jpg';

const CustomChart = () => {
  // const { dashboardType } = useParams();

  const [dashboardType,setDashBoardType]=useState('')
  const [data, setData] = useState([]);
  const [graphName, setGraphName] = useState('');
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [chartType, setChartType] = useState('');
  const chartContainer = useRef(null);
  const chartInstance = useRef(null);
  const [label1,setLabel]=useState([])
  const [data1,setData1]=useState([])
  const [dbname,setDbname]=useState('')

  useEffect(() => {
    const getUrlParams = () => {
      const params = new URLSearchParams(window.location.search);
      // const { dashboardType } = useParams();
      const regex = /\/custom_chart\/([^?#]+)/;
      const url = window.location.href;
      const match = url.match(regex);

      if (match) {
      setDashBoardType(match[1]);
      console.log(dashboardType); // Output: agent_commission_dashboard
      } else {
      console.log('Dashboard type not found in URL');
      }

      setGraphName(params.get('graph_name') || 'Chart');
      setChartType(params.get('graph_type') || 'scatter plot');
      setXAxis(params.get('x_axis') || 'Product_Name');
      setYAxis(params.get('y_axis') || 'Sale_Quantity');

      // if url produced contains } in y axis value
      
    };

    getUrlParams();
    console.log(xAxis)
    console.log(yAxis)
  }, []);
  useEffect(() => {
    const fetchData = async () => {

      var url_data=''
      if(dashboardType=='sales_dashboard'){
        url_data='http://localhost:5000/sales_data'
        setDbname('Sales Dashboard')
      }else if(dashboardType=='agent_commission_dashboard'){
        url_data='http://localhost:5000/agent_data'
        setDbname('Agent Commission Dashboard')
        console.log(url_data)
      }else if(dashboardType=='subscription_dashboard'){
        url_data='http://localhost:5000/subscription_data'
        setDbname('Subscription Dashboard')
      }
      let index = yAxis.indexOf('}');

// Check if the closing curly brace '}' exists in the string
      if (index !== -1) {
  // Extract the substring from the start of the string to the index of '}'
           let result = yAxis.substring(0, index);
            setYAxis(result)
    };
      try {
        const response = await axios.get(url_data, {
          params: {
            x_axis: xAxis,
            y_axis: yAxis
          }
        });
        if(xAxis==='Month'){
        const jsonData=response.data
        const dataArray = Object.keys(jsonData).map(key => ({ month: key, value: jsonData[key] }));

// Sort the array by months
        dataArray.sort((a, b) => {
  // Assuming month names are in English and in order from January to December
        const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
          return months.indexOf(a.month) - months.indexOf(b.month);
});

// If you need to convert back to JSON object
      const sortedJsonData = {};
      dataArray.forEach(item => {
        sortedJsonData[item.month] = item.value;
          });

       console.log(sortedJsonData);
       const label1 = Object.keys(sortedJsonData);
       const data = Object.values(sortedJsonData);
       console.log(label1);
       console.log(data);
       setLabel(label1);
       setData1(data);
}else{       
 const label1 = Object.keys(response.data);
        const data = Object.values(response.data);
        console.log(label1);
        console.log(data);
        setLabel(label1);
        setData1(data);
}
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Only fetch data when xAxis and yAxis are updated
    if (xAxis && yAxis) {
      fetchData();
    }
  }, [xAxis, yAxis]);


  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // Replace 'http://localhost:5000' with your Flask server URL
  //       const response = await axios.get('http://localhost:5000/sales_data', {
  //         params: {
  //           x_axis: xAxis, // Replace with your desired x_axis value
  //           y_axis: yAxis // Replace with your desired y_axis value
  //         }
  //       });
  //       const label1 = Object.keys(response.data);
  //       const data = Object.values(response.data);
  //       console.log(label1)
  //       console.log(data)
  //       setLabel(label1)
  //       setData1(data)
  //   //     setChartData({
  //   //       labels,
  //   //       datasets: [
  //   //         {
  //   //           label: 'Sales Amount',
  //   //           data,
  //   //           backgroundColor: 'rgba(75, 192, 192, 0.6)',
  //   //         },
  //   //       ],
  //   //     });
  //   //     setLoading(false);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };
  //   fetchData();
  // }, [xAxis,yAxis]);


  
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res=await fetch('')
  //       const response = await fetch('http://localhost:5000/api/sales_data-csv');
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch data');
  //       }
  //       // try {
  //       //     const res = await axios.post('http://localhost:5000/custom', { 'x_axis':xAxis,'y_axis': yAxis });
  //       //     console.log(res);
  //       //     // setData(data);
  //       //     // const link = res.data;
  //       //     // window.location.href = link;
  //       //   } catch (error) {
  //       //     console.error("Error:", error);
  //       //   }
    
  //       const data = await response.json();
  //       setData(data);
        
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    if (label1 && chartType && xAxis && yAxis) {
      destroyChart();
      createChart();
    }
  }, [label1, chartType, xAxis, yAxis]);

  const destroyChart = () => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
  };

  const createChart = () => {
    const ctx = chartContainer.current.getContext('2d');
    // chartContainer.current.width = 100; // Example: Set width programmatically
    // chartContainer.current.height = 100;
    const filteredData = data.map(item => ({
      x: item[xAxis],
      y: item[yAxis]
    }));

    switch (chartType) {
      // case 'bar chart':
      // case 'Bar Chart':
      case 'Bar':
        case 'Bar Chart':
          case 'bar':
            case 'bar chart':
              case 'Bar chart':
        console.log("HII")
        chartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: label1, // Use your labels array here
            datasets: [{
              label: graphName,
              data: data1, // Use your data array here
              backgroundColor: '#00695C',
              borderColor: '#00695C',
              borderWidth: 1,
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              // title: {
              //   display: true,
              //   text: graphName,
              //   margin:{
              //     bottom: 100,
              //   },
              //   padding: {
              //     top: 10,  // Padding at the top
              //     bottom: 10,  // Padding at the bottom
              //     left: 0,  // Padding on the left
              //     right: 0  // Padding on the right
              //   }
              // }
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
        break;
      case 'Line Chart':
        case 'line':
          case 'Line':
          case 'Line chart':
            case 'line chart':
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: label1, // Use your labels array here if applicable
            datasets: [{
              label: graphName,
              data: data1, // Use your data array here if applicable
              borderColor: '#00695C',
              // backgroundColor: '#d8f1f2',
              // fill: true,
              tension: 0.1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',

              },
              // title: {
              //   display: true,
              //   text: graphName,
              //   font: {
              //     size: 14,
              //     weight: 'bold'
              //   }
              // }
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
        break;
      case 'Pie Chart':
        chartInstance.current = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: label1, // Use your labels array here if applicable
            datasets: [{
              label: graphName,
              data: data1, // Use your data array here if applicable
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
                '#B2DFDB'],     
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
                  '#B2DFDB'],
                  orderWidth: 1,
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              // title: {
              //   display: true,
              //   text: graphName,
              //   font: {
              //     size: 14,
              //     weight: 'bold'
              //   }
              // }
            }
          }
        });
        break;
      case 'scatter plot':
        chartInstance.current = new Chart(ctx, {
          type: 'scatter',
          data: {
            datasets: [{
              label: graphName,
              data: data1.map((value, index) => ({ x: label1[index], y: value })),
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
                '#B2DFDB'],
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
                '#B2DFDB'],
              pointRadius: 6,
              pointHoverRadius: 8,
              fill: false
            }]
          },
          options: {
            responsive: true,
            plugins: {
              // title: {
              //   display: true,
              //   text: graphName,
              //   font: {
              //     size: 14,
              //     weight: 'bold'
              //   }
              // }
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
        break;
      default:
        console.error('Unsupported chart type:', chartType);
        break;
    }
  }    
  return (
    <div>
      <nav className="sales-navbar">
        <ul>
        <li className="navbar-logo">
            <img src={logo} alt="Logo" className="logo-image" style={{ width: '90px', height: '50px' }}  />
          </li>
          <li className="navbar-title"><h1 className='left'>{dbname}</h1></li>
          
          
          
          
           
          
          <li>

          </li>
          
          <Link to="/home" style={{ marginRight:'20px' }}>
              <i className="fas fa-home icon"></i>
            </Link>
        </ul>
      </nav>


            {/* <h1 style={{ textAlign: 'center' }}>{graphName}</h1> */}

    <div style={{ width: '800px', height: '500px',alignItems:'center',alignContent:'center',display:'flex',flexDirection: 'column', justifyContent: 'center', alignItems: 'center',marginLeft:'200px' }} >
      <canvas ref={chartContainer}  style={{ alignSelf: 'center' }}
    ></canvas>
    </div>
    </div>
   


  );
};

export default CustomChart;