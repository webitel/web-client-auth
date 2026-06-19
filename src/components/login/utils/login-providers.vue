<template>
  <footer
    v-if="isOpenProviders"
    class="the-login-providers">
    <div class="the-login-providers__inner">
      <wt-divider />
      <p class="the-login-providers__title">{{ $t('auth.providersTitle') }}</p>
      <wt-divider />
    </div>

    <div class="the-login-providers__wrapper">
      <wt-button
        v-for="({ ticket, icon }) of serviceProviders"
        :key="ticket"
        class="the-login-providers__button"
        color="secondary"
        @click="openProvider({ ticket })"
      >
        <wt-icon
          :icon="icon"
        />
      </wt-button>
    </div>
  </footer>
</template>

<script setup>
import isEmpty from '@webitel/ui-sdk/src/scripts/isEmpty';
import { LoginOptions } from '@webitel/ui-sdk/enums';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import ServiceProvider from '../../../enums/ServiceProvider.enum.js';
import { useSsoStore } from '../../../stores/useSsoStore.ts';

const ssoStore = useSsoStore();
const { loginOptions } = storeToRefs(ssoStore);

const loginProviders = computed(() => ssoStore.loginProviders);
const isOpenProviders = computed(() => loginOptions.value === LoginOptions.SSO_AND_LOCAL && !isEmpty(loginProviders.value));

const serviceProviders = computed(() => {
	const providerIcon = {
		[ServiceProvider.ADFS]: 'adfs',
		[ServiceProvider.GOOGLE]: 'google',
		[ServiceProvider.FACEBOOK]: 'messenger-facebook',
		[ServiceProvider.AZURE]: 'azure',
	};
	return Object.keys(loginProviders.value).map((provider) => ({
		name: provider,
		icon: providerIcon[provider],
		ticket: loginProviders.value[provider],
	}));
});

function openProvider({ ticket }) {
	return ssoStore.executeProvider(ticket);
}
</script>

<style lang="scss" scoped>
.the-login-providers {
  display: flex;
  flex-direction: column;

  &__wrapper {
    display: flex;
    justify-content: space-between;
    gap: var(--spacing-sm);

    .the-login-providers__button {
      display: flex;
      flex: 1 auto;
      justify-content: center;
      align-items: center;
    }
  }

  &__inner {
    display: flex;
    align-items: center;
    margin: var(--spacing-md) 0 var(--spacing-sm) 0;
  }

  &__title {
    width: 100%;
    text-align: center;
  }
}
</style>
