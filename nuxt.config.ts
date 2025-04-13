// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: [
    '@nuxt/image',
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
  ],
  runtimeConfig: {
    public: {
      baseUrl: "",
      domainUrl: "https://sim.wifi247.vn",
      ga: process.env.NUXT_PUBLIC_GA || "G-3TM6KKY84Y",
    },
  },
})