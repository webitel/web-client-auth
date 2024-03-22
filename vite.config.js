import vue from '@vitejs/plugin-vue';
import { defineConfig, loadEnv } from 'vite';
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
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "./src/assets/css/main.scss";`,
        },
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
