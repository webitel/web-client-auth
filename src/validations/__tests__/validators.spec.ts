import { describe, expect, it } from 'vitest';

import { loginValidator } from '../validators';

describe('loginValidator', () => {
	it('returns true for a valid login@domain value', () => {
		expect(loginValidator('user@example.com')).toBe(true);
	});

	it('returns false when there is no @ separator', () => {
		expect(loginValidator('userexample.com')).toBe(false);
	});

	it('returns false when there is more than one @ separator', () => {
		expect(loginValidator('user@sub@example.com')).toBe(false);
	});

	it('returns false when the login part is empty', () => {
		expect(loginValidator('@example.com')).toBe(false);
	});

	it('returns false when the domain part is not a valid domain', () => {
		expect(loginValidator('user@invalid')).toBe(false);
	});
});
