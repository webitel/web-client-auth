import { LoginOptions } from '@webitel/ui-sdk/enums';
import { defineStore, storeToRefs } from 'pinia';
import querystring from 'querystring';
import { ref } from 'vue';

import AuthAPI from '../api/auth/auth';
import { useTfaStore } from './useTfaStore';

export const useSsoStore = defineStore('sso', () => {
	const providers = ref([]);
	const loginOptions = ref(LoginOptions.LOCAL_PASSWORD_ONLY);

	const tfaStore = useTfaStore();
	const { enabledTfa } = storeToRefs(tfaStore);

	async function checkDomain(domain: string) {
		const {
			providers: loginProviders,
			enabledTfa: enabledTfaValue,
			loginOptions: loginOptionsValue,
		} = await AuthAPI.checkDomainExistence(domain);

		providers.value = loginProviders;
		enabledTfa.value = enabledTfaValue;
		loginOptions.value = loginOptionsValue;
	}

	const executeOnlySsoProvider = () => executeProvider(providers.value[0].url);

	function executeProvider(url: string) {
		const query = querystring.stringify({
			redirect_uri: window.location.href,
		});
		window.location.href = `${import.meta.env.VITE_API_URL}/login${url}?${query}`;
	}

	return {
		providers,
		loginOptions,

		checkDomain,
		executeProvider,
		executeOnlySsoProvider,
	};
});
