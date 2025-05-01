import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/login', {
        email,
        password,
      });

      setSuccessMsg(`Welcome, ${response.data.user.name}!`);
      setErrorMsg('');

      localStorage.setItem('user', JSON.stringify(response.data.user));

      if (response.data.user.role === 'student') {
        navigate('/student-dashboard');
      } else if (response.data.user.role === 'teacher') {
        navigate('/teacher-dashboard');
      } else if (response.data.user.role === 'admin') {
        navigate('/admin-dashboard');
      }
    } catch (err) {
      setSuccessMsg('');
      setErrorMsg(err.response ? err.response.data : 'Server not responding');
    }
  };

  return (
    <div className="login-wrapper">
      <video autoPlay muted loop className="background-video">
        <source src="my.mp4.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="login-container">
        <h1 className="main-heading">LMS VISTA</h1>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>
        {successMsg && <p className="success">{successMsg}</p>}
        {errorMsg && <p className="error">{errorMsg}</p>}
      </div>
    </div>
  );
}

export default Login;
