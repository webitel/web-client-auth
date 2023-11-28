process.env.VUE_APP_API_URL = process.env.NODE_ENV === 'production'
  ? '/api'
  : 'https://dev.webitel.com/api';

const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  // publicPath: process.env.NODE_ENV === 'production' ? '' : '/',
  publicPath: '/app/auth',
  lintOnSave: false,
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/assets/css/main.scss";
        `,
      },
    },
  },
  // devServer: {
  //   https: true,
  // },
  chainWebpack: (config) => {
    config.plugin('polyfills').use(new NodePolyfillPlugin({
      includeAliases: ['process', 'querystring'],
    }));
    // exclude sprites default building
    config.module
    .rule('svg')
    .exclude.add(/^(.*sprite).*\.svg/); // same as in svg-sprite-loader

    // use svg-sprite-loader to process icons sprite
    config.module
    .rule('svg-sprite')
    .test(/^(.*sprite).*\.svg/) // same as in svg-url-loader
    .use('svg-sprite-loader')
    .loader('svg-sprite-loader');
  },
};
