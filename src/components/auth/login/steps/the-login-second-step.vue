<template>
  <div>
    <div class="auth-form-inner">
      <wt-input
        :value="domain"
        :label="$t('auth.domain')"
        class="auth-form-inner--domain"
        disabled
      />

      <wt-input
        v-model.trim="username"
        :label="$t('vocabulary.login')"
        :v="v$.username"
        @keyup.enter="emit('next')"
      />

      <wt-input
        v-model.trim="password"
        :label="$t('auth.password')"
        :v="v$.password"
        type="password"
        has-show-password
        @keyup.enter="emit('next')"
      />

      <wt-checkbox
        :selected="rememberCredentials"
        :value="true"
        :label="$t('auth.remember')"
        @change="setProp({ prop: 'rememberCredentials', value: $event })"
      />
    </div>

    <div class="auth-form-actions">
      <wt-button
        @click="emit('back')"
        color="secondary"
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
import LoginProviders from '../providers/the-login-providers.vue';

const emit = defineEmits(['back', 'next']);

const store = useStore();
1
const domain = computed(() => store.state.auth.domain);
const username = computed({
  get: () => store.state.auth.username,
  set: (value) => setProp({ prop: 'username', value })
});
const password = computed({
  get: () => store.state.auth.password,
  set: (value) => setProp({ prop: 'password', value })
});
const rememberCredentials = computed({
  get: () => store.state.auth.rememberCredentials,
  set: (value) => setProp({ prop: 'rememberCredentials', value })
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

onMounted(() => { v$.value.$touch() });

async function setProp(payload) {
  return store.dispatch('auth/SET_PROPERTY', payload);
}
</script>

<style lang="scss" scoped>
.auth-form-inner--domain {
  margin-bottom: var(--spacing-sm);
}
</style>
