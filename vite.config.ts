/// <reference types="vitest" />

import * as path from "path";
import { defineConfig } from "vite";
import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import Unimport from "unimport/unplugin";
import chalk from "chalk";

import chromeManifest from "./src/manifest.chrome";
import firefoxManifest from "./src/manifest.firefox";
import { APP_CONFIG } from "./src/app.config";
import unimportConfig from "./src/types/unimport.config";
import tailwindcss from "@tailwindcss/vite";

import vitePluginForceRestartOnChanges from "./vite-plugins/vite-plugin-force-restart-on-changes";
import vitePluginReloadOnDynamicallyInjectedStyleChanges from "./vite-plugins/vite-plugin-reload-on-dynamically-injected-style-changes";
import viteTouchGlobalCss from "./vite-plugins/vite-plugin-touch-global-css";

console.log(
  "\n",
  chalk.bold.underline.yellow("TARGET BROWSER:", APP_CONFIG.BROWSER),
);

export default defineConfig(() => ({
  base: "./",
  build: {
    target: ["chrome89", "edge89", "firefox109"],
    emptyOutDir: true,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        chunkFileNames: "assets/cplx-[hash].js",
        assetFileNames: "assets/cplx-[hash][extname]",
        entryFileNames: "assets/cplx-[hash].js",
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    crx({
      manifest:
        APP_CONFIG.BROWSER === "chrome" ? chromeManifest : firefoxManifest,
      browser: APP_CONFIG.BROWSER,
    }),
    Unimport.vite(unimportConfig),
    vitePluginReloadOnDynamicallyInjectedStyleChanges({
      excludeString: ["@/assets/cs.css"],
    }),
    vitePluginForceRestartOnChanges({
      folders: ["public"],
    }),
    viteTouchGlobalCss({
      cssFilePath: path.resolve(__dirname, "src/assets/index.css"),
      watchFiles: [
        path.resolve(__dirname, "src/"),
        path.resolve(__dirname, "public/"),
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "~": path.resolve(__dirname, "./"),
    },
  },
  server: {
    port: 5173,
    hmr: {
      host: "localhost",
      protocol: "ws",
    },
  },
  test: {
    exclude: ["node_modules", "e2e/**"],
    setupFiles: ["./tests/vitest.setup.ts"],
  },
}));
