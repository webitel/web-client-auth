import { StatusCodes } from 'http-status-codes';
import { defineStore } from 'pinia';
import { ref } from 'vue';

import { ExpiredPasswordReason } from '../enums';

export const useExpiredPasswordStore = defineStore('expiredPassword', () => {
  const isExpiredPassword = ref(false);
  const reasonExpiredPassword = ref<ExpiredPasswordReason | ''>('');

  function setExpiredPasswordReason(id: string) {
    isExpiredPassword.value = true;
    reasonExpiredPassword.value = id.includes(ExpiredPasswordReason.EXPIRED) ? ExpiredPasswordReason.EXPIRED : ExpiredPasswordReason.TEMPORARY;
  }

  function clearExpiredPasswordState() {
    if (!isExpiredPassword.value) return;
    isExpiredPassword.value = false;
    reasonExpiredPassword.value = '';
  }

  function handleError(error) {
    const isExpired =
      error.code === StatusCodes.PRECONDITION_FAILED &&
      (error.id === 'app.password.force_change' ||
        error.id === 'app.password.expired');

    if (isExpired) {
      setExpiredPasswordReason(error.id);
    } else {
      clearExpiredPasswordState();
    }
  }

  return {
    isExpiredPassword,
    reasonExpiredPassword,

    handleError,
    clearExpiredPasswordState,
  };
});
