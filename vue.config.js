process.env.VUE_APP_API_URL = process.env.NODE_ENV === 'production' ? '/api' : 'https://dev.webitel.com/api';
// http://192.168.177.199/api
// http://10.10.10.8:1907
// http://10.10.10.25:1907

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
