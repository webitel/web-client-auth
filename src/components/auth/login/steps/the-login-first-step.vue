<template>
  <div>
    <wt-input
      v-model.trim="domain"
      :label="$t('auth.domain')"
      :v="v$.domain"
    ></wt-input>

    <div class="auth-form-actions">
      <a
        class="auth-form-actions--link"
        @click="emits('register')"
      >{{ $t('auth.createAccount') }}</a>

      <wt-button
        @click="emits('next')"
        :disabled="v$.$invalid"
      >{{ $t('webitelUI.pagination.next') }}
      </wt-button>
    </div>
  </div>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';

const emits = defineEmits(['register', 'next']);

const store = useStore();

const domain = computed({
  get: () => store.state.auth.domain,
  set: (value) => setProp({ prop: 'domain', value })
});

const v$ = useVuelidate(
  computed(() => ({
    domain: {
      required,
    },
  })),
  { domain },
  { $autoDirty: true },
);

async function setProp(payload) {
  return store.dispatch('auth/SET_PROPERTY', payload);
};

onMounted(() => { v$.value.$touch() });
</script>
