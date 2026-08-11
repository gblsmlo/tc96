import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  optimizeDeps: {
    include: ['@base-ui/react/field', '@base-ui/react/form'],
  },
  plugins: [react(), tailwindcss()],
})
