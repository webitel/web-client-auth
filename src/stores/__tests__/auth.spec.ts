import { createTestingPinia } from '@pinia/testing';
import { setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import AuthAPI from '../../api/auth/auth';
import { useAuthStore } from '../auth';
import { useExpiredPasswordStore } from '../expiredPassword';

vi.mock('../../api/auth/auth', () => ({
	default: {
		login: vi.fn(),
		register: vi.fn(),
		changePassword: vi.fn(),
		checkCurrentSession: vi.fn(),
	},
}));

describe('useAuthStore', () => {
	beforeEach(() => {
		setActivePinia(
			createTestingPinia({
				stubActions: false,
			}),
		);
		vi.clearAllMocks();
	});

	it('login sends the current username and password', async () => {
		vi.mocked(AuthAPI.login).mockResolvedValue('token');
		const store = useAuthStore();
		store.username = 'user@example.com';
		store.password = 'secret';

		const result = await store.login();

		expect(AuthAPI.login).toHaveBeenCalledWith({
			username: 'user@example.com',
			password: 'secret',
		});
		expect(result).toBe('token');
	});

	it('login reports the error to the expired password store and rethrows', async () => {
		const error = {
			code: 412,
			id: 'app.password.expired',
		};
		vi.mocked(AuthAPI.login).mockRejectedValue(error);
		const store = useAuthStore();
		const expiredPasswordStore = useExpiredPasswordStore();

		await expect(store.login()).rejects.toEqual(error);
		expect(expiredPasswordStore.isExpiredPassword).toBe(true);
	});

	it('register sends username, password, certificate and domain', () => {
		const store = useAuthStore();
		store.username = 'user@example.com';
		store.password = 'secret';
		store.certificate = 'cert';
		store.domain = 'example.com';

		store.register();

		expect(AuthAPI.register).toHaveBeenCalledWith({
			username: 'user@example.com',
			password: 'secret',
			certificate: 'cert',
			domain: 'example.com',
		});
	});

	it('changePassword sends the mapped fields and updates the current password', async () => {
		vi.mocked(AuthAPI.changePassword).mockResolvedValue(undefined);
		const store = useAuthStore();
		store.username = 'user@example.com';
		store.domain = 'example.com';
		store.password = 'old-pass';
		store.newPassword = 'new-pass';
		store.confirmPassword = 'new-pass';

		await store.changePassword();

		expect(AuthAPI.changePassword).toHaveBeenCalledWith({
			confirm_password: 'new-pass',
			old_password: 'old-pass',
			user_password: 'new-pass',
			username: 'user@example.com',
			domain: 'example.com',
		});
		expect(store.password).toBe('new-pass');
	});

	it('checkCurrentSession does nothing when there is no access token', async () => {
		vi.mocked(AuthAPI.checkCurrentSession).mockResolvedValue(undefined);
		const store = useAuthStore();

		const result = await store.checkCurrentSession();

		expect(result).toBeUndefined();
	});

	it('reset clears all credential fields', () => {
		const store = useAuthStore();
		store.username = 'user@example.com';
		store.password = 'secret';
		store.domain = 'example.com';
		store.certificate = 'cert';
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
