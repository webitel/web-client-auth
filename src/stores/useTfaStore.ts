import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';

import AuthAPI from '../api/auth/auth';
import { useAuthStore } from './useAuthStore';
import { useExpiredPasswordStore } from './useExpiredPasswordStore';

export const useTfaStore = defineStore('tfa', () => {
	const sessionId = ref('');
	const totp = ref('');
	const enabledTfa = ref(false);

	const expiredPasswordStore = useExpiredPasswordStore();
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

	async function get2faSessionId() {
		const authStore = useAuthStore();
		const { username, password } = storeToRefs(authStore);

		try {
			const { id } = await AuthAPI.login({
				username: username?.value,
				password: password?.value,
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
