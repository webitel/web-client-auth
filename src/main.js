import { createApp } from 'vue';
import App from './the-app.vue';
import router from './router/router';
import store from './store/store';
import i18n from './locale/i18n';

import './assets/lib/normalize.scss';
import './assets/lib/bootstrap-grid.min.css';
import WebitelUi from './plugins/webitel-ui';
import BreakpointPlugin from './plugins/breakpoint';

const app = createApp(App)
.use(router)
.use(store)
.use(i18n)
.use(...WebitelUi)
.use(BreakpointPlugin);

app.mount('#app');
