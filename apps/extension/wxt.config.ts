import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type WxtViteConfig } from "wxt";
import tsconfigPaths from "vite-tsconfig-paths";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  manifest: {
    name: "Noteminds",
    description:
      "noteminds is a privacy-focused AI studying app that helps you organize your thoughts, get quizzes and flashcards and ideas seamlessly.",
    permissions: ["cookies", "storage", "activeTab"],
    host_permissions: ["http://localhost/*", "https://your-app-url.com/*"],
  },
  modules: ["@wxt-dev/auto-icons"],
  react: {},
  vite: () =>
    ({
      plugins: [tailwindcss(), tsconfigPaths()],
    }) as WxtViteConfig,
});
