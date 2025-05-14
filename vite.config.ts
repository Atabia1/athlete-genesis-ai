import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on mode
  loadEnv(mode, process.cwd(), '');

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
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@radix-ui/react-dialog',
        '@radix-ui/react-popover',
        '@radix-ui/react-slot',
        '@radix-ui/react-tooltip',
        '@radix-ui/react-tabs',
        '@radix-ui/react-switch',
        '@paystack/inline-js',
        'react-paystack'
      ],
      esbuildOptions: {
        target: 'es2020',
      },
    },
    // Build options
    build: {
      // Generate source maps for production build
      sourcemap: mode !== 'production',
      // Ensure React is properly bundled
      commonjsOptions: {
        include: [/node_modules/],
        transformMixedEsModules: true,
      },
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
          // Manual chunks for better code splitting
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-popover', '@radix-ui/react-slot', '@radix-ui/react-tooltip'],
            'utils-vendor': ['clsx', 'tailwind-merge', 'date-fns', 'lucide-react', 'axios'],
            // Separate chunk for Paystack to isolate any issues
            'paystack-vendor': ['@paystack/inline-js', 'react-paystack']
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
