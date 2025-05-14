import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { dependencies } from './package.json';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on mode
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react({
        // Enable React Fast Refresh
        fastRefresh: true,
        // Use Babel to transform JSX
        jsxRuntime: 'automatic',
      })
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Define environment variables
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __APP_ENV__: JSON.stringify(mode),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      // Ensure React is properly defined
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    // Optimize dependencies
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
      esbuildOptions: {
        target: 'es2020',
      },
    },
    // Build options
    build: {
      // Generate source maps for production build
      sourcemap: mode !== 'production',
      // Minify options
      minify: mode === 'production' ? 'esbuild' : false,
      // Output directory
      outDir: 'dist',
      // Asset handling
      assetsDir: 'assets',
      // Chunk size warning limit
      chunkSizeWarningLimit: 1500,
      // Rollup options
      rollupOptions: {
        // External dependencies that shouldn't be bundled
        external: [],
        // Preserve modules for better debugging
        preserveModules: mode !== 'production',
        output: {
          // Chunk naming
          manualChunks: (id) => {
            // React and related packages
            if (id.includes('node_modules/react') ||
                id.includes('node_modules/react-dom') ||
                id.includes('node_modules/react-router-dom')) {
              return 'react';
            }

            // UI libraries
            if (id.includes('node_modules/@radix-ui') ||
                id.includes('node_modules/@headlessui') ||
                id.includes('node_modules/vaul')) {
              return 'ui';
            }

            // Utility libraries
            if (id.includes('node_modules/date-fns') ||
                id.includes('node_modules/clsx') ||
                id.includes('node_modules/tailwind-merge') ||
                id.includes('node_modules/lucide-react') ||
                id.includes('node_modules/axios')) {
              return 'utils';
            }

            // Keep other node_modules in a separate chunk
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          }
        },
      },
    },
    // Preview server options
    preview: {
      port: 8080,
      open: true,
    },
  };
});
