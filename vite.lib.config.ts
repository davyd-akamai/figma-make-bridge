import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dts from "vite-plugin-dts";

// Library build for publishing to npm — outputs to dist/. Separate from vite.config.ts,
// which stays dedicated to the local dev preview harness (npm run dev / src/App.tsx).
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({ tsconfigPath: "./tsconfig.build.json", entryRoot: "." }),
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    lib: {
      entry: {
        index: "index.ts",
        styles: "src/library.css",
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        preserveModules: false,
        entryFileNames: "[name].js",
        assetFileNames: "[name][extname]",
      },
    },
    cssCodeSplit: true,
  },
});
