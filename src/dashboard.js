// src/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [stok, setStok] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    } else {
      fetchData(token);
    }
  }, [navigate]);

  const fetchData = async (token) => {
    try {
      const response = await axios.get('https://inventaris-app-backend.vercel.app/api/stok', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStok(response.data);
    } catch (error) {
      console.error('Gagal memuat data stok:', error);
    }
  };

  return (
    <div className="container">
      <h1>Dashboard Stok Inventaris</h1>
      <ul>
        {stok.map((item) => (
          <li key={item.id}>
            {item.nama} - {item.jumlah}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
