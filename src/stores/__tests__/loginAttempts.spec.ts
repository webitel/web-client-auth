import { createTestingPinia } from '@pinia/testing';
import { setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useLoginAttemptsStore } from '../loginAttempts';

describe('useLoginAttemptsStore', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		setActivePinia(
			createTestingPinia({
				stubActions: false,
			}),
		);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('starts unblocked', () => {
		const store = useLoginAttemptsStore();

		expect(store.isLoginBlocked).toBe(false);
	});

	it('blocks the login for retry_after seconds on attempts exceeded error', () => {
		const store = useLoginAttemptsStore();

		store.handleError({
			code: 429,
			id: 'app.login.attempts.exceeded',
			retry_after: 240,
		});

		expect(store.isLoginBlocked).toBe(true);
		expect(store.remainingTime).toBe('04:00');

		vi.advanceTimersByTime(1000);
		expect(store.remainingTime).toBe('03:59');
	});

	it('unblocks the login when the timer ends', () => {
		const store = useLoginAttemptsStore();

		store.handleError({
			code: 429,
			retry_after: 2,
		});
		vi.advanceTimersByTime(2000);

		expect(store.isLoginBlocked).toBe(false);
	});

	it('ignores other errors', () => {
		const store = useLoginAttemptsStore();

		store.handleError({
			code: 401,
			id: 'app.login.invalid',
		});

		expect(store.isLoginBlocked).toBe(false);
	});

	it('unblockLogin clears the block', () => {
		const store = useLoginAttemptsStore();

		store.handleError({
			code: 429,
			retry_after: 60,
		});
		store.unblockLogin();

		expect(store.isLoginBlocked).toBe(false);
	});
});
