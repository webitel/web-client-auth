<template>
  <div>
    <div class="auth-form-inner">
      <wt-input
        :label="$t('auth.domain')"
        :value="domain"
        class="auth-form-inner--domain"
        disabled
      />

      <wt-input
        v-model.trim="username"
        name="username"
        :label="$t('vocabulary.login')"
        :v="v$.username"
        autocomplete
      />

      <wt-input
        v-model.trim="password"
        name="password"
        :label="$t('auth.password')"
        :v="v$.password"
        autocomplete
        has-show-password
        type="password"
      />
    </div>

    <div class="auth-form-actions">
      <wt-button
        color="secondary"
        @click="emit('back')"
      >{{ $t('reusable.back') }}
      </wt-button>

      <wt-button
        :disabled="v$.$invalid"
        @click="emit('next')"
      >{{ $t('auth.login') }}
      </wt-button>
    </div>

    <login-providers />
  </div>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';

import { useNextOnEnter } from '../../../../composables/useNextOnEnter.js';
import LoginProviders from '../providers/the-login-providers.vue';

const emit = defineEmits(['back', 'next']);

const store = useStore();
1;
const domain = computed(() => store.state.auth.domain);
const username = computed({
  get: () => store.state.auth.username,
  set: (value) => setProp({ prop: 'username', value }),
});
const password = computed({
  get: () => store.state.auth.password,
  set: (value) => setProp({ prop: 'password', value }),
});

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

onMounted(() => { v$.value.$touch(); });

useNextOnEnter(() => !v$.value.$invalid && emit('next'));

async function setProp(payload) {
  return store.dispatch('auth/SET_PROPERTY', payload);
}
</script>

<style lang="scss" scoped>
.auth-form-inner--domain {
  margin-bottom: var(--spacing-sm);
}
</style>
