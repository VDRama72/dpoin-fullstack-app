// ✅ FILE: src/components/public/FoodCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const baseURL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || '';

export default function FoodCard({ food, onAddToCart }) {
  const imageUrl =
    food?.image
      ? `${baseURL}${food.image.startsWith('/') ? '' : '/'}${food.image}`
      : 'https://via.placeholder.com/120x96?text=No+Image';

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden w-full max-w-[120px] sm:max-w-[160px] text-left text-xs">
      {/* Klik ke halaman detail */}
      <Link to={`/product/${food?._id || ''}`}>
        {/* Gambar */}
        <div className="w-full aspect-[5/4] bg-gray-100 overflow-hidden">
          <img
            src={imageUrl}
            alt={food?.name || 'Produk'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/120x96?text=No+Image';
            }}
          />
        </div>

        {/* Judul & Harga */}
        <div className="px-1.5 pt-1">
          <h3 className="text-[11px] font-medium text-gray-800 truncate">
            {food?.name || 'Tanpa Nama'}
          </h3>
          <p className="text-indigo-600 text-[11px] font-semibold mt-0.5">
            Rp {food?.price ? food.price.toLocaleString('id-ID') : '0'}
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2 leading-tight">
            {food?.description || 'Tidak ada deskripsi.'}
          </p>
        </div>
      </Link>

      {/* Tombol Tambah */}
      <div className="px-1.5 pb-1.5">
        <button
          onClick={onAddToCart}
          className="mt-1 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] py-[4px] rounded-full transition"
        >
          Tambah 🛒
        </button>
      </div>
    </div>
  );
}
