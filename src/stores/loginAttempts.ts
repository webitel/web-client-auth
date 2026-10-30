import { useCountdown } from '@vueuse/core';
import { convertDuration } from '@webitel/api-services/scripts';
import { StatusCodes } from 'http-status-codes';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useLoginAttemptsStore = defineStore('loginAttempts', () => {
	const { remaining: remainingSeconds, start, stop } = useCountdown(0);

	// [Claude] the login the block was issued for
	const blockedUsername = ref('');

	const isLoginBlocked = computed(() => remainingSeconds.value > 0);

	const remainingTime = computed(() =>
		convertDuration(remainingSeconds.value, {
			alwaysShowHours: false,
		}),
	);

	// [Claude] without retry_after there is no timer to show, the api keeps the toast then
	function handleError(error, username: string) {
		if (error.code === StatusCodes.TOO_MANY_REQUESTS && error.retry_after > 0) {
			blockedUsername.value = username;
			start(error.retry_after);
		}
	}

	// [Claude] Next with another login drops the block of the previous one
	function resetBlockForOtherLogin(username: string) {
		if (username !== blockedUsername.value) stop();
	}

	return {
		remainingSeconds,
		isLoginBlocked,
		remainingTime,
		blockedUsername,

		handleError,
		resetBlockForOtherLogin,
	};
});
