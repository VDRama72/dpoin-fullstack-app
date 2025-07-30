// ✅ FILE: src/pages/seller/ProductManagementSeller.jsx

import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import useTitle from '../../hooks/useTitle';

const baseUrl = import.meta.env.VITE_API_BASE_URL.replace('/api', '');

export default function ProductManagementSeller() {
  // ... semua kode sama seperti sebelumnya

  return (
    <div className="p-6">
      {/* ... bagian lain tetap sama */}

      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            {/* header tetap */}
          </thead>
          <tbody>
            {products.map(prod => (
              <tr key={prod._id}>
                {/* kolom lain tetap sama */}

                <td className="border p-2">
                  {editingId === prod._id ? (
                    <div>
                      {prod.image && (
                        <img
                          src={`${baseUrl}${prod.image}`}
                          alt="lama"
                          className="w-16 h-16 object-cover rounded mb-1"
                        />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setEditImage(e.target.files[0])}
                      />
                    </div>
                  ) : (
                    prod.image ? (
                      <img
                        src={`${baseUrl}${prod.image}`}
                        alt="gambar"
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400 italic">Tidak ada</span>
                    )
                  )}
                </td>

                {/* kolom aksi tetap */}
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
