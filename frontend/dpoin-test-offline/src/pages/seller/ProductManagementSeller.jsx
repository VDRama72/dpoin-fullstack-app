// ✅ FILE: src/pages/seller/ProductManagementSeller.jsx

import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import useTitle from '../../hooks/useTitle';

export default function ProductManagementSeller() {
  useTitle('📦 Produk Saya');

  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', price: '', stock: '', category: '' });
  const [editImage, setEditImage] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products/my-products');
      setProducts(res.data);
    } catch (err) {
      console.error('Gagal memuat produk', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = async () => {
    try {
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('description', newProduct.description);
      formData.append('price', Number(newProduct.price));
      formData.append('stock', Number(newProduct.stock));
      formData.append('category', newProduct.category);
      if (newProduct.image) formData.append('image', newProduct.image);

      await api.post('/products/my-products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setNewProduct({ name: '', description: '', price: '', stock: '', category: '', image: null });
      fetchProducts();
    } catch (err) {
      alert('Gagal menambah produk');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Hapus produk ini?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        alert('Gagal menghapus produk');
      }
    }
  };

  const handleEditClick = (product) => {
    setEditingId(product._id);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category || ''
    });
    setEditImage(null);
  };

  const handleEditSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('name', editForm.name);
      formData.append('description', editForm.description);
      formData.append('price', Number(editForm.price));
      formData.append('stock', Number(editForm.stock));
      formData.append('category', editForm.category);
      if (editImage) formData.append('image', editImage);

      // ✅ FIXED ROUTE untuk seller update
      await api.put(`/products/my-products/${editingId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setEditingId(null);
      setEditImage(null);
      fetchProducts();
    } catch (err) {
      alert('Gagal memperbarui produk');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditImage(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">📦 Produk Saya</h2>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-4">
        <input type="text" placeholder="Nama" className="border p-2 rounded" value={newProduct.name}
          onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
        <input type="text" placeholder="Deskripsi" className="border p-2 rounded" value={newProduct.description}
          onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
        <input type="number" placeholder="Harga" className="border p-2 rounded" value={newProduct.price}
          onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
        <input type="number" placeholder="Stok" className="border p-2 rounded" value={newProduct.stock}
          onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
        <input type="text" placeholder="Kategori" className="border p-2 rounded" value={newProduct.category}
          onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} />
        <input type="file" accept="image/*" className="border p-2 rounded"
          onChange={e => setNewProduct({ ...newProduct, image: e.target.files[0] })} />
        <button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded">
          Tambah
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Nama</th>
              <th className="border p-2">Deskripsi</th>
              <th className="border p-2">Harga</th>
              <th className="border p-2">Stok</th>
              <th className="border p-2">Kategori</th>
              <th className="border p-2">Gambar</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map(prod => (
              <tr key={prod._id}>
                <td className="border p-2">
                  {editingId === prod._id ? (
                    <input name="name" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="border rounded p-1 w-full" />
                  ) : prod.name}
                </td>
                <td className="border p-2">
                  {editingId === prod._id ? (
                    <input name="description" value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="border rounded p-1 w-full" />
                  ) : prod.description}
                </td>
                <td className="border p-2">
                  {editingId === prod._id ? (
                    <input name="price" type="number" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} className="border rounded p-1 w-full" />
                  ) : `Rp ${Number(prod.price).toLocaleString('id-ID')}`}
                </td>
                <td className="border p-2">
                  {editingId === prod._id ? (
                    <input name="stock" type="number" value={editForm.stock} onChange={e => setEditForm({ ...editForm, stock: e.target.value })} className="border rounded p-1 w-full" />
                  ) : prod.stock}
                </td>
                <td className="border p-2">
                  {editingId === prod._id ? (
                    <input name="category" value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} className="border rounded p-1 w-full" />
                  ) : prod.category || '-'}
                </td>
                <td className="border p-2">
                  {editingId === prod._id ? (
                    <div>
                      {prod.image && (
                        <img src={`http://localhost:4000${prod.image}`} alt="lama" className="w-16 h-16 object-cover rounded mb-1" />
                      )}
                      <input type="file" accept="image/*" onChange={(e) => setEditImage(e.target.files[0])} />
                    </div>
                  ) : (
                    prod.image ? (
                      <img src={`http://localhost:4000${prod.image}`} alt="gambar" className="w-16 h-16 object-cover rounded" />
                    ) : (
                      <span className="text-gray-400 italic">Tidak ada</span>
                    )
                  )}
                </td>
                <td className="border p-2 space-x-1">
                  {editingId === prod._id ? (
                    <>
                      <button onClick={handleEditSubmit} className="bg-green-500 text-white px-2 py-1 text-xs rounded">Simpan</button>
                      <button onClick={handleCancelEdit} className="bg-gray-400 text-white px-2 py-1 text-xs rounded">Batal</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEditClick(prod)} className="bg-blue-500 text-white px-2 py-1 text-xs rounded">Edit</button>
                      <button onClick={() => handleDelete(prod._id)} className="bg-red-500 text-white px-2 py-1 text-xs rounded">Hapus</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-gray-400 py-4">Tidak ada produk ditemukan</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
