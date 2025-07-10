import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables from .env file based on the current mode
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL || 'http://localhost:8000')
    },
    server: {
      host: 'localhost',
      port: 5174,
      cors: true,
      strictPort: true,
      open: true,
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          secure: false
        }
      }
    },
    preview: {
      host: 'localhost',
      port: 5174
    }
  }
});
