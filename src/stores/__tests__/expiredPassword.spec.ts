import { createTestingPinia } from '@pinia/testing';
import { setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';

import { ExpiredPasswordReason } from '../../enums/ExpiredPasswordReason.enum';
import { useExpiredPasswordStore } from '../expiredPassword';

describe('useExpiredPasswordStore', () => {
	beforeEach(() => {
		setActivePinia(
			createTestingPinia({
				stubActions: false,
			}),
		);
	});

	it('starts with no expired password', () => {
		const store = useExpiredPasswordStore();

		expect(store.isExpiredPassword).toBe(false);
		expect(store.reasonExpiredPassword).toBe('');
	});

	it('marks the password as expired for a force_change error', () => {
		const store = useExpiredPasswordStore();

		store.handleError({
			code: 412,
			id: 'app.password.force_change',
		});

		expect(store.isExpiredPassword).toBe(true);
		expect(store.reasonExpiredPassword).toBe(ExpiredPasswordReason.Temporary);
	});

	it('marks the password as expired for an expired error', () => {
		const store = useExpiredPasswordStore();

		store.handleError({
			code: 412,
			id: 'app.password.expired',
		});

		expect(store.isExpiredPassword).toBe(true);
		expect(store.reasonExpiredPassword).toBe(ExpiredPasswordReason.Expired);
	});

	// [Claude] [https://webitel.atlassian.net/browse/WTEL-11068]
	it('stores the password change token from the 412 error', () => {
		const store = useExpiredPasswordStore();

		store.handleError({
			code: 412,
			id: 'app.password.force_change',
			password_change_token: 'change-token',
		});

		expect(store.passwordChangeToken).toBe('change-token');
	});

	// [Claude] [https://webitel.atlassian.net/browse/WTEL-11068]
	it('drops the password change token when the expired state is cleared', () => {
		const store = useExpiredPasswordStore();
		store.handleError({
			code: 412,
			id: 'app.password.expired',
			password_change_token: 'change-token',
		});

		store.clearExpiredPasswordState();

		expect(store.passwordChangeToken).toBe('');
	});

	it('ignores unrelated errors', () => {
		const store = useExpiredPasswordStore();

		store.handleError({
			code: 500,
			id: 'app.internal.error',
		});

		expect(store.isExpiredPassword).toBe(false);
		expect(store.reasonExpiredPassword).toBe('');
	});

	it('clears the expired state', () => {
		const store = useExpiredPasswordStore();
		store.handleError({
			code: 412,
			id: 'app.password.expired',
		});

		store.clearExpiredPasswordState();

		expect(store.isExpiredPassword).toBe(false);
		expect(store.reasonExpiredPassword).toBe('');
	});
});
