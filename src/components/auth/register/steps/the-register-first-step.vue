<template>
  <div>
    <wt-input
      v-model.trim="domain"
      name="domain"
      :label="$t('auth.domain')"
      :v="v$.domain"
      autocomplete
    />

    <div class="auth-form-actions">
      <a
        class="auth-form-actions--link"
        @click="emit('login')"
      >{{ $t('auth.signIn') }}
      </a>

      <wt-button
        :disabled="v$.$invalid"
        :loading="isSubmitting"
        @click="emit('next')"
      >{{ $t('webitelUI.pagination.next') }}
      </wt-button>
    </div>
  </div>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import domainValidator from '@webitel/ui-sdk/src/validators/domainValidator';
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';

import { useNextOnEnter } from '../../../../composables/useNextOnEnter.js';

const props = defineProps({
  isSubmitting: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['login', 'next']);

const store = useStore();

const domain = computed({
  get: () => store.state.auth.domain,
  set: (value) => setProp({ prop: 'domain', value })
});

const v$ = useVuelidate(
  computed(() => ({
    domain: {
      required,
      domainValidator,
    },
  })),
  { domain },
  { $autoDirty: true },
);

useNextOnEnter(() => !v$.value.$invalid && emit('next'));

async function setProp(payload) {
  return store.dispatch('auth/SET_PROPERTY', payload);
}

onMounted(() => {
  v$.value.$touch();
});
</script>
