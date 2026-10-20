/**
 * [https://webitel.atlassian.net/browse/WTEL-10705]
 * `redirectTo` must never point outside the current origin: any link like
 * `/app/auth/?redirectTo=https://evil.example` would otherwise turn the login
 * page into an open redirect (and used to leak the user's token with it).
 *
 * Resolves `redirectTo` against the current origin and returns it only if it
 * stays on that origin (which also rules out `javascript:`, `data:`, etc.,
 * whose origin is opaque). Anything else falls back silently.
 */
export const resolveRedirectUrl = (
	redirectTo: unknown,
	{
		origin = window.location.origin,
		fallback,
	}: {
		origin?: string;
		fallback: string;
	},
): string => {
	if (!redirectTo || typeof redirectTo !== 'string') return fallback;

	try {
		const url = new URL(decodeURIComponent(redirectTo), origin);
		return url.origin === origin ? url.href : fallback;
	} catch {
		return fallback;
	}
};
