// ✅ FILE: src/pages/public/ProductDetail.jsx (Kembalikan ke Versi Awal)

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaShoppingCart } from 'react-icons/fa';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/products/${id}`);
        setProduct(res.data);
        setLoading(false);
        fetchRelatedProducts(res.data.seller);
      } catch (error) {
        console.error('Gagal mengambil data produk:', error);
        setLoading(false);
      }
    };

    const fetchRelatedProducts = async (sellerId) => {
      try {
        setRelatedLoading(true);
        const res = await axios.get(`http://localhost:4000/api/products?seller=${sellerId}`);
        const otherProducts = res.data.filter(p => p._id !== id);
        setRelatedProducts(otherProducts);
        setRelatedLoading(false);
      } catch (error) {
        console.warn('Tidak ada produk lain dari seller ini.');
        setRelatedProducts([]);
        setRelatedLoading(false);
      }
    };

    fetchProduct();
  }, [id]); // id sebagai dependency

  const handleAddToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem('dpoi_cart')) || [];

    const itemExists = existingCart.find(item => item._id === product._id);

    let updatedCart;
    if (itemExists) {
      updatedCart = existingCart.map(item =>
        item._id === product._id ? { ...item, qty: item.qty + 1 } : item
      );
    } else {
      const productForOrder = {
        _id: product._id,
        name: product.name,
        price: product.price,
        qty: 1,
        sellerId: product.seller || product.sellerId || '',
        storeName: product.storeName || '',
        image: product.image || '',
        description: product.description || '',
      };
      updatedCart = [...existingCart, productForOrder];
    }

    localStorage.setItem('dpoi_cart', JSON.stringify(updatedCart));

    // ✅ Redirect ke DPOI Orders, bukan langsung ke Checkout
    navigate('/orders'); // Ini harusnya mengarah ke DpoiOrders.jsx
  };

  if (loading) return <div className="p-4 text-gray-600">Memuat produk...</div>;
  if (!product) return <div className="p-4 text-red-500">Produk tidak ditemukan.</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-4">
        <Link
          to="/"
          className="inline-block text-blue-600 hover:text-blue-800 font-semibold"
          aria-label="Kembali ke Etalase"
        >
          ⬅️ Kembali ke Etalase
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex justify-center items-center">
          <img
            src={product.image ? `http://localhost:4000${product.image}` : 'https://via.placeholder.com/300'}
            alt={product.name}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md h-64 object-contain rounded-md border"
          />
        </div>

        <div className="space-y-3 text-sm sm:text-base">
          <p>
            <span className="font-semibold text-gray-700">Nama Warung:</span>
            <span className="ml-2 text-lg font-serif font-bold text-indigo-700 tracking-wide">
              {product.storeName || 'Tidak diketahui'}
            </span>
          </p>
          <p>
            <span className="font-semibold text-gray-700">Nama Produk:</span>
            <span className="ml-2 text-lg font-serif font-extrabold text-green-700 tracking-wide">
              {product.name}
            </span>
          </p>
          <p><span className="font-semibold text-gray-700">Deskripsi Produk:</span></p>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-xl font-bold text-green-600">Rp{product.price?.toLocaleString('id-ID')}</p>

          <button
            onClick={handleAddToCart}
            className="mt-4 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md shadow"
          >
            <FaShoppingCart /> Tambah ke Keranjang
          </button>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Produk lain dari {product.storeName || 'penjual ini'}
        </h2>

        {relatedLoading ? (
          <p>Memuat produk lain...</p>
        ) : relatedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/product/${item._id}`)}
                className="cursor-pointer bg-white hover:shadow-lg transition p-3 rounded-lg border"
              >
                <img
                  src={item.image ? `http://localhost:4000${item.image}` : 'https://via.placeholder.com/200'}
                  alt={item.name}
                  className="h-32 w-full object-contain mb-2"
                />
                <p className="text-sm font-semibold truncate">{item.name}</p>
                <p className="text-green-600 text-sm">Rp{item.price?.toLocaleString('id-ID')}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">Seller ini baru memiliki 1 produk yang ditampilkan.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;