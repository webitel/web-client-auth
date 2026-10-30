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

		store.handleError(
			{
				code: 429,
				id: 'app.login.attempts.exceeded',
				retry_after: 240,
			},
			'user@example.com',
		);

		expect(store.isLoginBlocked).toBe(true);
		expect(store.remainingTime).toBe('04:00');

		vi.advanceTimersByTime(1000);
		expect(store.remainingTime).toBe('03:59');
	});

	it('unblocks the login when the timer ends', () => {
		const store = useLoginAttemptsStore();

		store.handleError(
			{
				code: 429,
				retry_after: 2,
			},
			'user@example.com',
		);
		vi.advanceTimersByTime(2000);

		expect(store.isLoginBlocked).toBe(false);
	});

	it('does not block without retry_after', () => {
		const store = useLoginAttemptsStore();

		store.handleError(
			{
				code: 429,
			},
			'user@example.com',
		);

		expect(store.isLoginBlocked).toBe(false);
	});

	it('remembers the login the block was issued for', () => {
		const store = useLoginAttemptsStore();

		store.handleError(
			{
				code: 429,
				retry_after: 60,
			},
			'user@example.com',
		);

		expect(store.blockedUsername).toBe('user@example.com');
	});

	it('resets the block for another login', () => {
		const store = useLoginAttemptsStore();
		store.handleError(
			{
				code: 429,
				retry_after: 60,
			},
			'user@example.com',
		);

		store.resetBlockForOtherLogin('user@example.com');
		expect(store.isLoginBlocked).toBe(true);

		store.resetBlockForOtherLogin('other@example.com');
		expect(store.isLoginBlocked).toBe(false);
	});

	it('ignores other errors', () => {
		const store = useLoginAttemptsStore();

		store.handleError(
			{
				code: 401,
				id: 'app.login.invalid',
			},
			'user@example.com',
		);

		expect(store.isLoginBlocked).toBe(false);
	});
});
