import { mount, type MountingOptions } from '@vue/test-utils';
import WebitelUi from '@webitel/ui-sdk';
import { eventBus } from '@webitel/ui-sdk/scripts';
import { createI18n } from 'vue-i18n';

/**
 * vue-i18n's `t()` falls back to returning the key itself when no
 * translation is registered for it, which is what the specs assert against
 * (e.g. `toContain('auth.temporaryPasswordMessage')`) — so no locale
 * messages need to be loaded for tests.
 */
const i18n = createI18n({
	legacy: false,
	locale: 'en',
	missingWarn: false,
	fallbackWarn: false,
	messages: {
		en: {},
	},
});

export const mountWithWebitelUi = <T,>(
	component: T,
	options: MountingOptions<any> = {},
) =>
	mount(component as any, {
		...options,
		global: {
			...options.global,
			plugins: [
				[WebitelUi, { eventBus, globals: {} }],
				i18n,
				...(options.global?.plugins ?? []),
			],
		},
	});
