import { createTestingPinia } from '@pinia/testing';
import { setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import AuthAPI from '../../api/auth/auth';
import { useAuthStore } from '../auth';
import { useSsoStore } from '../sso';
import { useTfaStore } from '../tfa';

vi.mock('../../api/auth/auth', () => ({
	default: {
		checkDomainExistence: vi.fn(),
	},
}));

describe('useSsoStore', () => {
	beforeEach(() => {
		setActivePinia(
			createTestingPinia({
				stubActions: false,
			}),
		);
		vi.clearAllMocks();
	});

	it('checkDomain populates providers, tfa flag and login options', async () => {
		vi.mocked(AuthAPI.checkDomainExistence).mockResolvedValue({
			providers: [
				{
					url: '/oauth/google',
				},
			],
			enabledTfa: true,
			loginOptions: 'sso_only',
		});
		const store = useSsoStore();
		const tfaStore = useTfaStore();

		await store.checkDomain('example.com');

		expect(AuthAPI.checkDomainExistence).toHaveBeenCalledWith('example.com');
		expect(store.providers).toEqual([
			{
				url: '/oauth/google',
			},
		]);
		expect(store.loginOptions).toBe('sso_only');
		expect(tfaStore.enabledTfa).toBe(true);
	});

	it('checkDomain finishes auth when the domain check returns an access token', async () => {
		vi.mocked(AuthAPI.checkDomainExistence).mockResolvedValue({
			accessToken: 'token',
		});
		const store = useSsoStore();
		const authStore = useAuthStore();
		const onAuthSuccessSpy = vi
			.spyOn(authStore, 'onAuthSuccess')
			.mockResolvedValue(undefined);

		const isAuthenticated = await store.checkDomain('example.com');

		expect(isAuthenticated).toBe(true);
		expect(onAuthSuccessSpy).toHaveBeenCalledWith('token');
		expect(store.providers).toEqual([]);
	});

	describe('executeProvider', () => {
		const originalLocation = window.location;

		beforeEach(() => {
			Reflect.deleteProperty(window, 'location');
			window.location = {
				href: 'https://app.webitel.com/',
			} as Location;
		});

		afterEach(() => {
			window.location = originalLocation;
		});

		it('redirects to the provider login url with a redirect_uri query param', () => {
			const store = useSsoStore();

			store.executeProvider('/oauth/google');

			expect(window.location.href).toContain('/login/oauth/google?');
			expect(window.location.href).toContain(
				`redirect_uri=${encodeURIComponent('https://app.webitel.com/')}`,
			);
		});

		it('saves the domain to localStorage before redirecting to the provider', () => {
			localStorage.removeItem('auth');
			const store = useSsoStore();
			const authStore = useAuthStore();
			authStore.domain = 'example.com';

			store.executeProvider('/oauth/google');

			expect(JSON.parse(localStorage.getItem('auth') ?? '{}')).toEqual({
				domain: 'example.com',
			});
		});

		it('executeOnlySsoProvider uses the first provider url', () => {
			const store = useSsoStore();
			store.providers = [
				{
					url: '/oauth/only',
				},
			];

			store.executeOnlySsoProvider();

			expect(window.location.href).toContain('/login/oauth/only?');
		});
	});
});
