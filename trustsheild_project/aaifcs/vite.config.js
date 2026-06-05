import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

/**
 * ============================================================
 * TrustSheild OS™ — Vite Config
 * Run 1 — Safe Identity Refactor
 * Powered by 4P3X Intelligent AI™  ·  Created by Kyzel Kreates™
 * ============================================================
 * COMPATIBILITY NOTE:
 * All source files live in the project root — flat build preserved.
 * SW caching, chunk splitting, optimizeDeps — all unchanged.
 * PWA manifest updated to TrustSheild OS™ identity.
 * start_url preserved at /#/driver-app for PWA install compatibility
 * (will be updated in Run 5 when PWA identity system is implemented).
 * ============================================================
 */

export default defineConfig({
  base: '/',

  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      additionalManifestEntries: [],

      // ── Web App Manifest — TrustSheild OS™ identity ────────
      manifest: {
        name:             'TrustSheild OS™',
        short_name:       'TrustSheild',
        description:      'AI-Assisted Reputation Protection & Crisis Response Platform. Powered by 4P3X Intelligent AI™. Created by Kyzel Kreates™.',
        theme_color:      '#050505',
        background_color: '#050505',
        display:          'standalone',
        orientation:      'any',
        scope:            '/',
        // NOTE: start_url preserved for PWA install compatibility — Run 5 will update
        start_url:        '/#/driver-app',
        categories:       ['business', 'productivity', 'utilities'],
        icons: [
          {
            src:     'icons/icon-192x192.png',
            sizes:   '192x192',
            type:    'image/png',
            purpose: 'maskable any',
          },
          {
            src:     'icons/icon-512x512.png',
            sizes:   '512x512',
            type:    'image/png',
            purpose: 'maskable any',
          },
        ],
        shortcuts: [
          {
            // NOTE: name/url preserved for PWA install compatibility — Run 5 will update
            name:        'Response PWA',
            short_name:  'Response',
            url:         '/#/driver-app',
            description: 'Open the TrustSheild Response PWA',
            icons: [{ src: 'icons/icon-192x192.png', sizes: '192x192' }],
          },
        ],
      },

      // ── Workbox config — preserved unchanged ──────────────
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.hostname.includes('supabase.co') && url.pathname.includes('/rest/'),
            handler:    'NetworkFirst',
            options: {
              cacheName:       'supabase-api',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 100, maxAgeSeconds: 30 },
            },
          },
          {
            urlPattern: ({ url }) => url.hostname.includes('supabase.co') && url.pathname.includes('/realtime/'),
            handler:    'NetworkOnly',
          },
          {
            urlPattern: ({ url }) => url.hostname.includes('openstreetmap.org') || url.hostname.includes('osrm.org'),
            handler:    'CacheFirst',
            options: {
              cacheName:  'map-tiles',
              expiration: { maxEntries: 500, maxAgeSeconds: 7 * 24 * 60 * 60 },
            },
          },
          {
            urlPattern: ({ url }) => url.hostname.includes('qrserver.com'),
            handler:    'CacheFirst',
            options: {
              cacheName:  'qr-codes',
              expiration: { maxEntries: 50, maxAgeSeconds: 3600 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler:    'CacheFirst',
            options: {
              cacheName:  'google-fonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },

      devOptions: {
        enabled: true,
        type:    'module',
      },
    }),
  ],

  resolve: {
    extensions: ['.jsx', '.js', '.ts', '.tsx'],
  },

  server: {
    port: 3000,
    host: true,
  },

  build: {
    outDir:    'dist',
    sourcemap: false,
    minify:    'esbuild',
    target:    'es2020',
    rollupOptions: {
      input: 'index.html',
      output: {
        manualChunks: {
          'vendor-react':    ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui':       ['lucide-react', 'clsx'],
          'vendor-state':    ['zustand'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-charts':   ['recharts'],
          'vendor-leaflet':  ['leaflet', 'react-leaflet'],
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },

  optimizeDeps: {
    include: ['leaflet', 'react-leaflet', 'recharts', 'zustand', '@supabase/supabase-js'],
  },
})
