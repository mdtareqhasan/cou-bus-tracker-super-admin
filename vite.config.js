import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendTarget = env.VITE_API_PROXY_TARGET || 'http://localhost:8081';

  const proxy = {
    '/api': {
      target: backendTarget,
      changeOrigin: true,
    },
    '/uploads': {
      target: backendTarget,
      changeOrigin: true,
    },
  };

  return {
    plugins: [react()],
    server: {
      port: 5174,
      host: true,
      proxy,
    },
    preview: {
      port: 5174,
      proxy,
    },
  };
});
