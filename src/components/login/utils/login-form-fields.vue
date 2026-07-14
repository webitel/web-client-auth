<template>
  <div class="login-form-fields">
    <wt-input-text
      v-model.trim="username"
      :label="t('vocabulary.login')"
      :v="v$.username"
      name="username"
      autocomplete
    />

    <wt-password
      v-if="displayPassword"
      v-model.trim="password"
      :label="t('auth.password')"
      :v="v$.password"
      name="password"
      autocomplete
    />

    <wt-input-text
      v-if="displayTotp"
      v-model.trim="totp"
      :label="t('auth.code')"
      :v="v$.totp"
    />
  </div>
</template>
<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { required, requiredIf } from '@vuelidate/validators';
import { LoginOptions } from '@webitel/ui-sdk/enums';
import domainValidator from '@webitel/ui-sdk/src/validators/domainValidator';
import { storeToRefs } from 'pinia';
import { computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { useNextOnEnter } from '../../../composables/useNextOnEnter';
import { useAuthStore } from '../../../stores/auth';
import { useSsoStore } from '../../../stores/sso';
import { useTfaStore } from '../../../stores/tfa';

const props = defineProps({
	activeStep: {
		type: Number,
		required: true,
	},
});

const emit = defineEmits<{
	'invalid-change': [
		value: boolean,
	];
	next: [];
	'change-login': [];
}>();

const { t } = useI18n();

const authStore = useAuthStore();
const { username, password, domain } = storeToRefs(authStore);

const tfaStore = useTfaStore();
const { totp, enabledTfa } = storeToRefs(tfaStore);

const ssoStore = useSsoStore();
const { loginOptions } = storeToRefs(ssoStore);

const displayPassword = computed(
	() => props.activeStep !== 1 && loginOptions?.value !== LoginOptions.SSO_ONLY,
);

const displayTotp = computed(() => props.activeStep === 3 && enabledTfa.value);

const rules = computed(() => ({
	username: {
		required,
		domainValidator: () => {
			return domain.value ? domainValidator(domain.value) : false;
		},
	},
	password: {
		required: requiredIf(displayPassword.value),
	},
	totp: {
		required: requiredIf(displayTotp.value),
	},
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

const getDomain = (value: string) => value.split('@')[1] ?? '';

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
	(newValue: string, oldValue?: string) => {
		const newDomain = getDomain(newValue);
		domain.value = newDomain;

		if (typeof oldValue === 'undefined') return;

		if (getDomain(oldValue) !== newDomain) {
			emit('change-login');
		}
	},
	{
		immediate: true,
	},
);

onMounted(() => {
	v$.value.$touch();
});

useNextOnEnter(() => !v$.value.$invalid && emit('next'));
</script>
<style scoped>
.login-form-fields {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}
</style>
