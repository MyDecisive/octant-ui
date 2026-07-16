import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import path from "path";
import type { Plugin } from 'vite';
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

function googleAnalytics(): Plugin {
  return {
    name: 'google-analytics',
    transformIndexHtml() {
      const id = process.env.VITE_GOOGLE_ANALYTICS_KEY
      if (!id) return []
      return [
        { tag: 'script', attrs: { async: true, src: `https://www.googletagmanager.com/gtag/js?id=${id}` }, injectTo: 'head' },
        { tag: 'script', children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`, injectTo: 'head' },
      ]
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react(), babel({ presets: [reactCompilerPreset()] }), googleAnalytics(), svgr()],
    base: mode == "ghpages" ? "/octant-ui" : "/",
    publicDir: "public",
    build: {
      outDir: "dist", // Output directory for the build. Defaults to 'dist'.
      assetsDir: "assets", // Directory for generated assets relative to outDir. Defaults to 'assets'.
      sourcemap: true, // Generate sourcemaps for production build.
      target: "esnext",
      modulePreload: {
        polyfill: true,
      },
      minify: "esbuild", // Minify output. Can be 'terser' or 'esbuild'.
      manifest: true,
      rollupOptions: {
        // Custom Rollup options for fine-grained control over the build process.
        // For example, you can add specific plugins or configure output formats.
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: [path.resolve(__dirname, "src/styles")],
        },
      },
    },
    resolve: {
      alias: {
        "@components": path.resolve(__dirname, "./src/components"),
        "@constants": path.resolve(__dirname, "./src/constants"),
        "@copy": path.resolve(__dirname, "./src/copy"),
        "@fieldValidation": path.resolve(__dirname, "./src/fieldValidation"),
        "@services": path.resolve(__dirname, "./src/services"),
        "@store": path.resolve(__dirname, "./src/store"),
        "@app-types": path.resolve(__dirname, "./src/types"),
        "@utils": path.resolve(__dirname, "./src/utils"),
      },
    },
  };
});
