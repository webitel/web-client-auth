import { StatusCodes } from 'http-status-codes';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import AuthAPI from '../../api/auth/auth';
import { useAuthStore } from '../useAuthStore';
import { useExpiredPasswordStore } from '../useExpiredPasswordStore';
import { useTfaStore } from '../useTfaStore';

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

	it('login2fa calls AuthAPI.login2fa with session id and totp', async () => {
		const store = useTfaStore();
		store.sessionId = 'session-id';
		store.totp = '123456';

		const login2faMock = vi
			.spyOn(AuthAPI, 'login2fa')
			.mockResolvedValueOnce('token');

		await store.login2fa();

		expect(login2faMock).toHaveBeenCalledWith({
			id: 'session-id',
			totp: '123456',
		});
	});

	it('login2fa delegates expired-password errors to expired password store', async () => {
		const store = useTfaStore();
		const expiredPasswordStore = useExpiredPasswordStore();
		const error = {
			code: StatusCodes.PRECONDITION_FAILED,
			id: 'app.password.expired',
		};

		vi.spyOn(AuthAPI, 'login2fa').mockRejectedValueOnce(error);

		await expect(store.login2fa()).rejects.toEqual(error);
		expect(expiredPasswordStore.isExpiredPassword).toBe(true);
	});

	it('get2faSessionId stores session id returned by login', async () => {
		const authStore = useAuthStore();
		authStore.username = 'username';
		authStore.password = 'password';

		const store = useTfaStore();
		vi.spyOn(AuthAPI, 'login').mockResolvedValueOnce({
			id: 'session-id',
		});

		await store.get2faSessionId();

		expect(store.sessionId).toBe('session-id');
	});

	it('get2faSessionId clears expired password state', async () => {
		const expiredPasswordStore = useExpiredPasswordStore();
		expiredPasswordStore.handleError({
			code: StatusCodes.PRECONDITION_FAILED,
			id: 'app.password.expired',
		});

		const authStore = useAuthStore();
		authStore.username = 'username';
		authStore.password = 'password';

		const store = useTfaStore();
		vi.spyOn(AuthAPI, 'login').mockResolvedValueOnce({
			id: 'session-id',
		});

		await store.get2faSessionId();

		expect(expiredPasswordStore.isExpiredPassword).toBe(false);
	});
});
