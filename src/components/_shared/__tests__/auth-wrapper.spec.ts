import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import AuthWrapper from '../auth-wrapper.vue';

describe('AuthWrapper', () => {
	it('always renders the default slot content', () => {
		const wrapper = mount(AuthWrapper, {
			slots: {
				default: '<p>form fields</p>',
			},
		});

		expect(wrapper.find('.auth-wrapper__content').text()).toBe('form fields');
	});

	it('only renders the title, actions and footer sections when their slots are provided', () => {
		const wrapper = mount(AuthWrapper, {
			slots: {
				default: '<p>form fields</p>',
			},
		});

		expect(wrapper.find('.auth-wrapper__title').exists()).toBe(false);
		expect(wrapper.find('.auth-wrapper__actions').exists()).toBe(false);
		expect(wrapper.find('.auth-wrapper__footer').exists()).toBe(false);
	});

	it('renders title, actions and footer when the slots are used', () => {
		const wrapper = mount(AuthWrapper, {
			slots: {
				title: '<h1>Sign in</h1>',
				default: '<p>form fields</p>',
				actions: '<button>Next</button>',
				footer: '<p>providers</p>',
			},
		});

		expect(wrapper.find('.auth-wrapper__title').text()).toBe('Sign in');
		expect(wrapper.find('.auth-wrapper__actions').text()).toBe('Next');
		expect(wrapper.find('.auth-wrapper__footer').text()).toBe('providers');
	});
});
