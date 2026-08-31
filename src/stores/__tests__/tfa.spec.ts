import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import AuthAPI from '../../api/auth/auth';
import { useExpiredPasswordStore } from '../expiredPassword';
import { useTfaStore } from '../tfa';

vi.mock('../../api/auth/auth', () => ({
	default: {
		login: vi.fn(),
		login2fa: vi.fn(),
	},
}));

describe('useTfaStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		vi.clearAllMocks();
	});

	it('login2fa sends the session id and totp code', async () => {
		vi.mocked(AuthAPI.login2fa).mockResolvedValue('access-token');
		const store = useTfaStore();
		store.sessionId = 'session-1';
		store.totp = '123456';

		const result = await store.login2fa();

		expect(AuthAPI.login2fa).toHaveBeenCalledWith({
			id: 'session-1',
			totp: '123456',
		});
		expect(result).toBe('access-token');
	});

	it('login2fa rethrows on failure', async () => {
		const error = {
			code: 500,
		};
		vi.mocked(AuthAPI.login2fa).mockRejectedValue(error);
		const store = useTfaStore();

		await expect(store.login2fa()).rejects.toEqual(error);
	});

	it('get2faSessionId stores the returned session id and clears the expired-password state', async () => {
		vi.mocked(AuthAPI.login).mockResolvedValue({
			id: 'session-2',
		});
		const store = useTfaStore();
		const expiredPasswordStore = useExpiredPasswordStore();
		expiredPasswordStore.handleError({
			code: 412,
			id: 'app.password.force_change',
		});

		await store.get2faSessionId({
			username: 'user',
			password: 'pass',
		});

		expect(AuthAPI.login).toHaveBeenCalledWith({
			username: 'user',
			password: 'pass',
		});
		expect(store.sessionId).toBe('session-2');
		expect(expiredPasswordStore.isExpiredPassword).toBe(false);
	});

	it('get2faSessionId leaves the session id untouched when none is returned', async () => {
		vi.mocked(AuthAPI.login).mockResolvedValue({});
		const store = useTfaStore();

		await store.get2faSessionId({
			username: 'user',
			password: 'pass',
		});

		expect(store.sessionId).toBe('');
	});

	// [WTEL-8161] a failed session refresh must not be treated as success:
	// leaving the expired-password state cleared here strands the user on
	// the 2FA code step with a stale sessionId, which the backend then
	// rejects as "wrong_step" no matter how fresh the entered code is.
	it('get2faSessionId keeps the expired-password state and rethrows when the refresh fails', async () => {
		const error = {
			code: 412,
			id: 'app.password.force_change',
		};
		vi.mocked(AuthAPI.login).mockRejectedValue(error);
		const store = useTfaStore();
		store.sessionId = 'stale-session';
		const expiredPasswordStore = useExpiredPasswordStore();

		await expect(
			store.get2faSessionId({
				username: 'user',
				password: 'pass',
			}),
		).rejects.toEqual(error);

		expect(store.sessionId).toBe('stale-session');
		expect(expiredPasswordStore.isExpiredPassword).toBe(true);
	});
});
