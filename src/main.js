import { createApp } from "vue";

import i18n from "./locale/i18n";
import BreakpointPlugin from "./plugins/breakpoint";
import {
	plugin as WebitelUi,
	options as WebitelUiOptions,
} from "./plugins/webitel/ui-sdk";
import router from "./router/router";
import store from "./store/store";
import App from "./the-app.vue";

const app = createApp(App)
	.use(router)
	.use(store)
	.use(i18n)
	.use(WebitelUi, {
		...WebitelUiOptions,
		router,
	})
	.use(BreakpointPlugin);

app.mount("#app");
