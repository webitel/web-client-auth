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
        :disabled="v$.$invalid"
        :loading="isLoadingDomain"
        @click="checkDomain"
      >{{ $t('webitelUI.pagination.next') }}
      </wt-button>
    </div>
  </div>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import domainValidator from '@webitel/ui-sdk/src/validators/domainValidator';
import AuthAPI from '../../../../api/auth/auth';

const emits = defineEmits(['register', 'next']);

const store = useStore();

const isLoadingDomain = ref(false);

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
};

function setDomain() {
  const lastDomain = localStorage.getItem('domain');
  if(!domain.value) {
    setProp({ prop: 'domain', value: lastDomain })
  }
}

async function checkDomain() {
  isLoadingDomain.value = true;
  try {
    await AuthAPI.checkDomainExistence(domain.value);
    emits('next');
  } finally {
    isLoadingDomain.value = false;
  }
}

onMounted(() => {
  setDomain();
  v$.value.$touch();
});
</script>
