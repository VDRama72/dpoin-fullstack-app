// ✅ FILE: ProductManagementAdmin.jsx (with Warung Filter)

import React, { useEffect, useState } from 'react';
import useTitle from '../../hooks/useTitle';
import api from '../../services/api';
import { unparse } from 'papaparse';

export default function ProductManagementAdmin() {
  useTitle('📦 Manajemen Produk - Admin');

  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [sellerFilter, setSellerFilter] = useState('semua');
  const [storeFilter, setStoreFilter] = useState('semua');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    seller: '',
    category: '',
    commissionRate: 10
  });

  const [editingProductId, setEditingProductId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', price: '', category: '', commissionRate: 10 });

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error('❌ Gagal mengambil produk:', err);
    }
  };

  const fetchSellers = async () => {
    try {
      const res = await api.get('/users?role=penjual');
      setSellers(res.data);
    } catch (err) {
      console.error('❌ Gagal mengambil penjual:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSellers();
  }, []);

  const handleCreate = async () => {
    try {
      const selectedSeller = sellers.find(s => s._id === newProduct.seller);
      if (!selectedSeller) return alert('Penjual belum dipilih');

      await api.post('/products', {
        name: newProduct.name,
        description: newProduct.description,
        price: Number(newProduct.price),
        sellerId: selectedSeller._id,
        stock: 0,
        category: newProduct.category,
        commissionRate: Number(newProduct.commissionRate) / 100,
        storeName: selectedSeller.namaWarung || selectedSeller.name || 'Tanpa Nama'
      });

      setNewProduct({ name: '', description: '', price: '', seller: '', category: '', commissionRate: 10 });
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.msg || 'Gagal menambahkan produk');
    }
  };

  const handleEditClick = (product) => {
    setEditingProductId(product._id);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category || '',
      commissionRate: (product.commissionRate || 0.1) * 100
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async () => {
    try {
      await api.put(`/products/${editingProductId}`, {
        ...editForm,
        price: Number(editForm.price),
        commissionRate: Number(editForm.commissionRate) / 100
      });
      setEditingProductId(null);
      fetchProducts();
    } catch (err) {
      alert('Gagal memperbarui produk');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus produk ini?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        alert('Gagal menghapus produk');
      }
    }
  };

  const filteredProducts = products.filter((product) => {
    const sellerMatch = sellerFilter === 'semua' || product.sellerId?._id === sellerFilter;
    const storeMatch =
      storeFilter === 'semua' ||
      product.storeName === storeFilter ||
      product.sellerId?.namaWarung === storeFilter ||
      product.sellerId?.name === storeFilter;
    const searchMatch = product.name.toLowerCase().includes(searchKeyword.toLowerCase());

    return sellerMatch && storeMatch && searchMatch;
  });

  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">📦 Manajemen Produk</h1>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-2 mb-4">
        <input type="text" placeholder="Nama Produk" className="border p-2 rounded" value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
        <input type="text" placeholder="Deskripsi" className="border p-2 rounded" value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
        <input type="number" placeholder="Harga" className="border p-2 rounded" value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
        <input type="number" placeholder="Komisi %" className="border p-2 rounded" value={newProduct.commissionRate}
          onChange={(e) => setNewProduct({ ...newProduct, commissionRate: e.target.value })} />
        <select className="border p-2 rounded" value={newProduct.category}
          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}>
          <option value="">Kategori</option>
          <option value="nasi">Nasi</option>
          <option value="mie">Mie</option>
          <option value="minuman">Minuman</option>
          <option value="camilan">Camilan</option>
        </select>
        <select className="border p-2 rounded" value={newProduct.seller}
          onChange={(e) => setNewProduct({ ...newProduct, seller: e.target.value })}>
          <option value="">Pilih Penjual</option>
          {sellers.map((s) => (
            <option key={s._id} value={s._id}>{s.namaWarung || s.name}</option>
          ))}
        </select>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded" onClick={handleCreate}>
          Tambah
        </button>
      </div>

      {/* FILTER NAMA WARUNG */}
      <div className="flex items-center gap-2 mb-4">
        <label className="text-sm">Filter Nama Warung:</label>
        <select
          value={storeFilter}
          onChange={(e) => setStoreFilter(e.target.value)}
          className="border p-1 rounded text-sm"
        >
          <option value="semua">Semua Warung</option>
          {sellers.map((s) => (
            <option key={s._id} value={s.namaWarung || s.name}>
              {s.namaWarung || s.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Nama</th>
              <th className="p-2 border">Deskripsi</th>
              <th className="p-2 border">Harga</th>
              <th className="p-2 border">Kategori</th>
              <th className="p-2 border">Komisi (%)</th>
              <th className="p-2 border">Nama Warung</th>
              <th className="p-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => (
              <tr key={product._id} className="border-t">
                <td className="p-2 border">
                  {editingProductId === product._id ? (
                    <input name="name" value={editForm.name} onChange={handleEditChange} className="border p-1 rounded w-full" />
                  ) : (product.name)}
                </td>
                <td className="p-2 border">
                  {editingProductId === product._id ? (
                    <input name="description" value={editForm.description} onChange={handleEditChange} className="border p-1 rounded w-full" />
                  ) : (product.description)}
                </td>
                <td className="p-2 border">
                  {editingProductId === product._id ? (
                    <input name="price" type="number" value={editForm.price} onChange={handleEditChange} className="border p-1 rounded w-full" />
                  ) : (`Rp ${Number(product.price).toLocaleString('id-ID')}`)}
                </td>
                <td className="p-2 border">
                  {editingProductId === product._id ? (
                    <select name="category" value={editForm.category} onChange={handleEditChange} className="border p-1 rounded w-full">
                      <option value="nasi">Nasi</option>
                      <option value="mie">Mie</option>
                      <option value="minuman">Minuman</option>
                      <option value="camilan">Camilan</option>
                    </select>
                  ) : (product.category || '-')}
                </td>
                <td className="p-2 border text-center">
                  {editingProductId === product._id ? (
                    <input name="commissionRate" type="number" value={editForm.commissionRate} onChange={handleEditChange} className="border p-1 rounded w-full" />
                  ) : `${(product.commissionRate || 0.1) * 100}%`}
                </td>
                <td className="p-2 border">
                  {product.storeName || product.sellerId?.namaWarung || product.sellerId?.name || '-'}
                </td>
                <td className="p-2 border space-x-1">
                  {editingProductId === product._id ? (
                    <>
                      <button onClick={handleEditSubmit} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 text-xs rounded">Simpan</button>
                      <button onClick={() => setEditingProductId(null)} className="bg-gray-400 hover:bg-gray-500 text-white px-2 py-1 text-xs rounded">Batal</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEditClick(product)} className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 text-xs rounded">Edit</button>
                      <button onClick={() => handleDelete(product._id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs rounded">Hapus</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {paginatedProducts.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-gray-400 py-4">Tidak ada produk ditemukan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
