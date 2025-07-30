// src/pages/public/OrderSuccess.jsx

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import useTitle from '../../hooks/useTitle';

export default function OrderSuccess() {
  useTitle('Order Berhasil');

  const { orderId } = useParams();

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded mt-20 text-center">
      <h1 className="text-3xl font-bold mb-4 text-green-600">🎉 Pesanan Berhasil!</h1>
      <p className="mb-6">
        Terima kasih sudah memesan di D’PoIN Food. Nomor pesanan Anda adalah:
      </p>
      <p className="text-xl font-semibold mb-8">{orderId}</p>
      <Link
        to="/"
        className="inline-block bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 transition"
      >
        Kembali ke Etalase
      </Link>
    </div>
  );
}
