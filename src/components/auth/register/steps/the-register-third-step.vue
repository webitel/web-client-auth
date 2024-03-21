<template>
  <div>
    <wt-textarea
      :value="certificate"
      :label="$t('auth.key')"
      :v="v$.certificate"
      @input="setProp({ prop: 'certificate', value: $event })"
      @keyup.enter="emit('next')"
    />

    <div class="auth-form-actions">
      <wt-button
        @click="emit('back')"
        color="secondary"
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

async function setProp(payload) {
  return store.dispatch('auth/SET_PROPERTY', payload);
};

onMounted(() => { v$.value.$touch() });
</script>
