import querystring from 'querystring';
import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';
import { LoginOptions } from '@webitel/ui-sdk/enums';

import AuthAPI from '../api/auth/auth';
import { useTfaStore } from './useTfaStore';


type LoginProvider = Record<string, string>;

export const useSsoStore = defineStore('sso', () => {
  const loginProviders = ref<LoginProvider>({});
  const loginOptions = ref(LoginOptions.LOCAL_PASSWORD_ONLY);

  const tfaStore = useTfaStore();
  const { enabledTfa } = storeToRefs(tfaStore);

  async function checkDomain(domain: string) {
    const { federation = {}, enabledTfa: enabledTfaValue, loginOptions: loginOptionsValue } =
      await AuthAPI.checkDomainExistence(domain);

    loginProviders.value = federation;
    enabledTfa.value = enabledTfaValue;
    loginOptions.value = loginOptionsValue;
  }

  function executeOnlySsoProvider() {
    executeProvider(Object.values(loginProviders.value)[0])
  }

  function executeProvider(ticket: string) {
    const query = querystring.stringify({ redirect_uri: window.location.href });
    window.location.href = `${import.meta.env.VITE_API_URL}/login${ticket}?${query}`;
  }

  return {
    loginProviders,
    loginOptions,

    checkDomain,
    executeProvider,
    executeOnlySsoProvider,
  };
});
