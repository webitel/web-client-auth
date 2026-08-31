import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuthStore } from '../../../stores/auth';
import { useExpiredPasswordStore } from '../../../stores/expiredPassword';
import { useSsoStore } from '../../../stores/sso';
import { useTfaStore } from '../../../stores/tfa';
import TheLogin from '../the-login.vue';

vi.mock('vue-i18n', () => ({
	useI18n: () => ({
		t: (key: string) => key,
	}),
}));

vi.mock('../../../api/auth/auth', () => ({
	default: {
		checkDomainExistence: vi.fn(),
	},
}));

const mountComponent = () =>
	mount(TheLogin, {
		global: {
			stubs: {
				AuthWrapper: {
					template:
						'<div><slot name="title" /><slot /><slot name="actions" /><slot name="footer" /></div>',
				},
				LoginFormFields: {
					emits: [
						'invalid-change',
						'next',
						'change-login',
					],
					template: '<div class="stub-form-fields" />',
					mounted() {
						this.$emit('invalid-change', false);
					},
				},
				LoginProviders: true,
				LoginChangePassword: {
					template:
						'<div class="stub-change-password" @click="$emit(\'submit\')" />',
				},
				WtButton: {
					emits: [
						'click',
					],
					template: '<button @click="$emit(\'click\')"><slot /></button>',
				},
				'wt-button': {
					emits: [
						'click',
					],
					template: '<button @click="$emit(\'click\')"><slot /></button>',
				},
			},
		},
	});

describe('TheLogin', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it('shows the login form when the password is not expired', () => {
		const wrapper = mountComponent();

		expect(wrapper.find('.stub-form-fields').exists()).toBe(true);
		expect(wrapper.find('.stub-change-password').exists()).toBe(false);
	});

	it('switches to the change-password screen when the password is expired', async () => {
		const expiredPasswordStore = useExpiredPasswordStore();
		expiredPasswordStore.isExpiredPassword = true;

		const wrapper = mountComponent();
		await wrapper.vm.$nextTick();

		expect(wrapper.find('.stub-change-password').exists()).toBe(true);
	});

	it('emits submit from the change-password screen', async () => {
		const expiredPasswordStore = useExpiredPasswordStore();
		expiredPasswordStore.isExpiredPassword = true;
		const wrapper = mountComponent();
		await wrapper.vm.$nextTick();

		await wrapper.find('.stub-change-password').trigger('click');

		expect(wrapper.emitted('submit')).toHaveLength(1);
	});

	it('checks the domain and advances to step 2 on the first "next" click', async () => {
		const authStore = useAuthStore();
		authStore.domain = 'example.com';
		const ssoStore = useSsoStore();
		const checkDomainSpy = vi
			.spyOn(ssoStore, 'checkDomain')
			.mockResolvedValue(undefined);

		const wrapper = mountComponent();
		await wrapper.vm.$nextTick();
		await wrapper.find('button').trigger('click');
		await wrapper.vm.$nextTick();

		expect(checkDomainSpy).toHaveBeenCalledWith('example.com');
		expect(wrapper.text()).toContain('auth.enterPassword');
	});

	it('redirects straight to the SSO provider when SSO_ONLY is returned', async () => {
		const ssoStore = useSsoStore();
		vi.spyOn(ssoStore, 'checkDomain').mockImplementation(async () => {
			ssoStore.loginOptions = 'sso_only';
		});
		const executeOnlySsoProviderSpy = vi
			.spyOn(ssoStore, 'executeOnlySsoProvider')
			.mockImplementation(() => {});

		const wrapper = mountComponent();
		await wrapper.vm.$nextTick();
		await wrapper.find('button').trigger('click');
		await wrapper.vm.$nextTick();

		expect(executeOnlySsoProviderSpy).toHaveBeenCalled();
	});

	it('requests a 2FA session id on step 2 when 2FA is enabled, then emits submit on step 3', async () => {
		const authStore = useAuthStore();
		authStore.username = 'user@example.com';
		authStore.password = 'secret';
		const ssoStore = useSsoStore();
		vi.spyOn(ssoStore, 'checkDomain').mockResolvedValue(undefined);
		const tfaStore = useTfaStore();
		tfaStore.enabledTfa = true;
		const get2faSessionIdSpy = vi
			.spyOn(tfaStore, 'get2faSessionId')
			.mockResolvedValue(undefined);

		const wrapper = mountComponent();
		await wrapper.vm.$nextTick();

		await wrapper.find('button').trigger('click'); // step 1 -> 2
		await wrapper.vm.$nextTick();
		await wrapper.find('button').trigger('click'); // step 2 -> 3
		await wrapper.vm.$nextTick();

		expect(get2faSessionIdSpy).toHaveBeenCalledWith({
			username: 'user@example.com',
			password: 'secret',
		});
		expect(wrapper.text()).toContain('auth.enterCredentials');

		await wrapper.find('button').trigger('click'); // step 3 -> submit

		expect(wrapper.emitted('submit')).toHaveLength(1);
	});

	it('emits change-tab with register when the create-account link is clicked', async () => {
		const wrapper = mountComponent();

		await wrapper.find('.the-login__link').trigger('click');

		expect(wrapper.emitted('change-tab')).toEqual([
			[
				{
					value: 'register',
				},
			],
		]);
	});

	it('resets the auth store on unmount', () => {
		const authStore = useAuthStore();
		authStore.username = 'user@example.com';

		const wrapper = mountComponent();
		wrapper.unmount();

		expect(authStore.username).toBe('');
	});
});
