<template>
  <div>
    <div class="auth-form-inner">
      <wt-input
        v-model.trim="username"
        :label="$t('vocabulary.login')"
        :v="v$.username"
      />

      <wt-input
        v-model.trim="password"
        :label="$t('auth.password')"
        :v="v$.password"
        type="password"
        @keyup.enter="emit('next')"
      />

      <wt-input
        v-model.trim="confirmPassword"
        :label="$t('auth.confirmPassword')"
        :v="v$.confirmPassword"
        type="password"
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
        >{{ $t('webitelUI.pagination.next') }}
      </wt-button>
    </div>
  </div>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core';
import { required, sameAs } from '@vuelidate/validators';
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useNextOnEnter } from '../../../../composables/useNextOnEnter.js';

const emit = defineEmits(['back', 'next']);

const store = useStore();

const username = computed({
  get: () => store.state.auth.username,
  set: (value) => setProp({ prop: 'username', value })
});
const password = computed({
  get: () => store.state.auth.password,
  set: (value) => setProp({ prop: 'password', value })
});
const confirmPassword = computed({
  get: () => store.state.auth.confirmPassword,
  set: (value) => setProp({ prop: 'confirmPassword', value })
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
    confirmPassword: {
      sameAs: sameAs(password)
    }
  })),
  { username, password, confirmPassword },
  { $autoDirty: true },
);

useNextOnEnter(() => !v$.value.$invalid && emit('next'));

async function setProp(payload) {
  return store.dispatch('auth/SET_PROPERTY', payload);
};

onMounted(() => { v$.value.$touch() });
</script>
