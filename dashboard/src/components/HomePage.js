// src/HomePage.js
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css'; // Import the CSS module

const HomePage = () => {
  useEffect(()=>{
    localStorage.setItem('dashboard', "dashboard");
  },[])
  return (
    <div className='container'>
    <div className={styles.homePage}>
      <Link to="/sales_dashboard">
        <div className={styles.card} >
          <h2>Sales Dashboard</h2>
        </div>
      </Link>

      <Link to="/subscription_dashboard">
        <div className={styles.card} >
          <h2>Subscriptions Dashboard</h2>
        </div>
      </Link>

      <Link to="/agent_commission_dashboard">
        <div className={`${styles.card} ${styles.cardGradientGreen}`} >
          <h2>Agent Dashboard</h2>
        </div>
      </Link>
    </div>
    </div>
  );
};

export default HomePage;