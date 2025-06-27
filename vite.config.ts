import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to 'DISCORD_' to load env vars with that prefix.
  const env = loadEnv(mode, process.cwd(), 'DISCORD_');

  return {
    // Node.js specific configuration
    build: {
      target: 'node18',
      outDir: 'dist',
      rollupOptions: {
        input: 'src/index.ts',
        output: {
          format: 'cjs',
          entryFileNames: '[name].js',
        },
      },
      // Don't bundle node_modules for Node.js apps
      ssr: true,
    },

    // TypeScript configuration
    esbuild: {
      target: 'node18',
    },

    // Path resolution (similar to tsconfig paths)
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },

    // Environment variables - use DISCORD_ prefix
    envPrefix: 'DISCORD_',

    // Development server (for hot reloading)
    server: {
      // Disable server since this is a Node.js app
      port: 0,
    },

    // Optimize dependencies
    optimizeDeps: {
      include: ['discord.js'],
    },

    // Define global constants
    define: {
      // Make env variables available as global constants
      'process.env': env,
    },
  };
});
