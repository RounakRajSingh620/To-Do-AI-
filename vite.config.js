import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Replace with your repo name
export default defineConfig({
  plugins: [react()],
  base: '/To-Do-AI-/' // 👈 this is important for GitHub Pages
})
