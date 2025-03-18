import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: [
    "@nuxt/icon",
    "@nuxtjs/color-mode",
    "@nuxt/image",
    "@nuxt/fonts",
    "@nuxt/ui",
    "@nuxtjs/i18n",
  ],

  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    vueI18n: "./i18n.config.ts",
  },
});
