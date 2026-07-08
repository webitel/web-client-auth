import {
	applyTransform,
	camelToSnake,
	notify,
	snakeToCamel,
} from '@webitel/api-services/api/transformers';
import { ApiLoginResponse } from '@webitel/api-services/gen/models';
import instance from '../instance';

export const login = async (credentials) => {
	const url = '/login';

	const options = applyTransform(credentials, [
		camelToSnake(),
	]);

	try {
		const response: AxiosResponse<ApiLoginResponse> = await instance.post(
			url,
			options,
		);

		const data = applyTransform(response.data, [
			snakeToCamel(),
		]);

		// [https://webitel.atlassian.net/browse/WTEL-3405]
		// If two-factor authentication is enabled,
		// API returns the two-factor authentication session ID instead of a token
		// and saving to localStorage is not needed

		if (data.accessToken) {
			localStorage.setItem('access-token', data.accessToken);
			return postToken();
		}
		return data;
	} catch (err) {
		throw applyTransform(err, [
			notify,
		]);
	}
};

export const login2fa = async (credentials) => {
	const url = '/login/2fa';
	const options = applyTransform(credentials, [
		camelToSnake(),
	]);
	try {
		const response = await instance.post(url, options);

		const data = applyTransform(response.data, [
			snakeToCamel(),
		]);

		if (data?.accessToken) {
			localStorage.setItem('access-token', data.accessToken);
			return postToken();
		}
	} catch (err) {
		throw applyTransform(err, [
			notify,
		]);
	}
};

export const changePassword = async (data) => {
	const url = '/users/password';
	const options = applyTransform(data, [
		camelToSnake(),
	]);
	try {
		await instance.put(url, options);
	} catch (err) {
		throw applyTransform(err, [
			notify,
		]);
	}
};

export const getPasswordSettings = async (credentials) => {
	const url = 'users/password/settings';
	try {
		const response = await instance.get(url, {
			params: credentials,
		});
		return applyTransform(response.data, [
			snakeToCamel(),
		]);
	} catch (err) {
		throw applyTransform(err, [
			notify,
		]);
	}
};

export const register = async (credentials) => {
	const url = '/signup';
	const options = applyTransform(credentials, [
		camelToSnake(),
	]);

	try {
		await instance.post(`${url}?generate_device=true`, options);
		return await login({
			username: credentials.username,
			password: credentials.password,
			domain: credentials.domain,
		});
	} catch (err) {
		throw applyTransform(err, [
			notify,
		]);
	}
};

const checkSessionByToken = async () => {
	const url = '/userinfo';

	try {
		await instance.get(url);
		return postToken();
	} catch (err) {
		clearToken();
		throw applyTransform(err, [
			notify,
		]);
	}
};

const checkSessionByCookies = async () => {
	const url = '/login';

	/* OAUTH CHECK, IF THIS USER IS AUTHENTICATED AND HAS COOKIES */
	const accessToken = localStorage.getItem('access-token');
	if (!accessToken) {
		try {
			const response = await instance.get(url, {
				withCredentials: true,
			});
			localStorage.setItem('access-token', response.accessToken);
			instance.defaults.headers['X-Webitel-Access'] = postToken() || '';
		} catch (err) {
			console.error(err);
		}
	}
};

const checkCurrentSession = async () => {
	try {
		const token = localStorage.getItem('access-token');
		if (!token || token === 'undefined') {
			clearToken();
			console.info(
				'No valid access-token in localStorage present at checkCurrentSession',
			);
		}

		await checkSessionByCookies();

		// @author @Lera24
		// Don't show notification for unauthorized user during first load app
		const currentToken = localStorage.getItem('access-token');
		if (!currentToken) return;

		const accessToken = await checkSessionByToken();
		return accessToken;
	} catch (err) {
		throw applyTransform(err, [
			notify,
		]);
	}
};

const clearToken = () => {
	localStorage.removeItem('access-token');
	instance.defaults.headers['X-Webitel-Access'] = '';
};

const postToken = () => {
	const accessToken = localStorage.getItem('access-token');
	return accessToken;
};

const checkDomainExistence = async (domain) => {
	const baseUrl = '/login';
	const url = `${baseUrl}?domain=${domain}`;
	try {
		const response = await instance.get(url);
		return applyTransform(response.data, [
			snakeToCamel(),
		]);
	} catch (err) {
		throw applyTransform(err, [
			notify,
		]);
	}
};

const AuthAPI = {
	login,
	login2fa,
	register,
	changePassword,
	getPasswordSettings,
	checkCurrentSession,
	checkDomainExistence,
};

export default AuthAPI;
