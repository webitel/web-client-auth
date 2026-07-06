import { StatusCodes } from 'http-status-codes';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';

import { ExpiredPasswordReason } from '../../enums';
import { useExpiredPasswordStore } from '../useExpiredPasswordStore';

describe('useExpiredPasswordStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it('sets expired reason for force-change password error', () => {
		const store = useExpiredPasswordStore();

		store.handleError({
			code: StatusCodes.PRECONDITION_FAILED,
			id: 'app.password.force_change',
		});

		expect(store.isExpiredPassword).toBe(true);
		expect(store.reasonExpiredPassword).toBe(ExpiredPasswordReason.Temporary);
	});

	it('sets expired reason for expired password error', () => {
		const store = useExpiredPasswordStore();

		store.handleError({
			code: StatusCodes.PRECONDITION_FAILED,
			id: 'app.password.expired',
		});

		expect(store.isExpiredPassword).toBe(true);
		expect(store.reasonExpiredPassword).toBe(ExpiredPasswordReason.Expired);
	});

	it('clears state for unrelated errors', () => {
		const store = useExpiredPasswordStore();

		store.handleError({
			code: StatusCodes.PRECONDITION_FAILED,
			id: 'app.password.force_change',
		});
		store.handleError({
			code: StatusCodes.BAD_REQUEST,
			id: 'app.auth.invalid_credentials',
		});

		expect(store.isExpiredPassword).toBe(false);
		expect(store.reasonExpiredPassword).toBe('');
	});

	it('clearExpiredPasswordState resets flags', () => {
		const store = useExpiredPasswordStore();

		store.handleError({
			code: StatusCodes.PRECONDITION_FAILED,
			id: 'app.password.expired',
		});
		store.clearExpiredPasswordState();

		expect(store.isExpiredPassword).toBe(false);
		expect(store.reasonExpiredPassword).toBe('');
	});
});
