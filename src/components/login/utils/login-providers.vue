<template>
  <footer
    v-if="isOpenProviders"
    class="login-providers">
    <div class="login-providers__header">
      <wt-divider />
      <p class="login-providers__title">{{ t('auth.providersTitle') }}</p>
      <wt-divider />
    </div>

    <div class="login-providers__wrapper">
      <wt-button
        v-for="({ name, url, icon }) of serviceProviders"
        :key="url"
        color="secondary"
        @click="executeProvider(url)"
      >
        <wt-icon
          :icon="icon"
        /> {{ name }}
      </wt-button>
    </div>
  </footer>
</template>

<script setup>
import {
	LoginOptions,
	SingleSignOnProviderIconMappings,
} from '@webitel/ui-sdk/enums';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { sso } from '../../../stores/sso';

const { t } = useI18n();

const ssoStore = sso();
const { loginOptions: loginOptionsValue, providers } = storeToRefs(ssoStore);
const { executeProvider } = ssoStore;

const isOpenProviders = computed(
	() =>
		loginOptionsValue.value === LoginOptions.SSO_AND_LOCAL &&
		providers.value.length,
);

const serviceProviders = computed(() =>
	providers.value.map(({ name, url, vendor }) => ({
		name,
		icon: SingleSignOnProviderIconMappings[vendor],
		url,
	})),
);
</script>

<style lang="scss" scoped>
.login-providers__header {
  display: flex;
  margin: var(--spacing-md) 0 var(--spacing-sm) 0;
}

.login-providers__title {
  width: 100%;
  text-align: center;
}

.login-providers__wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}
</style>
