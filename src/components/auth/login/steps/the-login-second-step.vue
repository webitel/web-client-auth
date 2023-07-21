<template>
  <div>
    <wt-input
      :value="domain"
      :label="$t('auth.domain')"
      disabled
    ></wt-input>

    <wt-input
      v-model.trim="username"
      :label="$t('vocabulary.login')"
      :v="v$.username"
    ></wt-input>

    <wt-input
      v-model.trim="password"
      :label="$t('auth.password')"
      :v="v$.password"
      type="password"
      has-show-password
    ></wt-input>

    <div class="auth-form-actions">
      <wt-button
        @click="$emit('back')"
        color="secondary"
      >{{ $t('auth.back') }}
      </wt-button>

      <wt-button
        :disabled="v$.$invalid"
        @click="$emit('next')"
      >{{ $t('vocabulary.login') }}
      </wt-button>
    </div>

    <providers
      v-if="isOpenProviders"
    ></providers>
  </div>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import Providers from '../providers/the-login-providers.vue';
import isEmpty from '@webitel/ui-sdk/src/scripts/isEmpty';

const store = useStore();

const domain = computed(() => store.state.auth.domain);
const username = computed({
  get: () => store.state.auth.username,
  set: (value) => setProp({ prop: 'username', value })
});
const password = computed({
  get: () => store.state.auth.password,
  set: (value) => setProp({ prop: 'password', value })
});
const loginProviders = computed(() => store.state.auth.loginProviders);
const isOpenProviders = computed(() => !isEmpty(loginProviders.value));

const v$ = useVuelidate(
  computed(() => ({
    username: {
      required,
    },
    password: {
      required,
    },

  })),
  { username, password },
  { $autoDirty: true },
);

async function setProp(payload) {
  return store.dispatch('auth/SET_PROPERTY', payload);
};

async function loadAvailableProviders() {
  return store.dispatch('auth/LOAD_SERVICE_PROVIDERS');
};

onMounted(() => {
  v$.value.$touch();
  loadAvailableProviders();
});
</script>
