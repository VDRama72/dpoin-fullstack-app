// ✅ FILE: src/pages/finance/FinanceManagementAdmin.jsx

import React, { useEffect, useState } from 'react';
import useTitle from '../../hooks/useTitle';
import api from '../../services/api';

export default function FinanceManagementAdmin() {
  useTitle('💰 Manajemen Keuangan - D’PoIN Admin');

  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    api.get('/transactions')
      .then((res) => setTransactions(res.data))
      .catch((err) => console.error('❌ Gagal ambil transaksi:', err));
  }, []);

  const totalTransaksi = transactions
    .filter(tx => tx.type === 'order' && tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalWithdraw = transactions
    .filter(tx => tx.type === 'withdraw' && tx.status !== 'failed')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalSaldoMitra = transactions
    .filter(tx => tx.type === 'topup' && ['selesai', 'completed'].includes(tx.status))
    .reduce((sum, tx) => sum + tx.amount, 0);

  const filteredTransactions = filterType
    ? transactions.filter(tx => tx.type === filterType)
    : transactions;

  const totalOrder = filteredTransactions.filter(tx => tx.type === 'order');
  const totalJumlah = totalOrder.reduce((sum, tx) => sum + tx.amount, 0);
  const totalKomisi = totalOrder.reduce((sum, tx) => sum + tx.amount * 0.1, 0);
  const totalPedagang = totalOrder.reduce((sum, tx) => sum + tx.amount * 0.9, 0);

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">💰 Manajemen Keuangan</h2>
      <p className="text-gray-600 mb-4">Pantau transaksi, permintaan withdraw, dan saldo para mitra.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold text-green-800">Total Transaksi</h3>
          <p className="text-2xl font-bold text-green-600">Rp {totalTransaksi.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold text-yellow-800">Permintaan Withdraw</h3>
          <p className="text-2xl font-bold text-yellow-600">Rp {totalWithdraw.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold text-blue-800">Saldo Mitra</h3>
          <p className="text-2xl font-bold text-blue-600">Rp {totalSaldoMitra.toLocaleString('id-ID')}</p>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-sm text-gray-700 mr-2">Filter berdasarkan jenis transaksi:</label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="">Semua</option>
          <option value="order">Order</option>
          <option value="withdraw">Withdraw</option>
          <option value="topup">Topup</option>
        </select>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full text-sm border text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase">
            <tr>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Jenis</th>
              <th className="px-4 py-2">Jumlah</th>
              <th className="px-4 py-2">Komisi (10%)</th>
              <th className="px-4 py-2">Untuk Pedagang</th>
              <th className="px-4 py-2">Tanggal</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx, i) => {
              const komisi = tx.type === 'order' ? tx.amount * 0.1 : 0;
              const untukPedagang = tx.type === 'order' ? tx.amount * 0.9 : 0;

              return (
                <tr key={i} className="border-t">
                  <td className="px-4 py-2">{tx.userId?.name || tx.guestName || '-'}</td>
                  <td className="px-4 py-2 capitalize">{tx.type}</td>
                  <td className="px-4 py-2">Rp {tx.amount.toLocaleString('id-ID')}</td>
                  <td className="px-4 py-2">
                    {tx.type === 'order' ? `Rp ${komisi.toLocaleString('id-ID')}` : '-'}
                  </td>
                  <td className="px-4 py-2">
                    {tx.type === 'order' ? `Rp ${untukPedagang.toLocaleString('id-ID')}` : '-'}
                  </td>
                  <td className="px-4 py-2">{new Date(tx.createdAt).toLocaleDateString('id-ID')}</td>
                  <td className={`px-4 py-2 ${['selesai', 'completed'].includes(tx.status) ? 'text-green-600' : 'text-yellow-600'}`}>
                    {tx.status}
                  </td>
                </tr>
              );
            })}
            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray-400 italic">Tidak ada transaksi ditemukan.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Tabel ringkasan total komisi dan bagian pedagang */}
        {totalOrder.length > 0 && (
          <div className="mt-4">
            <table className="text-sm text-gray-800 border w-full max-w-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Total Jumlah</th>
                  <th className="px-4 py-2 text-left">Total Komisi 10%</th>
                  <th className="px-4 py-2 text-left">Total untuk Pedagang</th>
                </tr>
              </thead>
              <tbody>
                <tr className="font-semibold">
                  <td className="px-4 py-2">Rp {totalJumlah.toLocaleString('id-ID')}</td>
                  <td className="px-4 py-2">Rp {totalKomisi.toLocaleString('id-ID')}</td>
                  <td className="px-4 py-2">Rp {totalPedagang.toLocaleString('id-ID')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
