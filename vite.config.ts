import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Cambia en cada build para que el service worker vuelva a descargar app.html
// (el shell del CRM que genera scripts/prerender.mjs).
const BUILD_ID = Date.now().toString(36)

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    tailwindcss(),
    react(),
    // El build SSR solo sirve para pre-renderizar; no genera service worker.
    !isSsrBuild &&
    VitePWA({
      registerType: 'prompt',
      workbox: {
        // Las páginas del CRM usan el shell vacío (app.html); las públicas se
        // piden siempre a la red para servir su HTML pre-renderizado.
        navigateFallback: '/app.html',
        navigateFallbackDenylist: [
          /^\/$/,
          /^\/(alineacion-y-balanceo|mecanica|llantas|contacto|catalog)(\/|$)/,
          /^\/api\//,
          /^\/(robots\.txt|sitemap\.xml)$/,
        ],
        additionalManifestEntries: [{ url: '/app.html', revision: BUILD_ID }],
        globIgnores: ['**/index.html'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/tires/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'tire-images',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
      includeAssets: ['pwa-192.png', 'pwa-512.png'],
      manifest: {
        name: 'Rian Automotriz',
        short_name: 'Rian',
        description: 'Gestion de ordenes y presupuestos de Rian Automotriz',
        start_url: '/dashboard',
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
}))
