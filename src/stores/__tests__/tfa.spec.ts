import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import AuthAPI from '../../api/auth/auth';
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

	it('get2faSessionId stores the returned session id', async () => {
		vi.mocked(AuthAPI.login).mockResolvedValue({
			id: 'session-2',
		});
		const store = useTfaStore();

		await store.get2faSessionId({
			username: 'user',
			password: 'pass',
		});

		expect(AuthAPI.login).toHaveBeenCalledWith({
			username: 'user',
			password: 'pass',
		});
		expect(store.sessionId).toBe('session-2');
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
});
