// frontend/pages/finance/FinanceUserPage.jsx

import React, { useEffect, useState } from 'react';
import { fetchMyTransactions } from '../../services/finance';
import moment from 'moment';

const FinanceUserPage = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchMyTransactions()
      .then(res => setTransactions(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Riwayat Transaksi Saya</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Tanggal</th>
              <th className="py-2 px-4 border">Tipe</th>
              <th className="py-2 px-4 border">Jumlah</th>
              <th className="py-2 px-4 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx._id}>
                <td className="py-2 px-4 border">{moment(tx.createdAt).format('DD-MM-YYYY')}</td>
                <td className="py-2 px-4 border capitalize">{tx.type}</td>
                <td className="py-2 px-4 border">Rp {tx.amount.toLocaleString()}</td>
                <td className="py-2 px-4 border">{tx.status}</td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr><td colSpan="4" className="text-center p-4">Belum ada transaksi</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinanceUserPage;
