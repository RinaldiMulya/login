import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User2Icon, Lock, LogIn } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Akses API melalui proxy
      const response = await axios.post('/users/login', {
        username,
        password,
      });

      if (response.status === 200) {
        // Simpan token ke localStorage dan arahkan ke dashboard
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      }
    } catch (error) {
      setError('Login gagal, periksa username dan password Anda.');
    }
  };

  return (

    <>
      <div className="text-center">
        <h3>Login</h3>
      </div>
      <div className="">
        <form onSubmit={handleSubmit} className='bg-gray-200 rounded-full p-3'>
          <div className="relative">
              <User2Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20}/>
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder="Masukkan Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Masukkan Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </>



  );
};

export default Login;
