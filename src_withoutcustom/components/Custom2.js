// import React, { useEffect, useState, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import Chart from 'chart.js/auto';
// import axios from 'axios';
// import logo from '../Assets/logo.jpg';

// const CustomChart2 = () => {
//   let maximumParams = 10;
//   const [dashboardType, setDashBoardType] = useState('');
//   const [graphNames, setGraphNames] = useState([]);
//   const [xAxises, setXAxises] = useState([]);
//   const [yAxises, setYAxises] = useState([]);
//   const [chartTypes,setChartTypes]=useState([])
//   var initialLabels=[]
//   const [labels, setLabels] = useState(Array.from({ length: maximumParams }, () => initialLabels));
//   const [dataValues, setDataValues] = useState(Array.from({ length: maximumParams }, () => initialLabels));
// //   const chartContainers = useRef(Array.from({ length: maximumParams }, () => (null)));
// //   const chartInstances = useRef(Array.from({ length: maximumParams }, () => ({ current: null })));
//   const [dbname, setDbname] = useState('');
//   const chartContainers = useRef(Array.from({ length: maximumParams }, () => useRef(null)));
//   const chartInstances = useRef(Array.from({ length: maximumParams }, () => useRef(null)));


//   useEffect(() => {
//     const getUrlParams = () => {
//       const params = new URLSearchParams(window.location.search);
//       const regex = /\/custom_chart2\/([^?#]+)/;
//       const url = window.location.href;
//       const match = url.match(regex);

//       if (match) {
//         setDashBoardType(match[1]);
//       } else {
//         console.log('Dashboard type not found in URL');
//       }

//       const prefix = 'graph_name';
//       setGraphNames([]);
//       params.forEach((value, key) => {
//       if (key.startsWith(prefix)) {
//             maximumParams+=1
//             var gname=params.get(key) || 'Chart';
//             setGraphNames(prevGraphNames => [...prevGraphNames, gname]);
//         }
//         });

//         const prefix2 = 'x_axis';
//         setXAxises([])
//         params.forEach((value, key) => {
//         if (key.toLowerCase().startsWith(prefix2)) {
//               var x_axis=params.get(key) || 'Chart';
//               setXAxises(xAxises => [...xAxises, x_axis]);
//           }
//           });
//           // console.log(maximumParams)
//           console.log(xAxises)

//           const prefix3 = 'y_axis';
//           setYAxises([]);
//           params.forEach((value, key) => {
//           if (key.startsWith(prefix3)) {
//                 var y_axis=params.get(key) || 'Chart';
//                 setYAxises(yAxises => [...yAxises, y_axis]);
//             }
//             });
//             const prefix4 = 'graph_type';
//           setChartTypes([]);
//           params.forEach((value, key) => {
//           if (key.toLowerCase().startsWith(prefix4)) {
//                 var chart=params.get(key) || 'Chart';
//                 setChartTypes(chartTypes => [...chartTypes, chart]);
//             }
//             });     
//     const setChartTypeBasedOnTypes = (type) => {
//         if (type === "Bar" || type === "Bar Chart" || type === "Bar chart") {
//           return "bar";
//         }
//         if (type === "Line" || type === "Line Chart" || type === "Line chart") {
//           return "line";
//         }
//         if (type === "Scatter" || type === "Scatter plot" || type === "scatter") {
//           return "scatter";
//         }
//         // Default case if no match found
//         return "";
//       };
  
//       chartTypes.forEach(type => {
//         const newChartType = setChartTypeBasedOnTypes(type);
//       });   
//     };
//     getUrlParams();
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       let url_data = '';

//       if (dashboardType === 'sales_dashboard') {
//         url_data = 'http://localhost:5000/sales_data';
//         setDbname('Sales Dashboard');
//       } else if (dashboardType === 'agent_commission_dashboard') {
//         url_data = 'http://localhost:5000/agent_data';
//         setDbname('Agent Commission Dashboard');
//       } else if (dashboardType === 'subscription_dashboard') {
//         url_data = 'http://localhost:5000/subscription_data';
//         setDbname('Subscription Dashboard');
//       }

//       // Create an array of arrays for labels


//       for ( var i=0;i<2;i++)
//         {
//             try {

//                 console.log(url_data)
//                 console.log(xAxises[i])
//                 console.log(yAxises[i])
//                 var response = await axios.get(url_data, {
//                   params: {
//                     x_axis: xAxises[i],
//                     y_axis: yAxises[i]
//                   }
//                 });
//                 var labelData= Object.keys(response.data);
//                 var dataValue= Object.values(response.data);
//                 console.log("labels")
//                 console.log(labelData)
//                 console.log(dataValue)
//                 setLabels(labels => [...labels, labelData]);
//                 setDataValues(dataValues => [...dataValues, dataValue]);
//         }catch (error) {
//             console.error('Error fetching data:', error);
//           }

//        }
//        }
//    // Fetch data when xAxis, yAxis, xAxis2, or yAxis2 are updated
//     if (xAxises || yAxises) {
//       fetchData();
//       console.log(xAxises)
//       console.log(yAxises)
//     }
//   }, [xAxises, yAxises]);

//   useEffect(() => {
//     if (  chartTypes && xAxises && yAxises ) {
  
//       destroyChart();
//       createCharts();
//       console.log(labels)
//       console.log(dataValues)
//     }
//   }, [chartTypes, xAxises, yAxises]);

//   const destroyChart = () => {
//     for(var i=0;i<2;i++)
//         {
//             if (chartInstances[i] && chartInstances[i].current) {
//                 chartInstances[i].current.destroy();
//               }
//         }
    
//   };


//   const createCharts = () => {
//     for (let i = 0; i < 2; i++) {
//         // Ensure chartContainers[i].current exists before attempting to access getContext('2d')
//         if (chartContainers.current[i] && chartContainers.current[i].current) {
//           // Get the CanvasRenderingContext2D for the current chart container
//           const ctx = chartContainers.current[i].current.getContext('2d');
//           // Now you can use ctx to create your chart instance or perform other operations
//           chartInstances.current[i].current = new Chart(ctx, {
//             type: chartTypes[i].toLowerCase(),
//             data: {
//               labels: labels[i],
//               datasets: [{
//                 label: graphNames[i],
//                 data: dataValues[i],
//                 borderColor: '#00695C',
//                 tension: 0.1
//               }]
//             },
//             options: {
//               responsive: true,
//               plugins: {
//                 legend: {
//                   position: 'top'
//                 }
//               },
//               scales: {
//                 x: {
//                   type: 'category',
//                   title: {
//                     display: true,
//                     text: xAxises[i]
//                   }
//                 },
//                 y: {
//                   title: {
//                     display: true,
//                     text: yAxises[i]
//                   }
//                 }
//               }
//             }
//           });
//         } else {
//           console.error(chartContainers.current[${i}] is not defined or does not have a .current property);
//           // Handle the error condition if necessary
//         }
//       }     
//   };

//   return (
//     <div>
//       <nav className="sales-navbar">
//         <ul>
//           <li className="navbar-logo">
//             <img src={logo} alt="Logo" className="logo-image" style={{ width: '90px', height: '50px' }} />
//           </li>
//           <li className="navbar-title"><h1 className='left'>{dbname}</h1></li>
//           <Link to="/home" style={{ marginRight: '20px' }}>
//             <i className="fas fa-home icon"></i>
//           </Link>
//         </ul>
//       </nav>

//       <div style={{ display: 'flex', justifyContent: 'center' ,flexWrap: 'wrap'}}>
//       {Array.from({ length: 2 }, (_, i) => (
//       <div key={i} style={{ width: '700px', height: '500px', alignItems: 'center', alignContent: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
//           <canvas ref={chartContainers[i]}></canvas>
//       </div>
//       ))}
      
//     </div>
//     </div>
//   );
// };

// export default CustomChart2;



import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Chart from 'chart.js/auto';
import axios from 'axios';
import logo from '../Assets/logo.jpg';

const CustomChart2 = () => {
  const maximumParams = 10; // Assuming maximumParams is fixed
  const [dashboardType, setDashboardType] = useState('');
  const [graphNames, setGraphNames] = useState([]);
  const [xAxises, setXAxises] = useState([]);
  const [yAxises, setYAxises] = useState([]);
  const [chartTypes, setChartTypes] = useState([]);
  const [labels, setLabels] = useState(Array.from({ length: maximumParams }, () => []));
  const [dataValues, setDataValues] = useState(Array.from({ length: maximumParams }, () => []));
  const [dbname, setDbname] = useState('');
  const chartContainers = useRef(Array.from({ length: maximumParams }, () => useRef(null)));
  const chartInstances = useRef(Array.from({ length: maximumParams }, () => ({ current: null })));

  useEffect(() => {
    const getUrlParams = () => {
      const params = new URLSearchParams(window.location.search);
      const regex = /\/custom_chart2\/([^?#]+)/;
      const url = window.location.href;
      const match = url.match(regex);

      if (match) {
        setDashboardType(match[1]);
      } else {
        console.log('Dashboard type not found in URL');
        return;
      }

      // Clear previous state
      setGraphNames([]);
      setXAxises([]);
      setYAxises([]);
      setChartTypes([]);

      params.forEach((value, key) => {
        if (key.startsWith('graph_name')) {
          const gname = params.get(key) || 'Chart';
          setGraphNames(prevGraphNames => [...prevGraphNames, gname]);
        } else if (key.toLowerCase().startsWith('x_axis')) {
          const x_axis = params.get(key) || 'Chart';
          setXAxises(prevXAxises => [...prevXAxises, x_axis]);
        } else if (key.startsWith('y_axis')) {
          const y_axis = params.get(key) || 'Chart';
          setYAxises(prevYAxises => [...prevYAxises, y_axis]);
        } else if (key.toLowerCase().startsWith('graph_type')) {
          const chartType = params.get(key) || 'Chart';
          setChartTypes(prevChartTypes => [...prevChartTypes, chartType]);
        }
      });
    };

    getUrlParams();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!dashboardType || xAxises.length === 0 || yAxises.length === 0) {
        return; // Ensure necessary parameters are set
      }

      const baseURL = determineBaseURL(dashboardType);
      if (!baseURL) {
        console.log('Invalid dashboard type:', dashboardType);
        return;
      }

      for (let i = 0; i < Math.min(maximumParams, xAxises.length, yAxises.length); i++) {
        try {
          const response = await axios.get(baseURL, {
            params: {
              x_axis: xAxises[i],
              y_axis: yAxises[i]
            }
          });

          const labelData = Object.keys(response.data);
          const dataValue = Object.values(response.data);

          setLabels(prevLabels => {
            const newLabels = [...prevLabels];
            newLabels[i] = labelData;
            return newLabels;
          });

          setDataValues(prevDataValues => {
            const newDataValues = [...prevDataValues];
            newDataValues[i] = dataValue;
            return newDataValues;
          });

        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, [dashboardType, xAxises, yAxises]);

  useEffect(() => {
    if (chartTypes.length > 0 && xAxises.length > 0 && yAxises.length > 0) {
      destroyCharts();
      createCharts();
    }
  }, [chartTypes, xAxises, yAxises, labels, dataValues]);

  const determineBaseURL = (type) => {
    switch (type) {
      case 'sales_dashboard':
        setDbname('Sales Dashboard');
        return 'http://localhost:5000/sales_data';
      case 'agent_commission_dashboard':
        setDbname('Agent Commission Dashboard');
        return 'http://localhost:5000/agent_data';
      case 'subscription_dashboard':
        setDbname('Subscription Dashboard');
        return 'http://localhost:5000/subscription_data';
      default:
        return '';
    }
  };

  const destroyCharts = () => {
    chartInstances.current.forEach(instance => {
      if (instance.current) {
        instance.current.destroy();
      }
    });
  };

  const createCharts = () => {
    chartInstances.current.forEach((instance, i) => {
      const ctx = chartContainers.current[i].current.getContext('2d');
      instance.current = new Chart(ctx, {
        type: chartTypes[i]?.toLowerCase(),
        data: {
          labels: labels[i] || [],
          datasets: [{
            label: graphNames[i],
            data: dataValues[i] || [],
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
                text: xAxises[i]
              }
            },
            y: {
              title: {
                display: true,
                text: yAxises[i]
              }
            }
          }
        }
      });
    });
  };

  return (
    <div>
      <nav className="sales-navbar">
        <ul>
          <li className="navbar-logo">
            <img src={logo} alt="Logo" className="logo-image" style={{ width: '90px', height: '50px' }} />
          </li>
          <li className="navbar-title">
            <h1 className='left'>{dbname}</h1>
          </li>
          <Link to="/home" style={{ marginRight: '20px' }}>
            <i className="fas fa-home icon"></i>
          </Link>
        </ul>
      </nav>

      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        {Array.from({ length: Math.min(maximumParams, xAxises.length, yAxises.length) }, (_, i) => (
          <div key={i} style={{ width: '700px', height: '500px', alignItems: 'center', alignContent: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <canvas ref={chartContainers.current[i]}></canvas>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomChart2;