// src/Login.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from "react-icons/fa";
import styles from './Login.module.css'; // Import CSS module

function Login() {
  const [uname, setUname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', { uname, password });
      login(response.data.token);
      setError('');
      navigate('/home'); // Redirect to home after login
    } catch (error) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        {error && <p>{error}</p>}
        <div className={styles.inputBox}>
          <input type="text" value={uname} onChange={(e) => setUname(e.target.value)} placeholder='Username' required />
          <FaUser className={styles.icon} />
        </div>
        <div className={styles.inputBox}>
          <input type="password" value={password} placeholder='Password' onChange={(e) => setPassword(e.target.value)} required />
          <FaLock className={styles.icon} />
        </div>
        <div className={styles.rememberForgot}>
          <label><input type="checkbox" /> Remember me </label>
        </div>
        <button type='submit'>Login</button>
      </form>
    </div>
    </div>
  );
}

export default Login;
