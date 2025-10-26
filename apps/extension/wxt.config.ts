import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type WxtViteConfig } from "wxt";
import tsconfigPaths from "vite-tsconfig-paths";
// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/module-react"],
  vite: () =>
    ({
      plugins: [tailwindcss(), tsconfigPaths()],
    }) as WxtViteConfig,
});
