import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/get_user': 'http://127.0.0.1:8000',
      '/get_users': 'http://127.0.0.1:8000',
      '/conversations': 'http://127.0.0.1:8000',
      '/messages': 'http://127.0.0.1:8000',
      '/search': 'http://127.0.0.1:8000',
      '/listing': 'http://127.0.0.1:8000',
      '/add_listing': 'http://127.0.0.1:8000',
      '/add_help_request': 'http://127.0.0.1:8000',
      '/register': 'http://127.0.0.1:8000',
      '/logout': 'http://127.0.0.1:8000'
    }
  }
})
