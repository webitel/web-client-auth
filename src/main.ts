import { setConfig as setApiServicesConfig } from '@webitel/api-services';
import { eventBus } from '@webitel/ui-sdk/scripts';
import { install as BreakpointPlugin } from '@webitel/ui-sdk/src/plugins/breakpoint/breakpoint.plugin';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import i18n from './locale/i18n';
import {
	plugin as WebitelUi,
	options as WebitelUiOptions,
} from './plugins/webitel/ui-sdk';
import router from './router/router';
import App from './the-app.vue';

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
