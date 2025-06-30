import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Add this 'server' configuration block
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // Your backend server port
        changeOrigin: true, // Changes the origin header to match the target URL
        secure: false,      // For development, allows self-signed certificates etc.
        ws: true,           // Enables WebSocket proxying (good practice to include)
      },
    },
  },
});