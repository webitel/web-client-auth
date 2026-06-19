<template>
  <form class="the-login-form-fields">
    <wt-input-text
      v-model.trim="username"
      :label="t('vocabulary.login')"
      :v="v$.username"
      autocomplete
    />

    <wt-password
      v-if="displayPassword"
      v-model.trim="password"
      :label="t('auth.password')"
      :v="v$.password"
      autocomplete
    />

    <wt-input-text
      v-if="displayTotp"
      v-model.trim="totp"
      :label="t('auth.code')"
      :v="v$.totp"
    />
  </form>
</template>
<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { required, requiredIf } from '@vuelidate/validators';
import { LoginOptions } from '@webitel/ui-sdk/enums';
import domainValidator from '@webitel/ui-sdk/src/validators/domainValidator';
import { storeToRefs } from 'pinia';
import { computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { useNextOnEnter } from '../../../composables/useNextOnEnter.js';
import { useAuthStore } from '../../../stores/useAuthStore';
import { useSsoStore } from '../../../stores/useSsoStore';
import { useTfaStore } from '../../../stores/useTfaStore';

const emit = defineEmits([
	'invalid-change',
	'submit',
]);

const { t } = useI18n();

const props = defineProps({
	activeStep: {
		type: Number,
		required: true,
	},
});

const authStore = useAuthStore();
const tfaStore = useTfaStore();
const ssoStore = useSsoStore();

const { enabledTfa } = storeToRefs(tfaStore);
const { username, password, domain } = storeToRefs(authStore);
const { totp } = storeToRefs(tfaStore);
const { loginOptions } = storeToRefs(ssoStore);

const displayPassword = computed(() =>
  props.activeStep !== 1 && loginOptions.value !== LoginOptions.SSO_ONLY);

const displayTotp = computed(() => props.activeStep === 3 && enabledTfa.value);

const rules = computed(() => ({
	username: {
    required,
    domainValidator: () => {
      return domain.value ? domainValidator(domain.value) : false;
  },
  },
  password: { required: requiredIf(displayPassword.value) },
	totp: { required: requiredIf(displayTotp.value) },
}));

const v$ = useVuelidate(
	rules,
	{
		username,
		password,
		totp,
	},
	{
		$autoDirty: true,
	},
);

watch(
	() => v$.value.$invalid,
	(value) => {
		emit('invalid-change', value);
	},
	{
		immediate: true,
	},
);

watch(
  () => username.value,
  (value) => {
    domain.value = value.split('@')[1] ?? '';
  },
);

onMounted(() => {
	v$.value.$touch();
});

useNextOnEnter(() => !v$.value.$invalid && emit('submit'));
</script>
<style scoped>
.the-login-form-fields {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}
</style>
