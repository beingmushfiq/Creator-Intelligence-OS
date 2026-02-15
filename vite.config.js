import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    content: ['index.html', 'src/**/*.{js,jsx,ts,tsx}'],
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          ui: ['framer-motion', 'lucide-react', 'cmdk'],
          utils: ['jspdf', 'jspdf-autotable']
        }
      }
    }
  }
});
