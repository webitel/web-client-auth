import { describe, expect, it } from 'vitest';

import { resolveRedirectUrl } from '../resolveRedirectUrl';

const origin = 'https://dev.webitel.com';
const fallback = '/';

describe('resolveRedirectUrl', () => {
	// [https://webitel.atlassian.net/browse/WTEL-10705]
	it.each([
		'https://dast-check.invalid/',
		'//dast-check.invalid/',
		'/\\dast-check.invalid/',
		'\\\\dast-check.invalid/',
		'https://dev.webitel.com.dast-check.invalid/',
		'https://dev.webitel.com@dast-check.invalid/',
		'http://dev.webitel.com/app/admin/',
		'https://dev.webitel.com:8443/app/admin/',
		'javascript:alert(document.domain)',
		'JavaScript:alert(1)',
		' javascript:alert(1)',
		'data:text/html,<script>alert(1)</script>',
		'https://dast-check.invalid/%2F..',
	])('rejects %s and falls back', (redirectTo) => {
		expect(
			resolveRedirectUrl(redirectTo, {
				origin,
				fallback,
			}),
		).toBe(fallback);
	});

	it.each([
		[
			'/app/admin/',
			'https://dev.webitel.com/app/admin/',
		],
		[
			'https://dev.webitel.com/app/workspace/?x=1',
			'https://dev.webitel.com/app/workspace/?x=1',
		],
		[
			'https://dev.webitel.com/crm/contacts#tab',
			'https://dev.webitel.com/crm/contacts#tab',
		],
	])('allows same-origin %s', (redirectTo, expected) => {
		expect(
			resolveRedirectUrl(redirectTo, {
				origin,
				fallback,
			}),
		).toBe(expected);
	});

	it.each([
		undefined,
		null,
		'',
		[
			'/app/admin/',
			'https://dast-check.invalid/',
		],
	])('falls back for a missing or non-string value (%j)', (redirectTo) => {
		expect(
			resolveRedirectUrl(redirectTo, {
				origin,
				fallback,
			}),
		).toBe(fallback);
	});
});
