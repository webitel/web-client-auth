import { getDefaultInstance } from '@webitel/api-services/api/defaults';
import { errorHandlersInterceptor } from './interceptors/errorHandlers.interceptor';

export const instance = getDefaultInstance();

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
		/*
		 * In auth app, keep 401 local and avoid passing Axios response object further.
		 * This prevents global unauthorized interceptor redirecting the app to itself.
		 */
		return Promise.reject(normalizedError);
	}
	const handler = errorHandlersInterceptor[id];
	if (handler) {
		handler(normalizedError);
	}

	return Promise.reject(Object.assign(error, normalizedError));
});

export default instance;
