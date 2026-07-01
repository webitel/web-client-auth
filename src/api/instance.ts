import { generateInstance } from '@webitel/api-services/api/axios';
import updateTokenInterceptor from '@webitel/ui-sdk/src/api/interceptors/request/updateToken.interceptor';
import handleUnauthorizedInterceptor from '@webitel/ui-sdk/src/api/interceptors/response/handleUnauthorized.interceptor';
import { errorHandlersInterceptor } from './interceptors/errorHandlers.interceptor';

const handleErrors = (error) => {
	const normalizedError = error.response?.data || error;
	const { id } = normalizedError;

	// catches 401 error across all api's
	if (error.response?.status === 401) {
		console.warn('intercepted 401');
		localStorage.removeItem('access-token');
	}
	const handler = errorHandlersInterceptor[id];
	if (handler) {
		handler(normalizedError);
	}

	return Promise.reject(normalizedError);
};

const handleErrorsInterceptor = [
	(response) => response,
	handleErrors,
];

const instance = generateInstance({
	interceptors: {
		request: [
			updateTokenInterceptor,
		],
		response: [
			handleErrorsInterceptor,
			handleUnauthorizedInterceptor,
		],
	},
	baseURL: import.meta.env.VITE_API_URL,
	validateStatus: (status) => status <= 300,
});

export default instance;
