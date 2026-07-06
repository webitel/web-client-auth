import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import AuthAPI from '../../api/auth/auth';
import router from '../../router/router';
import { useAuthStore } from '../useAuthStore';
import { useTfaStore } from '../useTfaStore';

vi.mock('../../api/auth/auth', () => ({
	default: {
		login: vi.fn(),
		login2fa: vi.fn(),
		register: vi.fn(),
		checkCurrentSession: vi.fn(),
		changePassword: vi.fn(),
	},
}));

const redirectUrl = 'https://app.example.com';

describe('useAuthStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		localStorage.clear();
		vi.clearAllMocks();
		router.currentRoute.value.query = {
			redirectTo: encodeURIComponent(redirectUrl),
		};
	});

	it('login calls AuthAPI.login with username and password from state', async () => {
		const store = useAuthStore();
		store.username = 'username';
		store.password = 'password';

		const loginMock = vi.spyOn(AuthAPI, 'login').mockResolvedValueOnce('token');

		await store.login();

		expect(loginMock).toHaveBeenCalledWith({
			username: 'username',
			password: 'password',
		});
	});

	it('register calls AuthAPI.register with data from state', async () => {
		const store = useAuthStore();
		store.username = 'username';
		store.password = 'password';
		store.domain = 'domain';
		store.certificate = 'certificate';

		const registerMock = vi
			.spyOn(AuthAPI, 'register')
			.mockResolvedValueOnce('token');

		await store.register();

		expect(registerMock).toHaveBeenCalledWith({
			username: 'username',
			password: 'password',
			domain: 'domain',
			certificate: 'certificate',
		});
	});

	it('submitLogin uses login2fa when tfa session id is present', async () => {
		const tfaStore = useTfaStore();
		tfaStore.sessionId = 'session-id';

		const store = useAuthStore();
		const login2faMock = vi
			.spyOn(AuthAPI, 'login2fa')
			.mockResolvedValueOnce('token');
		const loginMock = vi.spyOn(AuthAPI, 'login');

		await store.submitLogin();

		expect(login2faMock).toHaveBeenCalledWith({
			id: 'session-id',
			totp: '',
		});
		expect(loginMock).not.toHaveBeenCalled();
	});

	it('submitLogin uses login when tfa session id is absent', async () => {
		const store = useAuthStore();
		const loginMock = vi.spyOn(AuthAPI, 'login').mockResolvedValueOnce('token');

		await store.submitLogin();

		expect(loginMock).toHaveBeenCalled();
	});

	it('checkCurrentSession calls AuthAPI.checkCurrentSession', async () => {
		const store = useAuthStore();
		const checkSessionMock = vi
			.spyOn(AuthAPI, 'checkCurrentSession')
			.mockResolvedValueOnce('token');

		await store.checkCurrentSession();

		expect(checkSessionMock).toHaveBeenCalled();
	});

	it('changePassword calls AuthAPI.changePassword and updates password', async () => {
		const store = useAuthStore();
		store.username = 'username';
		store.password = 'old-password';
		store.newPassword = 'new-password';
		store.confirmPassword = 'new-password';

		const changePasswordMock = vi
			.spyOn(AuthAPI, 'changePassword')
			.mockResolvedValueOnce(undefined);

		await store.changePassword();

		expect(changePasswordMock).toHaveBeenCalledWith({
			confirm_password: 'new-password',
			old_password: 'old-password',
			user_password: 'new-password',
			username: 'username',
		});
		expect(store.password).toBe('new-password');
	});

	it('reset clears auth form state', () => {
		const store = useAuthStore();
		store.username = 'username';
		store.password = 'password';
		store.domain = 'domain';
		store.certificate = 'certificate';
		store.confirmPassword = 'confirm';
		store.newPassword = 'new';

		store.reset();

		expect(store.username).toBe('');
		expect(store.password).toBe('');
		expect(store.domain).toBe('');
		expect(store.certificate).toBe('');
		expect(store.confirmPassword).toBe('');
		expect(store.newPassword).toBe('');
	});
});
