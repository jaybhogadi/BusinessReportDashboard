import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css'; // Import the CSS file

const HomePage = () => {
  return (
    <div className="home-page">
        <Link to="/sales_dashboard">
            <div className="card">
             <h2>Sales Dashboard</h2>
            </div>
        </Link>

        <Link to="/subscription_dashboard">
            <div className="card">
             <h2>Subscriptions Dashboard</h2>
             </div>
        </Link>

        <Link to="/agent_commission_dashboard">
        <div className="card">
          <h2>Agent Dashboard</h2>
        </div>
        </Link>
    </div>
  );
};

export default HomePage;
