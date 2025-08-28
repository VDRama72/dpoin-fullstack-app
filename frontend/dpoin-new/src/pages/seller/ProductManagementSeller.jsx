// ✅ FILE: src/pages/seller/ProductManagementSeller.jsx (VERSI LENGKAP & SEMPURNA)

import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import useTitle from '../../hooks/useTitle'; // ✅ PERBAIKAN: Jalur impor yang benar

const baseUrl = import.meta.env.VITE_API_BASE_URL.replace('/api', '');

export default function ProductManagementSeller() {
  useTitle('Manajemen Produk - D’PoIN Seller');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: null,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products/seller');
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      setError('Gagal memuat produk. Silakan coba lagi.');
      setLoading(false);
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      if (editingId) {
        await api.put(`/products/seller/${editingId}`, formData);
      } else {
        await api.post('/products/seller', formData);
      }
      setForm({ name: '', description: '', price: '', stock: '', category: '', image: null });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan produk.');
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      image: null,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus produk ini?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus produk.');
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          {editingId ? 'Edit Produk' : 'Tambah Produk Baru'}
        </h3>
        <form onSubmit={handleSubmit}>
          {/* KARTU: INFO DASAR PRODUK */}
          <div className="bg-white rounded-xl shadow p-4 mb-4 border border-gray-200">
            <h4 className="font-semibold text-lg text-gray-700 mb-3">Informasi Produk</h4>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-600">Nama Produk</label>
              <input type="text" id="name" name="name" value={form.name} onChange={handleInputChange} placeholder="Nama Produk" className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-600">Deskripsi</label>
              <textarea id="description" name="description" value={form.description} onChange={handleInputChange} placeholder="Deskripsi produk Anda..." rows="3" className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
          </div>

          {/* KARTU: HARGA & STOK */}
          <div className="bg-white rounded-xl shadow p-4 mb-4 border border-gray-200">
            <h4 className="font-semibold text-lg text-gray-700 mb-3">Harga & Stok</h4>
            <div className="mb-4">
              <label htmlFor="price" className="block text-sm font-medium text-gray-600">Harga (Rp) (langsung dinaikkan 10%)</label>
              <input type="number" id="price" name="price" value={form.price} onChange={handleInputChange} placeholder="Contoh: 15000" className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
            <div className="mb-4">
              <label htmlFor="stock" className="block text-sm font-medium text-gray-600">Stok</label>
              <input type="number" id="stock" name="stock" value={form.stock} onChange={handleInputChange} placeholder="Contoh: 100" className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
            <div className="mb-4">
             <select
  id="category"
  name="category"
  value={form.category}
  onChange={handleInputChange}
  className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
  required
>
  <option value="">Pilih Kategori</option>
  <option value="makanan">Makanan</option>
  <option value="minuman">Minuman</option>
  <option value="snack">Snack</option>
</select>
            </div>
          </div>
          
          {/* KARTU: GAMBAR PRODUK */}
          <div className="bg-white rounded-xl shadow p-4 mb-6 border border-gray-200">
            <h4 className="font-semibold text-lg text-gray-700 mb-3">Gambar Produk</h4>
            <p className="text-gray-500 text-sm mb-4">Unggah gambar produk Anda.</p>
            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full" />
          </div>

          <div className="mt-6 flex gap-4">
            <button type="submit" className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-md hover:bg-indigo-700 transition">
              {editingId ? 'Simpan Perubahan' : 'Simpan Produk'}
            </button>
            {editingId && (
              <button type="button" onClick={() => setEditingId(null)} className="flex-1 bg-gray-300 text-gray-800 font-medium py-3 rounded-xl hover:bg-gray-400 transition">
                Batal Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Daftar Produk Saya</h3>
        {loading && <p className="text-center text-gray-500">Memuat produk...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && products.length === 0 && (
          <p className="text-center text-gray-500">Belum ada produk yang ditambahkan.</p>
        )}
        {!loading && !error && products.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Gambar</th>
                  <th className="px-4 py-2">Nama</th>
                  <th className="px-4 py-2">Harga</th>
                  <th className="px-4 py-2">Stok</th>
                  <th className="px-4 py-2">Kategori</th>
                  <th className="px-4 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
               {products.map(prod => (
            <tr key={prod._id}>
              <td className="border p-2">
                {prod.image ? (
                  // ✅ PERBAIKAN DI SINI: tambahkan '/' di antara baseUrl dan prod.image
                  <img src={`${baseUrl}${prod.image}`} alt={prod.name} className="w-16 h-16 object-cover rounded" />
                ) : (
                  <span className="text-gray-400 italic">Tidak ada</span>
                )}
                    </td>
                    <td className="border p-2">{prod.name}</td>
                    <td className="border p-2">Rp {prod.price.toLocaleString()}</td>
                    <td className="border p-2">{prod.stock}</td>
                    <td className="border p-2 capitalize">{prod.category}</td>
                    <td className="border p-2 space-x-2">
                      <button onClick={() => handleEdit(prod)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs">Edit</button>
                      <button onClick={() => handleDelete(prod._id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs">Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}