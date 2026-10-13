// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  devtools: { enabled: false },
  modules: ['@nuxt/fonts'],
  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      title: 'Звёздный остров — полный доступ',
      meta: [
        // viewport-fit=cover: paint under the notch/home indicator, padding comes from env(safe-area-inset-*)
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#8E63FF' },
        { name: 'color-scheme', content: 'light' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
    },
  },

  // Self-hosted Nunito (same family as in the Figma file), only the weights the design uses
  fonts: {
    families: [
      { name: 'Nunito', provider: 'google', weights: [600, 700, 800], styles: ['normal'], subsets: ['cyrillic', 'latin'], preload: true },
    ],
  },

  runtimeConfig: {
    // Overridden by NUXT_DATABASE_URL; server/utils/db.ts also falls back to DATABASE_URL (set by the Vercel ↔ Neon integration)
    databaseUrl: '',
  },

  typescript: { strict: true },
})
