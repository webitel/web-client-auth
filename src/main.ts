import { setConfig as setApiServicesConfig } from '@webitel/api-services';
import { setDefaultAxiosInstance } from '@webitel/api-services/api/axios';
import { eventBus } from '@webitel/ui-sdk/scripts';
import { install as BreakpointPlugin } from '@webitel/ui-sdk/src/plugins/breakpoint/breakpoint.plugin';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { instance } from './api/instance';
import i18n from './locale/i18n';
import {
	plugin as WebitelUi,
	options as WebitelUiOptions,
} from './plugins/webitel/ui-sdk';
import router from './router/router';
import App from './the-app.vue';

/*
 * This app ejects the package's 401 redirect interceptor and widens
 * validateStatus, so generated api-services clients must call through this
 * instance rather than the package default.
 */
setDefaultAxiosInstance(instance);

const pinia = createPinia();

setApiServicesConfig({
	eventBus,
});

const app = createApp(App)
	.use(router)
	.use(pinia)
	.use(i18n)
	.use(WebitelUi, {
		...WebitelUiOptions,
		router,
	})
	.use(BreakpointPlugin);

app.mount('#app');
