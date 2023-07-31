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
        @click="emits('login')">{{ $t('auth.signIn') }}</a>

      <wt-button
        :disabled="v$.$invalid"
        @click="emits('next')"
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
import domainValidator from '@webitel/ui-sdk/src/scripts/validators/domainValidator';

const emits = defineEmits(['login', 'next']);

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

async function setProp(payload) {
  return store.dispatch('auth/SET_PROPERTY', payload);
}

function setDomain() {
  const lastDomain = localStorage.getItem('domain');
  if(!domain.value) {
    setProp({ prop: 'domain', value: lastDomain })
  }
}

onMounted(() => {
  setDomain();
  v$.value.$touch();
});
</script>
