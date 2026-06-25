import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react(), svgr()],
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
