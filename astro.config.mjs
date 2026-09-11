// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import netlify from "@astrojs/netlify";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";
import icon from "astro-icon";

// El sitio es monolingüe (es-MX) y se compone únicamente de las fichas de
// propiedad: la portada monta la residencia destacada y `[slug]` el resto.
export default defineConfig({
  site: "https://zerho.mx",

  output: "server",
  adapter: netlify({
    imageCDN: false,
  }),

  integrations: [react(), icon(), robotsTxt(), sitemap()],

  image: {
    // Las fichas viven de la fotografía: conviene servir formatos modernos.
    responsiveStyles: true,
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
