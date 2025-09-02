// ✅ FILE: vite.config.js (VERSI AKHIR DAN SEMPURNA)

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('./localhost-key.pem'),
      cert: fs.readFileSync('./localhost.pem'),
    },
    proxy: {
      '/api': {
        target: 'https://localhost:4000',
        changeOrigin: true,
        secure: false, // Penting karena kita pakai sertifikat self-signed
      },
    },
    port: 5173,
  },
});
