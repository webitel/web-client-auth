<template>
  <div class="login-change-password">
    <auth-wrapper >
      <template #title>
        <div class="login-change-password-header">
          <wt-icon icon="lock" color="error"></wt-icon>
          <span class="login-change-password-header--text">{{ message }}</span>
        </div>
      </template>

      <template #default>
        <div class="login-change-password-fields">
          <wt-password
            v-model:model-value="newPassword"
            name="password"
            :label="t('auth.newPassword')"
            :v="v$.newPassword"
            autocomplete
          />

          <wt-password
            v-model:model-value="confirmPassword"
            name="password"
            :label="t('auth.confirmNewPassword')"
            :v="v$.confirmPassword"
            autocomplete
          />
        </div>
      </template>

      <template #actions>
        <wt-button
          color="secondary"
          @click="isExpiredPassword = false"
        >{{ t('reusable.back') }}
        </wt-button>

        <wt-button
          :disabled="v$.$invalid"
          @click="saveChangedPassword"
        >{{ t('reusable.save') }}
        </wt-button>
      </template>

    </auth-wrapper>
  </div>
</template>

<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core';
import { helpers, required, sameAs } from '@vuelidate/validators';
import { storeToRefs } from 'pinia';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import AuthAPI from '../../../api/auth/auth';
import { useNextOnEnter } from '../../../composables/useNextOnEnter';
import { ExpiredPasswordReason } from '../../../enums/ExpiredPasswordReason.enum';
import { auth } from '../../../stores/auth';
import { expiredPassword } from '../../../stores/expiredPassword';
import { tfa } from '../../../stores/tfa';
import AuthWrapper from '../../_shared/auth-wrapper.vue';

const emit = defineEmits<{
  submit: [];
}>();

type PasswordSettings = {
	passwordRegExp: string;
	passwordValidationText?: string;
	passwordCategories?: string;
	PasswordMinLength?: string;
	PasswordContainsLogin?: string;
};

const { t } = useI18n();

const authStore = auth();
const { newPassword, confirmPassword, domain, username, password } =
	storeToRefs(authStore);
const { changePassword } = authStore();

const tfaStore = tfa();
const { enabledTfa } = storeToRefs(tfaStore);
const { get2faSessionId } = tfaStore;

const expiredPasswordStore = expiredPassword();
const { reasonExpiredPassword, isExpiredPassword } =
	storeToRefs(expiredPasswordStore);

const passwordSettings = ref<PasswordSettings>({});

const saveChangedPassword = async () => {
	await changePassword();
	if (enabledTfa.value) {
		try {
			await get2faSessionId({username: username.value, password: password.value});
		} catch (err) {}
	} else {
		emit('submit');
	}
};

const loadPasswordSettings = async (): Promise<void> => {
	const { settings } = await AuthAPI.getPasswordSettings({
		domain: domain.value,
		username: username.value,
		password: password.value,
	});

	passwordSettings.value = settings as PasswordSettings;
};

const regExpSettings = computed(() => {
	if (!passwordSettings.value?.passwordRegExp) {
		return {};
	}

	const regExpInstance = new RegExp(passwordSettings.value.passwordRegExp);
	const vRegExpRule = (v) => regExpInstance.test(v);

	return {
		regex: helpers.withParams(
			{
				regex: passwordSettings.value.passwordRegExp,
			},
			passwordSettings.value.passwordValidationText
				? helpers.withMessage(
						passwordSettings.value.passwordValidationText,
						vRegExpRule,
					)
				: vRegExpRule,
		),
	};
});

const v$ = useVuelidate(
	computed(() => ({
		newPassword: {
			required,
			...regExpSettings.value,
		},
		confirmPassword: {
			sameAs: sameAs(newPassword),
		},
	})),
	{
		newPassword,
		confirmPassword,
	},
	{
		$autoDirty: true,
	},
);

useNextOnEnter(() => !v$.value.$invalid && emit('submit'));

const message = computed(() =>
	reasonExpiredPassword.value === ExpiredPasswordReason.Temporary
		? t('auth.temporaryPasswordMessage')
		: t('auth.expiredPasswordMessage'),
);

onMounted(async () => {
	await loadPasswordSettings();
	v$.value.$touch();
});
onUnmounted(() => {
	newPassword.value = '';
	confirmPassword.value = '';
});
</script>

<style scoped lang="scss">
.login-change-password-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);

  &--text {
    color: var(--error-color);
  }
}

.login-change-password-fields {
  display: flex;
  margin-bottom: var(--spacing-md);
  flex-direction: column;
  gap: var(--spacing-md);
}
</style>
