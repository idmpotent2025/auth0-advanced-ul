import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    outDir: 'dist',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        format: 'iife',
        entryFileNames: 'bundle.js',
        assetFileNames: (assetInfo) =>
          (assetInfo.name ?? '').endsWith('.css') ? 'bundle.css' : 'assets/[name][extname]',
        name: 'Auth0ACULBundle',
        inlineDynamicImports: true,
      },
    },
  },
})
