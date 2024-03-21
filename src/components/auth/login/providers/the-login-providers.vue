<template>
  <footer v-if="isOpenProviders" class="auth-form-footer">
    <div class="auth-form-footer__inner">
      <wt-divider />
      <p class="auth-form-footer__title">{{ $t('auth.providersTitle') }}</p>
      <wt-divider />
    </div>

    <div class="auth-form-footer__wrapper">
      <wt-button
        class="auth-form-footer__button"
        v-for="({ ticket, icon }) of serviceProviders"
        :key="ticket"
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
import { computed } from 'vue';
import { useStore } from 'vuex';
import ServiceProvider from '../../../../enums/ServiceProvider.enum';

const store = useStore();

const loginProviders = computed(() => store.state.auth.loginProviders);
const isOpenProviders = computed(() => !isEmpty(loginProviders.value));

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
  return store.dispatch('auth/EXECUTE_PROVIDER', { ticket });
}

function loadAvailableProviders() {
  return store.dispatch('auth/LOAD_SERVICE_PROVIDERS');
}

loadAvailableProviders();
</script>

<style lang="scss" scoped>
.auth-form-footer {
  display: flex;
  flex-direction: column;

  &__wrapper {
    display: flex;
    justify-content: space-between;
    gap: var(--spacing-sm);

    .auth-form-footer__button {
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
