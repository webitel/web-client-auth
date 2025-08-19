<template>
  <div>
    <wt-textarea
      :model-value="certificate"
      :label="$t('auth.key')"
      :v="v$.certificate"
      @update:model-value="setProp({ prop: 'certificate', value: $event })"
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
      >{{ $t('auth.registerSubmit') }}
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

const certificate = computed(() => store.state.auth.certificate);

const v$ = useVuelidate(
  computed(() => ({
    certificate: {
      required,
    },
  })),
  { certificate },
  { $autoDirty: true },
);

useNextOnEnter(() => !v$.value.$invalid && emit('next'));

async function setProp(payload) {
  return store.dispatch('auth/SET_PROPERTY', payload);
}

onMounted(() => { v$.value.$touch() });
</script>
