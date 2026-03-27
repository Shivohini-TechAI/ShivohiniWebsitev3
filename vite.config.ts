import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Enable tree shaking and do not inline CSS to reduce main chunk size
    cssCodeSplit: true,
    // Generate sourcemaps for debugging (disable in production if not needed)
    sourcemap: false,
    rollupOptions: {
      output: {
        // Manual code splitting: vendor libs in a separate chunk for better caching
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'icons': ['lucide-react', 'react-icons'],
          'http': ['axios'],
        },
      },
    },
    // Warn on large chunks > 500kb
    chunkSizeWarningLimit: 500,
  },
  // ✅ Strip console.log and debugger from all production builds automatically
  esbuild: {
    drop: ['console', 'debugger'],
  },
  optimizeDeps: {
    // Do NOT exclude lucide-react — it should be pre-bundled for faster dev startup
    include: ['react', 'react-dom', 'react-router-dom'],
  },
});
