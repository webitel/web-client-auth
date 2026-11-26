import { StatusCodes } from 'http-status-codes';
import { defineStore } from 'pinia';
import { ref } from 'vue';

import { ExpiredPasswordReason } from '../enums/ExpiredPasswordReason.enum';

export const useExpiredPasswordStore = defineStore('expiredPassword', () => {
	const isExpired = ref(false);
	const reason = ref<ExpiredPasswordReason | ''>('');
	const passwordChangeToken = ref('');

	function setExpiredPasswordReason(id: string) {
		isExpired.value = true;
		reason.value = id.includes(ExpiredPasswordReason.Expired)
			? ExpiredPasswordReason.Expired
			: ExpiredPasswordReason.Temporary;
	}

	function clearExpiredPasswordState() {
		if (!isExpired.value) return;
		isExpired.value = false;
		reason.value = '';
		passwordChangeToken.value = '';
	}

	function handleError(error) {
		const isExpired =
			error.code === StatusCodes.PRECONDITION_FAILED &&
			(error.id === 'app.password.force_change' ||
				error.id === 'app.password.expired');

		if (isExpired) {
			setExpiredPasswordReason(error.id);
			passwordChangeToken.value =
				error.password_change_token ?? error.passwordChangeToken ?? '';
		} else {
			clearExpiredPasswordState();
		}
	}

	return {
		isExpiredPassword: isExpired,
		reasonExpiredPassword: reason,
		passwordChangeToken,

		handleError,
		clearExpiredPasswordState,
	};
});
