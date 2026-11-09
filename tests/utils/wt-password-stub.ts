import { defineComponent, h } from 'vue';

// [Claude] [https://webitel.atlassian.net/browse/WTEL-10807]
// declares the wt-password props the specs check (actions, generator),
// so they don't depend on the installed @webitel/ui-sdk version
export const WtPasswordStub = defineComponent({
	name: 'WtPassword',
	props: {
		modelValue: {
			type: String,
			default: '',
		},
		actions: {
			type: Array,
			default: () => [],
		},
		generator: {
			type: Function,
			default: undefined,
		},
	},
	emits: [
		'click:copy',
		'click:toggle',
		'update:modelValue',
	],
	setup() {
		return () =>
			h('div', {
				class: 'wt-password-stub',
			});
	},
});
