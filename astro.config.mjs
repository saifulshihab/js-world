import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://j-script-world.netlify.app",
  server: {
    port: 3000
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});
