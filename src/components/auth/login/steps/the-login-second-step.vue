<template>
  <div>
    <div class="auth-form-inner">
      <wt-input
        :value="domain"
        :label="$t('auth.domain')"
        class="auth-form-inner--domain"
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
    </div>

    <div class="auth-form-actions">
      <wt-button
        @click="emits('back')"
        color="secondary"
      >{{ $t('reusable.back') }}
      </wt-button>

      <wt-button
        :disabled="v$.$invalid"
        @click="emits('next')"
      >{{ $t('vocabulary.login') }}
      </wt-button>
    </div>

    <providers></providers>
  </div>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import Providers from '../providers/the-login-providers.vue';

const emits = defineEmits(['back', 'next']);

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

onMounted(() => { v$.value.$touch() });
</script>

<style lang="scss" scoped>
.auth-form-inner--domain {
  margin-bottom: var(--spacing-sm);
}
</style>
