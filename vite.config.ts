import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo-rian.jpeg', 'pwa-192.png', 'pwa-512.png'],
      manifest: {
        name: 'Rian Automotriz',
        short_name: 'Rian',
        description: 'Gestion de ordenes y presupuestos de Rian Automotriz',
        start_url: '/',
        display: 'standalone',
        background_color: '#F7F7F5',
        theme_color: '#B3262D',
        icons: [
          {
            src: '/pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
})
