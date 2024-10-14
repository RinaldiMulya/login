// src/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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
      const response = await axios.get('/products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Data dari API:', response.data);

      if (response.data && response.data.products && Array.isArray(response.data.products) && response.data.products.length > 0) {
        setProducts(response.data.products); // Mengatur state dengan array produk
      }else {
        console.log('Format data tidak sesuai');
        setError('Format data tidak sesuai, Periksa Kembali');
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Gagal memuat data produk:', error);
      setError(error.response?.data?.message || 'Terjadi kesalahan saat memuat data');
      if (error.response) {
        if (error.response.status === 401) {
          setError('Token tidak valid atau kadaluarsa. Silakan login kembali.');
          localStorage.removeItem('token');
          navigate('/');
        } else {
          setError(`Terjadi kesalahan: ${error.response.data.message || error.message}`);
        }
      } else {
        setError('Terjadi kesalahan saat memuat data. Periksa koneksi internet Anda.');
      }
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center mt-8">Memuat data...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-white bg-gray-800 py-4 rounded">Dashboard Inventaris</h1>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{product.productName}</h2>
                <p className="text-gray-700">Kategori: {product.category}</p>
                <p className="text-gray-700">Jumlah: {product.quantity}</p>
                <p className="text-gray-700">Harga: Rp {product.price.toLocaleString()}</p>
                <p className="text-gray-700">Total Harga: Rp {product.totalPrice.toLocaleString()}</p>
                <p className="text-gray-700">Tanggal: {new Date(product.date).toLocaleDateString()}</p>
              </div>
              {product.image && (
                <img
                  src={`https://inventaris-app-backend.vercel.app${product.image}`}
                  alt={product.productName}
                  className="w-full h-48 object-cover"
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center mt-4">Tidak ada data produk tersedia</p>
      )}
    </div>
  );  
};

export default Dashboard;
