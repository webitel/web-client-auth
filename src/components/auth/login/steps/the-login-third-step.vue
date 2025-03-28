<template>
  <div>
    <wt-input
      v-model.trim="totp"
      :label="$t('auth.code')"
    />

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
  </div>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';

import { useNextOnEnter } from '../../../../composables/useNextOnEnter.js';

const emit = defineEmits(['back', 'next']);

const store = useStore();

const totp = computed({
  get: () => store.state.auth.totp,
  set: (value) => setProp({ prop: 'totp', value })
});

const v$ = useVuelidate(
  computed(() => ({
    totp: {
      required,
    },
  })),
  { totp },
  { $autoDirty: true },
);

onMounted(() => { v$.value.$touch() });

useNextOnEnter(() => !v$.value.$invalid && emit('next'));

async function setProp(payload) {
  return store.dispatch('auth/SET_PROPERTY', payload);
}

</script>
