// ✅ FILE: src/pages/admin/DriverFinanceReport.jsx (VERSI AKHIR & SEMPURNA)

import React, { useEffect, useState } from 'react';
import useTitle from '../../hooks/useTitle';
import api from '../../services/api';
import { FaMoneyBillWave, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaMotorcycle } from 'react-icons/fa';
import moment from 'moment';

export default function DriverFinanceReport() {
    useTitle('💰 Laporan Keuangan Driver - D’PoIN Admin');

    const [allDrivers, setAllDrivers] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState('');
    const [driverReports, setDriverReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState(moment().subtract(7, 'days').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));

    const fetchAllDrivers = async () => {
        try {
            const res = await api.get('/users/drivers');
            setAllDrivers(res.data);
        } catch (err) {
            console.error('❌ Gagal mengambil daftar driver:', err);
        }
    };

    const fetchDriverReports = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get('/users/finances/drivers/shift-report', {
                params: { startDate, endDate, driverId: selectedDriver }
            });
            setDriverReports(res.data);
            setLoading(false);
        } catch (err) {
            console.error('❌ Gagal mengambil laporan keuangan driver:', err);
            setError('Gagal memuat data laporan.');
            setLoading(false);
        }
    };
    
    // ✅ REVISI FUNGSI: Update status pembayaran untuk semua pesanan driver
    const updateAllPaymentsForDriver = async (orderIds, status) => {
        if (!window.confirm(`Yakin ingin mengubah status pembayaran untuk ${orderIds.length} pesanan menjadi "${status === 'paid' ? 'Sudah Dibayar' : 'Belum Dibayar'}"?`)) return;

        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            
            await api.put(`/users/finances/drivers/batch-payment`, { orderIds, status }, { headers });
            
            fetchDriverReports(); // Refresh data
        } catch (err) {
            console.error('❌ Gagal memperbarui status pembayaran:', err);
            alert('Gagal memperbarui status pembayaran.');
        }
    };

    useEffect(() => {
        fetchAllDrivers();
    }, []);

    useEffect(() => {
        fetchDriverReports();
    }, [startDate, endDate, selectedDriver]);

    const handleDateChange = (e, type) => {
        const date = e.target.value;
        if (type === 'start') {
            setStartDate(date);
        } else {
            setEndDate(date);
        }
    };
    
    if (loading) return <p className="text-center p-6">Memuat data laporan...</p>;
    if (error) return <p className="text-center text-red-500 p-6">{error}</p>;

    return (
        <div className="bg-white p-6 rounded-lg shadow mb-6 max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">💰 Laporan Keuangan Driver</h2>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg border">
                <div className="flex flex-col flex-1">
                    <label htmlFor="driver-select" className="text-sm font-medium text-gray-700">Pilih Driver:</label>
                    <div className="relative mt-1">
                        <FaMotorcycle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                            id="driver-select"
                            value={selectedDriver}
                            onChange={(e) => setSelectedDriver(e.target.value)}
                            className="border p-2 pl-10 rounded w-full"
                        >
                            <option value="">Semua Driver</option>
                            {allDrivers.map(driver => (
                                <option key={driver._id} value={driver._id}>{driver.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex flex-col flex-1">
                    <label htmlFor="start-date" className="text-sm font-medium text-gray-700">Periode:</label>
                    <div className="mt-1 flex items-center gap-2">
                        <div className="relative flex-1">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => handleDateChange(e, 'start')}
                                className="border p-2 rounded w-full pr-10"
                            />
                            <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                        <span className="text-gray-500">hingga</span>
                        <div className="relative flex-1">
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => handleDateChange(e, 'end')}
                                className="border p-2 rounded w-full pr-10"
                            />
                            <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-700 border">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                        <tr>
                            <th className="px-4 py-2">Driver</th>
                            <th className="px-4 py-2">Pesanan (Pagi-Sore)</th>
                            <th className="px-4 py-2">Total (Pagi-Sore)</th>
                            <th className="px-4 py-2">Pesanan (Sore-Malam)</th>
                            <th className="px-4 py-2">Total (Sore-Malam)</th>
                            <th className="px-4 py-2">Status Pembayaran</th>
                            <th className="px-4 py-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {driverReports.length > 0 ? (
                            driverReports.map((report) => {
                                const hasUnpaidOrders = report.morningShift.orders.some(o => o.paymentStatus !== 'paid') || report.eveningShift.orders.some(o => o.paymentStatus !== 'paid');
                                const morningUnpaidCount = report.morningShift.orders.filter(o => o.paymentStatus !== 'paid').length;
                                const eveningUnpaidCount = report.eveningShift.orders.filter(o => o.paymentStatus !== 'paid').length;
                                const totalUnpaidCount = morningUnpaidCount + eveningUnpaidCount;

                                return (
                                    <tr key={report.driverId} className="border-t">
                                        <td className="px-4 py-2 font-semibold">{report.driverName}</td>
                                        
                                        <td className="px-4 py-2">
                                            {report.morningShift.orders.map(order => (
                                                <div key={order.orderId} className="flex justify-between items-center">
                                                    <span>#{order.orderId.substring(18)}</span>
                                                    <span>Rp {order.earning.toLocaleString('id-ID')}</span>
                                                </div>
                                            ))}
                                        </td>
                                        <td className="px-4 py-2 font-bold text-green-600">
                                            Rp {report.morningShift.totalEarning.toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-4 py-2">
                                            {report.eveningShift.orders.map(order => (
                                                <div key={order.orderId} className="flex justify-between items-center">
                                                    <span>#{order.orderId.substring(18)}</span>
                                                    <span>Rp {order.earning.toLocaleString('id-ID')}</span>
                                                </div>
                                            ))}
                                        </td>
                                        <td className="px-4 py-2 font-bold text-green-600">
                                            Rp {report.eveningShift.totalEarning.toLocaleString('id-ID')}
                                        </td>
                                        
                                        <td className="px-4 py-2">
                                            {hasUnpaidOrders ? (
                                                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                                                    Belum Diterima
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                                    Sudah Diterima
                                                </span>
                                            )}
                                        </td>
                                        
                                        <td className="px-4 py-2">
                                            {hasUnpaidOrders && (
                                                <button
                                                    onClick={() => {
                                                        const allUnpaidOrderIds = [
                                                            ...report.morningShift.orders.filter(o => o.paymentStatus !== 'paid').map(o => o.orderId),
                                                            ...report.eveningShift.orders.filter(o => o.paymentStatus !== 'paid').map(o => o.orderId)
                                                        ];
                                                        if (allUnpaidOrderIds.length > 0) {
                                                            updateAllPaymentsForDriver(allUnpaidOrderIds, 'paid');
                                                        }
                                                    }}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs flex items-center gap-1"
                                                >
                                                    <FaMoneyBillWave /> Bayar
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center text-gray-400 py-4">Tidak ada data laporan ditemukan.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}