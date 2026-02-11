import { mount, shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';

import router from '../../../router/router.js';
import TheAuth from '../the-auth.vue';

describe('TheAuth', () => {
	let store;

	beforeEach(() => {
		store = createStore({
			modules: {
				auth: {
					namespaced: true,
				},
				appearance: {
					namespaced: true,
				},
			},
		});
	});

	it('should render', () => {
		const wrapper = shallowMount(TheAuth, {
			global: {
				plugins: [
					store,
					router,
				],
				mocks: {
					$breakpoint: {},
				},
			},
		});
		expect(wrapper.exists()).toBe(true);
	});

	it('calls "submit auth" action on submit event', () => {
		const mock = vi
			.spyOn(TheAuth.methods, 'submitAuth')
			.mockImplementationOnce(vi.fn());

		const wrapper = mount(TheAuth, {
			global: {
				plugins: [
					store,
					router,
				],
				mocks: {
					$breakpoint: {},
				},
			},
		});

		wrapper
			.findComponent({
				name: 'TheLogin',
			})
			.vm.$emit('submit');

		expect(mock).toHaveBeenCalled();
	});
});
