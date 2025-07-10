import vue from '@vitejs/plugin-vue';
import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import createSvgSpritePlugin from 'vite-plugin-svg-sprite';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    base: '/app/auth',
    define: {
      'process.env': JSON.parse(JSON.stringify(env)
      .replaceAll('VITE_', 'VUE_APP_')),
    },
    server: {
      port: 8080,
      host: true,
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
          additionalData: `@use "@/assets/css/main.scss" as *;`,
        },
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@aliasedDeps/api-services/axios': resolve(__dirname, 'src/api/instance'),
      },
    },
    plugins: [
      vue(),
      nodePolyfills({
        include: ['querystring'],
      }),
      createSvgSpritePlugin({
        include: '**/sprite/**.svg',
      }),
    ],
    test: {
      globals: true,
      coverage: {
        enabled: false,
        reporter: 'json',
      },
      environment: 'happy-dom',
      setupFiles: ['./tests/config/config.js'],
    },
  });
}
