import { useCountdown } from '@vueuse/core';
import { convertDuration } from '@webitel/api-services/scripts';
import { StatusCodes } from 'http-status-codes';
import { defineStore } from 'pinia';
import { computed } from 'vue';

export const useLoginAttemptsStore = defineStore('loginAttempts', () => {
	const {
		remaining: remainingSeconds,
		start,
		stop: unblockLogin,
	} = useCountdown(0);

	const isLoginBlocked = computed(() => remainingSeconds.value > 0);

	const remainingTime = computed(() =>
		convertDuration(remainingSeconds.value, {
			alwaysShowHours: false,
		}),
	);

	function handleError(error) {
		if (error.code === StatusCodes.TOO_MANY_REQUESTS) {
			start(error.retry_after);
		}
	}

	return {
		remainingSeconds,
		isLoginBlocked,
		remainingTime,

		handleError,
		unblockLogin,
	};
});
