// src/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css'; // Import the CSS module

const HomePage = () => {
  return (
    <div className={styles.homePage}>
      <Link to="/sales_dashboard">
        <div className={styles.card} style={{ backgroundImage: "url('/path/to/sales-image.jpg')" }}>
          <h2>Sales Dashboard</h2>
        </div>
      </Link>

      <Link to="/subscription_dashboard">
        <div className={styles.card} style={{ backgroundImage: "url('/path/to/subscription-image.jpg')" }}>
          <h2>Subscriptions Dashboard</h2>
        </div>
      </Link>

      <Link to="/agent_commission_dashboard">
        <div className={styles.card} style={{ backgroundImage: "url('/path/to/agent-image.jpg')" }}>
          <h2>Agent Dashboard</h2>
        </div>
      </Link>
    </div>
  );
};

export default HomePage;
