// src/pages/admin/SystemSettings.jsx
import React, { useState } from 'react';
import useTitle from '../../hooks/useTitle';

export default function SystemSettings() {
  useTitle('⚙️ Pengaturan Sistem - D’PoIN Admin');

  const [settings, setSettings] = useState({
    appName: 'D’PoIN App',
    maintenanceMode: false,
    contactEmail: 'admin@dpoin.id',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSave = () => {
    alert('✅ Pengaturan berhasil disimpan!');
    // Bisa disambungkan ke API / backend
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">⚙️ Pengaturan Sistem</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Nama Aplikasi</label>
          <input
            type="text"
            name="appName"
            value={settings.appName}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Email Kontak</label>
          <input
            type="email"
            name="contactEmail"
            value={settings.contactEmail}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="maintenanceMode"
            checked={settings.maintenanceMode}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-gray-700">Aktifkan Mode Maintenance</label>
        </div>

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
        >
          💾 Simpan Pengaturan
        </button>
      </div>
    </div>
  );
}
