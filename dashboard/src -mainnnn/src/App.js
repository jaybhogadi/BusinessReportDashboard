// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import SalesDashboard from './components/SalesDashboard';
import SubscriptionDashboard from './components/SubscriptionDashboard';
import AgentDashboard from './components/AgentDashboard';
import ChatBot from './ChatBot';

function App() {
  return (
    <Router>
      <div className="App">
        {/* <header className="App-header">
          <h1>Welcome to Dashboard App</h1>
        </header> */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/sales_dashboard/:chartType" element={<SalesDashboard />} /> */}
          <Route path="/sales_dashboard" element={<SalesDashboard />} />
          <Route path="/subscription_dashboard" element={<SubscriptionDashboard />} />
          <Route path="/agent_commission_dashboard" element={<AgentDashboard />} />
        </Routes>
        <ChatBot/>
      </div>

    </Router>
    
  );
}

export default App;
