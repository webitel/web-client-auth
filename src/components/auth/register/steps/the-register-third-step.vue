<template>
  <div>
    <wt-textarea
      :value="certificate"
      :label="$t('auth.key')"
      :v="v$.certificate"
      @input="setProp({ prop: 'certificate', value: $event })"
    ></wt-textarea>

    <div class="auth-form-actions">
      <wt-button
        @click="emits('back')"
        color="secondary"
      >{{ $t('reusable.back') }}
      </wt-button>

      <wt-button
        :disabled="v$.$invalid"
        @click="emits('next')"
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

const emits = defineEmits(['back', 'next']);

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
