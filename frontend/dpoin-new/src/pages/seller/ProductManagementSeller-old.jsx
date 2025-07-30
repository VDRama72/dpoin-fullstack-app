// src/pages/seller/ProductManagementSeller.jsx

import React, { useEffect, useState } from 'react';
import SidebarSeller from '../../components/seller/SidebarSeller';
import useTitle from '../../hooks/useTitle';
import api from '../../services/api';
import ProductCard from '../../components/seller/ProductCard';

export default function ProductManagementSeller() {
  useTitle('Manajemen Produk - Penjual');

  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
  });

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products'); // endpoint disesuaikan dengan backend
      setProducts(res.data);
    } catch (err) {
      console.error('❌ Gagal mengambil data produk:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async () => {
    try {
      await api.post('/products', newProduct);
      setNewProduct({ name: '', price: '', description: '', image: '' });
      fetchProducts();
    } catch (err) {
      console.error('❌ Gagal menambahkan produk:', err);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <SidebarSeller />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">📦 Manajemen Produk</h1>

        {/* Form Tambah Produk */}
        <div className="bg-white rounded p-4 shadow mb-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">Tambah Produk</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              name="name"
              placeholder="Nama Produk"
              value={newProduct.name}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="number"
              name="price"
              placeholder="Harga"
              value={newProduct.price}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="description"
              placeholder="Deskripsi"
              value={newProduct.description}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="image"
              placeholder="URL Gambar"
              value={newProduct.image}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>
          <button
            onClick={handleAddProduct}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Tambah Produk
          </button>
        </div>

        {/* List Produk */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
