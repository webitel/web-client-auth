import { mount, shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';

import TheRegisterThirdStep from '../the-register-third-step.vue';

const v$ = {
	value: {
		$touch: vi.fn(),
	},
};

describe('TheRegisterThirdStep', () => {
	let store;
	beforeEach(() => {
		store = createStore({
			modules: {
				auth: {
					namespaced: true,
				},
			},
		});
	});

	it('should render', () => {
		const wrapper = shallowMount(TheRegisterThirdStep, {
			global: {
				plugins: [
					store,
				],
			},
			data: () => ({
				v$,
			}),
		});
		expect(wrapper.exists()).toBe(true);
	});

	it('emits "next" event on "next" btn click', () => {
		const wrapper = mount(TheRegisterThirdStep, {
			shallow: true,
			global: {
				plugins: [
					store,
				],
				stubs: {
					WtButton: false,
				},
			},
			data: () => ({
				v$,
			}),
		});
		wrapper
			.findAllComponents({
				name: 'WtButton',
			})
			.find((btn) => {
				return btn.html().toLocaleLowerCase().includes('register');
			})
			.vm.$emit('click');
		expect(wrapper.emitted('next')).toBeTruthy();
	});

	it('emits "back" event on back button click', () => {
		const wrapper = mount(TheRegisterThirdStep, {
			shallow: true,
			global: {
				plugins: [
					store,
				],
				stubs: {
					WtButton: false,
				},
			},
			data: () => ({
				v$,
			}),
		});
		wrapper
			.findAllComponents({
				name: 'WtButton',
			})
			.find((btn) => {
				return btn.html().toLocaleLowerCase().includes('back');
			})
			.vm.$emit('click');
		expect(wrapper.emitted('back')).toBeTruthy();
	});
});
