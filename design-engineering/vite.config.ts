import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/design-engineering/', // <-- Add this

  plugins: [react()],

  optimizeDeps: {
    exclude: ['lucide-react'],
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'motion': ['framer-motion'],
          'supabase': ['@supabase/supabase-js'],
          'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'admin-core': [
            './src/components/admin/AdminLayout',
            './src/pages/admin/AdminDashboardPage',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 600,
    target: 'esnext',
    minify: 'esbuild',
  },
});