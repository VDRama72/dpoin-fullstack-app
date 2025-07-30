// src/components/seller/ProductCard.jsx
import React from 'react';

export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition duration-200">
      <img src={product.imageUrl} alt={product.name}
        className="h-48 w-full object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold truncate">{product.name}</h3>
        <p className="text-indigo-600 font-bold mt-1">Rp{product.price.toLocaleString()}</p>
        <p className="text-gray-600 mt-2 line-clamp-2">{product.description}</p>
      </div>
    </div>
  );
}
