// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import SalesDashboard from './components/SalesDashboard';
import SubscriptionDashboard from './components/SubscriptionDashboard';
import AgentDashboard from './components/AgentDashboard';
import Login from './Login';
import ChatBot from './ChatBot';

import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Custom from './components/Custom';


function App() {
  return (
    <AuthProvider>
    <Router>
      <div className="App">
        {/* <header className="App-header">
          <h1>Welcome to Dashboard App</h1>
        </header> */}
        <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/custom" element={<Custom/>} />
          <Route path="/home" element={<ProtectedRoute element={<HomePage />} />} />
          {/* <Route path="/sales_dashboard/:chartType" element={<SalesDashboard />} /> */}
          <Route path="/sales_dashboard" element={<ProtectedRoute element={<SalesDashboard />} />} />
          <Route path="/subscription_dashboard" element={<SubscriptionDashboard />} />
          <Route path="/agent_commission_dashboard" element={<AgentDashboard />} />
        </Routes>
        <ChatBot/>
      </div>

    </Router>
    </AuthProvider>
    
  );
}

export default App;