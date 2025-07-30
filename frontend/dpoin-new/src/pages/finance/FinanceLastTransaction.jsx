// ✅ FILE: src/pages/finance/FinanceLastTransactions.jsx

import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

export default function FinanceLastTransactions() {
  const [lastTransactions, setLastTransactions] = useState([]);

  useEffect(() => {
    api.get('/finance')
      .then((res) => {
        const filtered = res.data
          .filter(tx => ['completed', 'selesai'].includes(tx.status))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5); // ambil 5 transaksi terakhir
        setLastTransactions(filtered);
      })
      .catch((err) => console.error('❌ Gagal ambil transaksi terakhir:', err));
  }, []);

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">🔍 Transaksi Terakhir</h2>
      <p className="text-sm text-gray-600 mb-4">
        Daftar 5 transaksi terakhir yang telah selesai.
      </p>

      <div className="overflow-auto">
        <table className="min-w-full text-sm border text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase">
            <tr>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Jenis</th>
              <th className="px-4 py-2">Jumlah</th>
              <th className="px-4 py-2">Tanggal</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {lastTransactions.map((tx, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-2">{tx.userId?.name || tx.guestName || 'Tamu'}</td>
                <td className="px-4 py-2 capitalize">{tx.type}</td>
                <td className="px-4 py-2">Rp {tx.amount.toLocaleString('id-ID')}</td>
                <td className="px-4 py-2">{new Date(tx.createdAt).toLocaleDateString('id-ID')}</td>
                <td className="px-4 py-2 text-green-600">{tx.status}</td>
              </tr>
            ))}
            {lastTransactions.length === 0 && (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-400 italic">Tidak ada transaksi selesai.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <Link to="/dashboard/admin/finance" className="text-sm text-blue-600 underline">
          ← Kembali ke Manajemen Keuangan
        </Link>
      </div>
    </div>
  );
}
