process.env.VUE_APP_API_URL = process.env.NODE_ENV === 'production' ? '/api' : 'https://dev.webitel.com/api';
// http://192.168.177.199/api
// http://10.10.10.8:1907
// http://10.10.10.25:1907

module.exports = {
  // publicPath: '',
  lintOnSave: false,
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "@/assets/css/main.scss";
          @import "@/assets/css/objects/objects.scss";
          @import "@/assets/css/media.scss";
        `
      }
    }
  },
};
