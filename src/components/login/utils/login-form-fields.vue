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

    <wt-message
      v-if="displayPassword && isLoginBlocked"
      :color="MessageColor.ERROR"
    >
      <div class="login-form-fields__attempts-message">
        <wt-icon
          icon="attention"
          :color="IconColor.ERROR"
        />
        {{ t('auth.maxAttemptsReached', { time: remainingTime }) }}
      </div>
    </wt-message>

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
import { IconColor, LoginOptions, MessageColor } from '@webitel/ui-sdk/enums';
import { storeToRefs } from 'pinia';
import { computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useNextOnEnter } from '../../../composables/useNextOnEnter';
import { useAuthStore } from '../../../stores/auth';
import { useLoginAttemptsStore } from '../../../stores/loginAttempts';
import { useSsoStore } from '../../../stores/sso';
import { useTfaStore } from '../../../stores/tfa';
import { loginValidator } from '../../../validations/validators';

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

const loginAttemptsStore = useLoginAttemptsStore();
const { isLoginBlocked, remainingTime } = storeToRefs(loginAttemptsStore);
const { unblockLogin } = loginAttemptsStore;

const displayPassword = computed(
	() => props.activeStep !== 1 && loginOptions?.value !== LoginOptions.SSO_ONLY,
);

const displayTotp = computed(() => props.activeStep === 3 && enabledTfa.value);

const rules = computed(() => ({
	username: {
		required,
		loginValidator,
	},
	password: {
		required: requiredIf(displayPassword.value),
		// [Claude] [https://webitel.atlassian.net/browse/WTEL-10763]
		// marks the field red and disables Next while the login is blocked
		loginNotBlocked: () => !isLoginBlocked.value,
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

		// [Claude] the block belongs to the user it was issued for
		unblockLogin();

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

.login-form-fields__attempts-message {
  display: flex;
  gap: var(--spacing-xs);
}
</style>
