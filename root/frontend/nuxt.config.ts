// root/frontend/nuxt.config.ts
export default defineNuxtConfig({
  // подключаем внешний layer
  extends: ['../modules'],

  compatibilityDate: '2024-12-01',

  ssr: true,

  typescript: {
    strict: true
  },

  // включаем pages-роутинг (Nuxt 4)
  pages: true,

  runtimeConfig: {
    public: {
      firebaseProjectId: 'nuxt-fighting-club-demo'
    }
  }
})
