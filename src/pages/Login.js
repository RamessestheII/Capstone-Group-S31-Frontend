// src/Login.js

import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../Auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [redirect, setRedirect] = useState(false); 
  const { login } = useAuth();

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    const response = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      await login(data.userId, data.token);
      setRedirect(true); // Set redirect to true on successful login
    } else {
      setError('Login failed')
      console.error('Login failed');
    }
  };

  // Redirect if login is successful
  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit"onClick={handleSubmit}>Login</button>

        <div className="flex text-center mt-4 text-xs">
          <p className="mx-2">Don't have an account?</p>
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up here
          </Link>
        </div>

      </form>
      
    </div>
  );
};

export default Login;