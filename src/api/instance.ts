import { getDefaultInstance } from '@webitel/api-services/api/defaults';
import { errorHandlersInterceptor } from './interceptors/errorHandlers.interceptor';

export const instance = getDefaultInstance();

/*
 * getDefaultInstance() registers handleUnauthorizedInterceptor as response
 * interceptor #0, which on any 401 redirects to VITE_AUTH_URL with the current
 * href as redirectTo. In the auth app itself that means redirecting to itself
 * on its own session-check 401s, nesting redirectTo deeper on every reload.
 * Eject it — this app already handles 401s locally below.
 */
instance.interceptors.response.eject(0);

instance.defaults.headers['X-Webitel-Access'] =
	localStorage.getItem('access-token') || '';

// 300 Multiple Choices is a valid response for service providers check at GET /login?domain
instance.defaults.validateStatus = (status) => status <= 300;

instance.interceptors.response.use(undefined, (error) => {
	const normalizedError = error.response?.data || error;
	const { id } = normalizedError;

	// catches 401 error across all api's
	if (error.response?.status === 401) {
		console.warn('intercepted 401');
		localStorage.removeItem('access-token');
	}

	// Requests marked `silent` (background session checks that 401 on every
	// anonymous page load) reject with the bare data object, not an Error, so
	// notify() (which requires instanceof Error) silently no-ops — otherwise
	// every guest visitor would get an "Unauthorized" toast on page load.
	if (error.config?.silent) {
		return Promise.reject(normalizedError);
	}
	const handler = errorHandlersInterceptor[id];
	if (handler) {
		handler(normalizedError);
	}

	return Promise.reject(Object.assign(error, normalizedError));
});

export default instance;
