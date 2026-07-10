import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';

import AuthAPI from '../api/auth/auth';
import router from '../router/router';
import { useExpiredPasswordStore } from './expiredPassword';
import { useTfaStore } from './tfa';

const cached = JSON.parse(localStorage.getItem('auth') ?? '{}');

export const useAuthStore = defineStore('auth', () => {
	const username = ref(cached.username ?? '');
	const password = ref('');
	const domain = ref(cached.domain ?? '');
	const certificate = ref('');
	const confirmPassword = ref('');
	const newPassword = ref('');

	const expiredPasswordStore = useExpiredPasswordStore();
	const { handleError } = expiredPasswordStore;

	const tfaStore = useTfaStore();
	const { sessionId } = storeToRefs(tfaStore);
	const { login2fa } = tfaStore;

	async function login() {
		try {
			return await AuthAPI.login({
				username: username.value,
				password: password.value,
			});
		} catch (error) {
			handleError(error);
			throw error;
		}
	}

	function register() {
		return AuthAPI.register({
			username: username.value,
			password: password.value,
			certificate: certificate.value,
			domain: domain.value,
		});
	}

	async function submitLogin() {
		const accessToken = await (sessionId.value ? login2fa() : login());
		return onAuthSuccess(accessToken);
	}

	async function submitRegister() {
		const accessToken = await register();
		return onAuthSuccess(accessToken);
	}

	async function checkCurrentSession() {
		const accessToken = await AuthAPI.checkCurrentSession();
		if (!accessToken) return;
		return onAuthSuccess(accessToken);
	}

	async function onAuthSuccess(accessToken: string) {
		let url = '';
		try {
			if(username.value) {
				localStorage.setItem(
					'auth',
					JSON.stringify({
						username: username.value,
					}),
				);
			}

			const redirectTo = router.currentRoute.value.query?.redirectTo;
			const redirect = redirectTo
				? decodeURIComponent(redirectTo as string)
				: import.meta.env.VITE_START_PAGE_URL;

			if (!redirect || !accessToken) {
				throw new Error(
					`No redirect (${redirect}) or access token (${accessToken}) provided`,
				);
			}

			url = redirect.includes('?')
				? `${redirect}&accessToken=${accessToken}`
				: `${redirect}?accessToken=${accessToken}`;
		} finally {
			if (!import.meta.env.DEV && url) window.location.href = url;
		}
	}

	async function changePassword() {
		await AuthAPI.changePassword({
			confirm_password: confirmPassword.value,
			old_password: password.value,
			user_password: newPassword.value,
			username: username.value,
		});
		password.value = newPassword.value;
	}

	function reset() {
		username.value = '';
		password.value = '';
		domain.value = '';
		certificate.value = '';
		confirmPassword.value = '';
		newPassword.value = '';
	}

	return {
		username,
		password,
		domain,
		certificate,
		confirmPassword,
		newPassword,

		submitLogin,
		submitRegister,
		login,
		register,
		checkCurrentSession,
		changePassword,
		reset,
	};
});
