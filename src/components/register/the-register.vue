<template>
  <auth-wrapper>
    <template #default>
      <form class="auth-form-inner">
        <wt-input-text
          v-model.trim="domain"
          name="domain"
          :label="t('auth.domain')"
          :v="v$.domain"
          autocomplete
        />

        <wt-input-text
          v-model.trim="username"
          name="username"
          :label="t('vocabulary.login')"
          :v="v$.username"
        />

        <wt-password
          v-model.trim="password"
          name="password"
          :label="t('auth.password')"
          :v="v$.password"
          @keyup.enter="emit('next')"
        />

        <wt-password
          v-model.trim="confirmPassword"
          :label="t('auth.confirmPassword')"
          :v="v$.confirmPassword"
          @keyup.enter="emit('next')"
        />

        <wt-textarea
          v-model.trim="certificate"
          :label="t('auth.key')"
          :v="v$.certificate"
        />
      </form>
    </template>

    <template #actions>
        <a
          class="the-register--link"
          @click="emit('change-tab', { value: 'login'})"
        >{{ $t('auth.signIn') }}
        </a>

        <wt-button
          :disabled="v$.$invalid"
          @click="emit('submit')"
        >{{ $t('auth.registerSubmit') }}
        </wt-button>
    </template>
  </auth-wrapper>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core/dist';
import { required, sameAs } from '@vuelidate/validators/dist';
import domainValidator from '@webitel/ui-sdk/src/validators/domainValidator';
import { storeToRefs } from 'pinia';
import { onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { computed, onMounted } from 'vue/dist/vue.d.mts';
import { useNextOnEnter } from '../../composables/useNextOnEnter.ts';

import { useAuthStore } from '../../stores/useAuthStore.ts';
import AuthWrapper from '../_shared/auth-wrapper.vue';

const emit = defineEmits([
	'change-tab',
	'submit',
]);

const { t } = useI18n();
const authStore = useAuthStore();

const { domain, username, password, confirmPassword, certificate } = storeToRefs(authStore);
const { reset } = authStore;

const v$ = useVuelidate(
  computed(() => ({
    domain: {
      required,
      domainValidator,
    },
    username: {
      required,
    },
    password: {
      required,
    },
    confirmPassword: {
      required,
      sameAs: sameAs(password),
    },
    certificate: {
      required,
    },
  })),
  {
    domain,
    username,
    password,
    confirmPassword,
    certificate,
  },
  {
    $autoDirty: true,
  },
);

useNextOnEnter(() => !v$.value.$invalid && emit('next')); ///чи треба?

onMounted(() => {
  v$.value.$touch();

});

onUnmounted(() => {
  reset();
});
</script>

<style lang="scss" scoped>
.the-register--link {
  cursor: pointer;
  color: var(--info-color);
}
</style>
