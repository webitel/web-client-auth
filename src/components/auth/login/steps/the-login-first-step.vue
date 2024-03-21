<template>
  <wt-input
    v-model.trim="domain"
    :label="$t('auth.domain')"
    :v="v$.domain"
    @keyup.enter="emit('next')"
  />

  <div class="auth-form-actions">
    <a
      class="auth-form-actions--link"
      @click="emit('register')"
    >{{ $t('auth.createAccount') }}</a>

    <wt-button
      :disabled="v$.$invalid"
      :loading="isSubmitting"
      @click="emit('next')"
    >{{ $t('webitelUI.pagination.next') }}
    </wt-button>
  </div>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import domainValidator from '@webitel/ui-sdk/src/validators/domainValidator';

const props = defineProps({
  isSubmitting: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['register', 'next']);

const store = useStore();

const domain = computed({
  get: () => store.state.auth.domain,
  set: (value) => setProp({ prop: 'domain', value }),
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

async function setProp(payload) {
  return store.dispatch('auth/SET_PROPERTY', payload);
}

onMounted(() => {
  v$.value.$touch();
});
</script>
