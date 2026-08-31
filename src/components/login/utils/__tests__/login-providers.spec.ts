import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mountWithWebitelUi } from '../../../../../tests/utils/mount-with-webitel-ui';
import { useSsoStore } from '../../../../stores/sso';
import LoginProviders from '../login-providers.vue';

vi.mock('../../../../api/auth/auth', () => ({
	default: {
		checkDomainExistence: vi.fn(),
	},
}));

const mountComponent = () => mountWithWebitelUi(LoginProviders);

describe('LoginProviders', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it('renders nothing when SSO is not enabled alongside local login', () => {
		const ssoStore = useSsoStore();
		ssoStore.loginOptions = 'local_password_only';
		ssoStore.providers = [
			{
				name: 'Google',
				url: '/oauth/google',
				vendor: 'google',
			},
		];

		const wrapper = mountComponent();

		expect(wrapper.find('.login-providers').exists()).toBe(false);
	});

	it('renders nothing when SSO_AND_LOCAL is set but there are no providers', () => {
		const ssoStore = useSsoStore();
		ssoStore.loginOptions = 'sso_and_local';
		ssoStore.providers = [];

		const wrapper = mountComponent();

		expect(wrapper.find('.login-providers').exists()).toBe(false);
	});

	it('renders one button per provider when SSO_AND_LOCAL is set with providers', () => {
		const ssoStore = useSsoStore();
		ssoStore.loginOptions = 'sso_and_local';
		ssoStore.providers = [
			{
				name: 'Google',
				url: '/oauth/google',
				vendor: 'google',
			},
			{
				name: 'Microsoft',
				url: '/oauth/microsoft',
				vendor: 'microsoft',
			},
		];

		const wrapper = mountComponent();

		expect(wrapper.find('.login-providers').exists()).toBe(true);
		expect(wrapper.findAll('button')).toHaveLength(2);
		expect(wrapper.text()).toContain('Google');
		expect(wrapper.text()).toContain('Microsoft');
	});

	it('calls executeProvider with the provider url when a button is clicked', async () => {
		const ssoStore = useSsoStore();
		ssoStore.loginOptions = 'sso_and_local';
		ssoStore.providers = [
			{
				name: 'Google',
				url: '/oauth/google',
				vendor: 'google',
			},
		];
		const executeProviderSpy = vi
			.spyOn(ssoStore, 'executeProvider')
			.mockImplementation(() => {});

		const wrapper = mountComponent();
		await wrapper.find('button').trigger('click');

		expect(executeProviderSpy).toHaveBeenCalledWith('/oauth/google');
	});
});
