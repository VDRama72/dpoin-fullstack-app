    import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'

    // https://vitejs.dev/config/
    export default defineConfig({
      plugins: [react()],
      // Tambahkan konfigurasi ini untuk memastikan variabel env dimuat
      define: {
        'process.env.VITE_API_BASE_URL': JSON.stringify(process.env.VITE_API_BASE_URL),
        'process.env.VITE_SOCKET_URL': JSON.stringify(process.env.VITE_SOCKET_URL),
      }
    })