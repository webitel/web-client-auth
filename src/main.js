import Vue from 'vue';
import Vuelidate from 'vuelidate';
import App from './app.vue';
import router from './router/router';
import store from './store/store';
import i18n from './locale/i18n';

import './assets/lib/normalize.scss';
import './assets/lib/bootstrap-grid.min.css';
import './plugins/webitel-ui';

Vue.config.productionTip = false;

Vue.use(Vuelidate);

new Vue({
    router,
    store,
    i18n,
    render: h => h(App),
}).$mount('#app');
