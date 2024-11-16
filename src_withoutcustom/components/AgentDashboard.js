import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import Chart from 'chart.js/auto';
import './AgentDashboard.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import logo from '../Assets/logo.jpg';
import axios from 'axios';


const fetchDataWithCache = async (url) => {
  const cachedData = localStorage.getItem("agent");

  if (cachedData) {
    return Promise.resolve(JSON.parse(cachedData));
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    localStorage.setItem(url, JSON.stringify(data));
    const d1 = localStorage.getItem("agent");
    console.log(d1)

    await saveDataToBackend(data);
    return data;
  } catch (error) {
    console.error(`Failed to fetch data from ${url}:`, error);
  }
};

const saveDataToBackend = async (data) => {
  try {
    const res = await axios.post('http://localhost:5000/api/save', { data });
    console.log('Data saved successfully:', res);
  } catch (error) {
    console.error('Error saving data to backend:', error);
  }
};


// const fetchDataWithCache = async(url) => {
//   const cachedData = localStorage.getItem(url);
 
//   if (cachedData) {
//     return Promise.resolve(JSON.parse(cachedData));
//   }

//   return fetch(url)
//     .then(response => response.json())
//     .then(data => {
//       localStorage.setItem(url, JSON.stringify(data));
//       const Save = async() => {
//         try{
//           const res=await axios.post('http://localhost:5000/api/save',{'data':data});
//           console.log(res)
//         }catch(error){
//           console.log("Error")
//         }
//       }
//       Save()
//       return data;
//     });
// };

const AgentDashboard = () => {
  const [agentData, setAgentData] = useState([]);
  const [agentID, setAgentID] = useState([]);
  const [regions, setRegions] = useState([]);
  const { chartType } = useParams(); // Fetch the route parameter for chart type
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const chartInstances = useRef({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData=()=>{
      fetch('http://localhost:5000/api/agent_commission_dashboard-csv')
      .then(response =>response.json())
      .then(data =>{
        setAgentData(data);
        localStorage.setItem('AgentData',JSON.stringify(data))
      })
      .catch(error =>{
        console.error('Failed to fetch Data:',error);
      });
     };

    const agentData = localStorage.getItem("AgentData");
    console.log(agentData)
    const agentDataparsed=JSON.parse(agentData)
    if(agentData){
      setAgentData(agentDataparsed)
      saveDataToBackend(agentDataparsed)


    }else{
      fetchData()
    }



    // console.log("here")
    // const fetchAgentData = () => {
    //   fetchDataWithCache('http://localhost:5000/api/agent_commission_dashboard-csv')
    //     .then(data => {
    //       setAgentData(data);
    //       console.log("here")
    //       const uniqueAgents = [...new Set(agentData.map(item => item.Agent_ID))].sort((a, b) => a - b);
    //       const uniqueRegions = [...new Set(agentData.map(item => item.Region))];

    //       setAgentID(['ALL', ...uniqueAgents]);
    //       setRegions(['ALL', ...uniqueRegions]);
    //     });
    // };

    // fetchAgentData();
  }, []);

  useEffect(() => {
    fetchDataAndCreateCharts();
  }, [location.search]);

  const fetchDataAndCreateCharts = () => {
    const urlParams = new URLSearchParams(location.search);
    const agent = urlParams.get('agent') || 'ALL';
    const region = urlParams.get('region') || 'ALL';

    // const fetchChartData = (url, callback) => {
    //   fetchDataWithCache(url)
    //     .then(data => {
    //       callback(data);
    //     })
    //     .catch(error => {
    //       console.error(`Failed to fetch data from ${url}:`, error);
    //     });
    // };
    const fetchChartData = async (url, callback) => {
      try {
        const data = await fetchDataWithCache(url);
        callback(data);
      } catch (error) {
        console.error(`Failed to fetch data from ${url}:`, error);
      }
    };

    if (barChartRef.current) {
      fetchChartData(`http://localhost:5000/agent_commission_dashboard/barchart?Agent_ID=${agent}&Region=${region}`, createBarChart);
    }
    if (pieChartRef.current) {
      fetchChartData(`http://localhost:5000/agent_commission_dashboard/piechart?Agent_ID=${agent}&Region=${region}`, createPieChart);
    }
  };

  const createBarChart = (data) => {
    if (chartInstances.current.barChart) {
      chartInstances.current.barChart.destroy();
    }

    const labels = Object.keys(data);
    const values = Object.values(data);

    const ctx = barChartRef.current.getContext('2d');
    chartInstances.current.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Sale Agent_ID',
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
            text: 'Bar Chart'
          }
        }
      }
    });
  };

  const createPieChart = (data) => {
    if (chartInstances.current.pieChart) {
      chartInstances.current.pieChart.destroy();
    }

    const labels = data.Agent_ID.map(id => `Agent ${id}`);
    const values = data.Total_Commission;

    const ctx = pieChartRef.current.getContext('2d');
    chartInstances.current.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          label: 'Total Commission',
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
            '#2ea7a2',
            '#229f9a'
          ],
          borderColor: [
            '#91dfe3',
            '#85d8de',
            '#79d1d8',
            '#6ccbcf',
            '#60c4c6',
            '#53bdbb',
            '#47b6b2',
            '#3baeaa',
            '#2ea7a2'
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
          title: {
            display: true,
            text: 'Agent Commissions Pie Chart',
          }
        },
        layout: {
          padding: 0
        },
        aspectRatio: 1,
      }
    });
  };

  const renderSalesCharts = () => {
    return (
      <div className="charts-container">
        <div className="chart-container">
          <canvas id="barChart" ref={barChartRef}></canvas>
        </div>

        <div className="chart-container">
          <canvas className='pie-chart' id="pieChart" ref={pieChartRef} width={50} height={50}></canvas>
        </div>
      </div>
    );
  };

  const handleRegionClick = (region) => {
    handleClick('Region', region);
  };
  const handleAgentClick = (agent) => {
    handleClick('Agent_ID', agent);
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

  return (
    <div>
      <nav className="sales-navbar">
        <ul>
          <li className="navbar-logo">
            <img src={logo} alt="Logo" className="logo-image" style={{ width: '90px', height: '50px' }} />
          </li>
          <li className="navbar-title"><h1 className='left'>Agent Commission Dashboard</h1></li>

          <li className="dropdown">
            <p className="dropdown-toggle">Agent ID</p>
            <div className="dropdown-content">
              <ul className="product-dropdown">
                {agentID.map((agent, index) => (
                  <li key={index}>
                    <button onClick={() => handleAgentClick(agent)}>{agent}</button>
                  </li>
                ))}
              </ul>
            </div>
          </li>
          <li className="dropdown">
            <p className="dropdown-toggle">Regions</p>
            <div className="dropdown-content">
              <ul className="region-dropdown">
                {regions.map((region, index) => (
                  <li key={index}>
                    <button onClick={() => handleRegionClick(region)}>{region}</button>
                  </li>
                ))}
              </ul>
            </div>
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
      {renderSalesCharts()}
    </div>
  );
};

export default AgentDashboard;












// import React, { useEffect, useState, useRef } from 'react';
// import { Link, useParams , useNavigate , useLocation } from 'react-router-dom';
// import Chart from 'chart.js/auto';
// import Dashboard from './Dashboard';
// import './AgentDashboard.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';
// import logo from '../Assets/logo.jpg';



// const AgentDashboard   = () => {
//   const [agentData, setAgentData] = useState([]);
//   const [agentID, setAgentID] = useState([]);
//   const [regions, setRegions] = useState([]);
//   const { chartType } = useParams(); // Fetch the route parameter for chart type
//   const barChartRef = useRef(null);
//   const pieChartRef = useRef(null);
//   const chartInstances = useRef({});
//   const navigate = useNavigate();
//   const location = useLocation();


//   useEffect(() => {
//     // Fetch the CSV data as JSON from the backend
//     fetch('http://localhost:5000/api/agent_commission_dashboard-csv')
//       .then(response => response.json())
//       .then(data => {
//         setAgentData(data);
        
//         // Extract unique Product_IDs, Regions, Months, Years, and Quarters
//         const uniqueAgents = [...new Set(data.map(item => item.Agent_ID))].sort((a, b) => a - b);
//         const uniqueRegions = [...new Set(data.map(item => item.Region))];

//         setAgentID(['ALL', ...uniqueAgents]);
//         setRegions(['ALL', ...uniqueRegions]);
 
//       });
//   }, []);

//   useEffect(() => {
//     // Ensure all refs are defined before fetching data and creating charts
//     // if (barChartRef.current && lineChartRef.current) {
//     //   setTimeout(() => {
//         fetchDataAndCreateCharts();
//     //   }, 0);
//     // } else {
//     //   console.error('One or more canvas elements are not ready.');
//     // }
//   }, [location.search]);

// const fetchDataAndCreateCharts= () => {
//   const urlParams = new URLSearchParams(window.location.search);
//     const agent = urlParams.get('agent') || 'ALL';
//     const region = urlParams.get('region') || 'ALL';

//     const fetchChartData = (url, callback) => {
//       fetch(url)
//         .then(response => response.json())
//         .then(data => {
//           callback(data);
//         })
//         .catch(error => {
//           console.error(`Failed to fetch data from ${url}:`, error);
//         });
//     };

//     if(barChartRef.current){
//       fetchChartData(`http://localhost:5000/agent_commission_dashboard/barchart?agent=${agent}&region=${region}`, createBarChart)
//     }
//     if(pieChartRef.current){
//       fetchChartData(`http://localhost:5000/agent_commission_dashboard/piechart?agent=${agent}&region=${region}`,createPieChart)

//     }


// };

// //   useEffect(()=>{
// //     const urlParams = new URLSearchParams(window.location.search);
// //     const agent = urlParams.get('agent') || 'ALL';
// //     const region = urlParams.get('region') || 'ALL';
// //   // Fetch the bar chart data
// //   fetch(`http://localhost:5000/agent_commission_dashboard/barchart?agent=${agent}&region=${region}`)
// //   .then(response => response.json())
// //   .then(data => {
// //     createBarChart(data);
// //   });

// // // Fetch the line chart data
// //   fetch(`http://localhost:5000/agent_commission_dashboard/piechart?agent=${agent}&region=${region}`)
// //   .then(response => response.json())
// //   .then(data => {
// //     createPieChart(data);
// //   });
    

//   //   return () => {
//   //     // Cleanup chart instances on component unmount
//   //     Object.values(chartInstances.current).forEach(chart => chart.destroy());
//   //   };
//   // }, [location.search]);

//   const createBarChart = (data) => {
//     if (chartInstances.current.barChart) {
//       chartInstances.current.barChart.destroy();
//     }

//     const labels = Object.keys(data);
//     const values = Object.values(data);

//     const ctx = barChartRef.current.getContext('2d');
//     chartInstances.current.barChart = new Chart(ctx, {
//       type: 'bar',
//       data: {
//         labels,
//         datasets: [{
//           label: 'Sale Agent_ID',
//           data: values,
//           backgroundColor: '#79dbe0',
//           borderColor: '#91dfe3',
//           borderWidth: 1
//         }]
//       },
//       options: {
//         responsive: true,
//         plugins: {
//           legend: {
//             position: 'top',
//           },
//           title: {
//             display: true,
//             text: 'Bar Chart'
//           }
//         }
//       }
//     });
//   };

//   const createPieChart = (data) => {
//     // Destroy the existing chart instance if it exists
//     if (chartInstances.current.pieChart) {
//       chartInstances.current.pieChart.destroy();
//     }
  
//     // Extract labels (Agent IDs) and values (Total Commissions) from the data
//     const labels = data.Agent_ID.map(id => `Agent ${id}`);
//     const values = data.Total_Commission;
  
//     // Get the context of the canvas where the chart will be rendered
//     const ctx = pieChartRef.current.getContext('2d');
  
//     // Create the new pie chart
//     chartInstances.current.pieChart = new Chart(ctx, {
//       type: 'pie',
//       data: {
//         labels,
//         datasets: [{
//           label: 'Total Commission',
//           data: values,
//           backgroundColor: [
//             // 'rgba(255, 99, 132, 0.5)',
//             // 'rgba(54, 162, 235, 0.5)',
//             // 'rgba(255, 206, 86, 0.5)',
//             // 'rgba(75, 192, 192, 0.5)',
//             // 'rgba(153, 102, 255, 0.5)',
//             // 'rgba(255, 159, 64, 0.5)',
//             // 'rgba(255, 99, 132, 0.5)',
//             // 'rgba(54, 162, 235, 0.5)',
//             // 'rgba(255, 206, 86, 0.5)',
//             // 'rgba(75, 192, 192, 0.5)',
//             // 'rgba(153, 102, 255, 0.5)',
//             // 'rgba(255, 159, 64, 0.5)',
//             // 'rgba(54, 162, 235, 0.5)',
//             // 'rgba(255, 206, 86, 0.5)',
//             // 'rgba(75, 192, 192, 0.5)',
//             // 'rgba(153, 102, 255, 0.5)',
//             // 'rgba(255, 159, 64, 0.5)',
//             // 'rgba(255, 99, 132, 0.5)',
//             // 'rgba(54, 162, 235, 0.5)',
//             // 'rgba(255, 206, 86, 0.5)'
//             '#91dfe3',
//             '#85d8de',
//             '#79d1d8',
//             '#6ccbcf',
//             '#60c4c6',
//             '#53bdbb',
//             '#47b6b2',
//             '#3baeaa',
//             '#2ea7a2',
//             '#229f9a'




//           ],
//           borderColor: [
//             '#91dfe3',
//             '#85d8de',
//             '#79d1d8',
//             '#6ccbcf',
//             '#60c4c6',
//             '#53bdbb',
//             '#47b6b2',
//             '#3baeaa',
//             '#2ea7a2'],
//           borderWidth: 1
//         }]
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//           legend: {
//             position: 'top',
//           },
//           title: {
//             display: true,
//             text: 'Agent Commissions Pie Chart',
//           }
//         },
//         layout: {
//           padding: 0
//         },
//         aspectRatio: 1,
//       }
//     });
//   };
  

  

//   const renderSalesCharts = () => {
//     return (
//       <div className="charts-container">
//         <div className="chart-container">
//           <canvas id="barChart" ref={barChartRef}></canvas>
//         </div>
    
//         <div className="chart-container">
//           <canvas className='pie-chart' id="pieChart" ref={pieChartRef} width={50} height={50}></canvas>
//         </div>

    

//       </div>
//     );
//   };

//   const handleRegionClick = (region) => {
//     handleClick('region',region)
//   };
//   const handleAgentClick = (agent) => {
//     handleClick('agent',agent)
//   };
  
  
//   const handleClick=(attribute,value)=>{
//     const searchParams = new URLSearchParams(location.search);

//   if (searchParams.has(attribute)) {
//     searchParams.set(attribute, value);
//   } else {
//     searchParams.append(attribute, value);
//   }
//   navigate(`${location.pathname}?${searchParams.toString()}`);

//   }

//   return (
//     <div>
//       <nav className="sales-navbar">
        
//         <ul>
//         <li className="navbar-logo">
//             <img src={logo} alt="Logo" className="logo-image" style={{ width: '90px', height: '50px' }}  />
//           </li>
//         <li className="navbar-title"><h1 className='left'>Agent Commission Dashboard</h1></li>

//           <li className="dropdown">
//             <p className="dropdown-toggle">Agent ID</p>
//             <div className="dropdown-content">
//               <ul className="product-dropdown">
//                 {agentID.map((agent, index) => (
//                   <li key={index}>
//                     <button onClick={() => handleAgentClick(agent)}>{agent}</button>
//                     </li>
//                 ))}
//               </ul>
//             </div>
//           </li>
//           <li className="dropdown">
//             <p className="dropdown-toggle" >Regions</p>
//             <div className="dropdown-content">
//               <ul className="region-dropdown">
//                 {regions.map((region, index) => (
//                   <li key={index}>
//                      <button onClick={() => handleRegionClick(region)}>{region}</button>
//                     </li>
//                 ))}
//               </ul>
//             </div>
//           </li>
//           <li>
//             <span></span>
//             <span></span>
//             <span></span>
//             <span></span>
//             <span></span>
//           </li>
//           <Link to="/home">
//               <i className="fas fa-home icon"></i>
//             </Link>
//         </ul>
//       </nav>
//       {/* <Dashboard
//         apiEndpoint="Agent Commissions Dashboard"
//         title={`agent_commission_dashboard-csv ${chartType ? `- ${chartType}` : ''}`}
//       /> */}
//       {renderSalesCharts()}
//     </div>
//   );
// };

// export default AgentDashboard;
