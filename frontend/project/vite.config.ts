import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Le da un valor por defecto a VITE_API_URL en todo el frontend
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify('http://localhost:3000'),
  },
  server: {
    proxy: {
      '/users':     { target: 'http://localhost:3000', changeOrigin: true, secure: false },
      '/clinicas':  { target: 'http://localhost:3000', changeOrigin: true, secure: false },
      '/clientes':  { target: 'http://localhost:3000', changeOrigin: true, secure: false },
      '/mascotas':  { target: 'http://localhost:3000', changeOrigin: true, secure: false },
      '/citas':     { target: 'http://localhost:3000', changeOrigin: true, secure: false },
      '/consultas': { target: 'http://localhost:3000', changeOrigin: true, secure: false },
    },
  },
});