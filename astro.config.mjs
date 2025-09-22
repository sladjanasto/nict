// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://nict-sladjanasto.vercel.app",
  integrations: [sitemap()],
  i18n: {
    defaultLocale: "en",
    locales: ["en", "de"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  build: {
    // Inline stylesheets that are smaller than this limit
    inlineStylesheets: "auto",
    // Enable asset optimization
    assets: "_astro",
  },
  vite: {
    build: {
      // Enable CSS code splitting
      cssCodeSplit: true,
      // Rollup options for better optimization
      rollupOptions: {
        output: {
          // Optimize chunk splitting
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              return "vendor";
            }
          },
        },
      },
    },
  },
  image: {
    // Enable image optimization
    domains: ["nict-sladjanasto.vercel.app"],
  },
  compressHTML: true,
});
