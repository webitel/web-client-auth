import { defineStore } from 'pinia';
import { ref } from 'vue';

import AuthAPI from '../api/auth/auth';
import { expiredPassword } from './expiredPassword';

export const tfa = defineStore('tfa', () => {
	const sessionId = ref('');
	const totp = ref('');
	const enabledTfa = ref(false);

	const expiredPasswordStore = expiredPassword();
	const { handleError, clearExpiredPasswordState } = expiredPasswordStore;

	async function login2fa() {
		try {
			return await AuthAPI.login2fa({
				id: sessionId.value,
				totp: totp.value,
			});
		} catch (error) {
			handleError(error);
			throw error;
		}
	}

	async function get2faSessionId({
		username,
		password,
	}: {
		username: string;
		password: string;
	}) {
		try {
			const { id } = await AuthAPI.login({
				username,
				password,
			});
			if (id) sessionId.value = id;
		} finally {
			clearExpiredPasswordState();
		}
	}

	return {
		sessionId,
		totp,
		enabledTfa,

		login2fa,
		get2faSessionId,
	};
});
