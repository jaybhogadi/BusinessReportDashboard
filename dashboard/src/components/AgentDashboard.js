import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
// import Dashboard from './Dashboard';
import './AgentDashboard.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import logo from '../Assets/logo.jpg';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FaSpinner } from 'react-icons/fa'; // Import spinner icon

 // Import the datalabels plugin
 Chart.register(ChartDataLabels);

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
        // Fetch the CSV data as JSON from the backend
        const agentData = localStorage.getItem('agent_commissions_dashboard');
        localStorage.setItem("dashboard", JSON.stringify("agent_commissions_dashboard"));

        if (agentData) {
         console.log("loaded from local storage....")
          setAgentData(JSON.parse(agentData));
    
        } else {
          fetchData();
        }
    
        // fetch('http://localhost:5000/api/agent_commission_dashboard-csv')
        //     .then(response => response.json())
        //     .then(data => {
        //         setAgentData(data);

                // Extract unique Product_IDs, Regions, Months, Years, and Quarters
                // const uniqueAgents = [...new Set(data.map(item => item.Agent_ID))].sort((a, b) => a - b);
                // const uniqueRegions = [...new Set(data.map(item => item.Region))];

                // setAgentID(['ALL', ...uniqueAgents]);
                // setRegions(['ALL', ...uniqueRegions]);

                // Fetch initial charts
                // fetchDataAndCreateCharts();
            
    }, []);

    const fetchData = async() => {
        // Fetch the CSV data as JSON from the backend
        fetch('http://localhost:5000/api/agent_commission_dashboard-csv')
          .then(response => response.json())
          .then(data => {
            setAgentData(data);
            localStorage.setItem('agent_commissions_dashboard', JSON.stringify(data));
          })
          .catch(error => {
            console.error('Failed to fetch data:', error);
          });
      };
      useEffect(()=>{
        const uniqueAgents = [...new Set(agentData.map(item => item.Agent_ID))].sort((a, b) => a - b);
        const uniqueRegions = [...new Set(agentData.map(item => item.Region))];

        setAgentID(['ALL', ...uniqueAgents]);
        setRegions(['ALL', ...uniqueRegions]);
      },[agentData])
    useEffect(() => {
        // Fetch data and update charts whenever location.search changes
        fetchDataAndCreateCharts();
    }, [location.search]);

    const fetchDataAndCreateCharts = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const agent = urlParams.get('Agent_ID') || 'ALL';
        const region = urlParams.get('Region') || 'ALL';
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
            fetchChartData(`http://localhost:5000/agent_commission_dashboard/barchart?Agent_ID=${agent}&Region=${region}`, createBarChart);
        }
      
          if (pieChartRef.current) {
            fetchChartData(`http://localhost:5000/agent_commission_dashboard/piechart?Agent_ID=${agent}&Region=${region}`, createPieChart);
        }


        // fetchChartData(`http://localhost:5000/agent_commission_dashboard/barchart?Agent_ID=${agent}&Region=${region}, createBarChart`);
        // fetchChartData(`http://localhost:5000/agent_commission_dashboard/piechart?Agent_ID=${agent}Region=${region}, createPieChart`);
    };

    // const fetchChartData = (url, callback) => {
    //     fetch(url)
    //         .then(response => response.json())
    //         .then(data => {
    //             callback(data);
    //         })
    //         .catch(error => {
    //             console.error(`Failed to fetch data from ${url}:`, error);
    //         });
    // };

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
                        text: 'Bar Chart'
                    },
                    datalabels: {
                      display: false // Disable data labels
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
                    tooltip:false,
                    title: {
                        display: true,
                        text: 'Agent Commissions Pie Chart',
                    },
                    datalabels: { 
                      display:true,
                      // Configure datalabels plugin
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
                            // console.log(percentage)
                            return percentage;
                        },anchor: 'end', // Align labels at the end of the sector
                        align: 'start', // Start alignment within the sector
                        offset: 10, // Offset from the arc
                        
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
    };

    const renderSalesCharts = () => {
        return (
            <div className="charts-container">
                <div className="chart-container">
                    <canvas id="barChart" ref={barChartRef}></canvas>
                </div>

                <div className="chart-container">
                    <canvas className='pie-chart' id="pieChart" ref={pieChartRef}></canvas>
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
                    <li className="navbar-title"><h1 className='heading-left'>Agent Commission Dashboard</h1></li>

                    <li className="dropdown">
                        <p className="dropdown-toggle">Agent ID
                        <i className="fas fa-chevron-down" style={{ fontSize: '0.8em',paddingLeft: '8px' }}></i>
</p>
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
                        <p className="dropdown-toggle">Regions
                        <i className="fas fa-chevron-down" style={{ fontSize: '0.8em',paddingLeft: '8px' }}></i>
</p>
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

                    <Link to="/home" style={{ marginLeft: '120px', marginRight: '20px' }}>
                        <i className="fas fa-home icon"></i>
                    </Link>
                </ul>
            </nav>
            {renderSalesCharts()}
        </div>
    );
};

export default AgentDashboard;