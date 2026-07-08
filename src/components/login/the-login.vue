<template>
  <div class="the-login">
    <div v-if="!isExpiredPassword">
      <auth-wrapper>
        <template #title>{{ titleForm }}</template>
        <template #default>
          <login-form-fields
            :active-step="activeStep"
            @invalid-change="isInvalidForm = $event"
            @next="goNextStep"
            @change-login="changeLogin"
          />
        </template>

        <template #actions>
            <a
              class="the-login__link"
              @click="emit('change-tab', { value: AuthMode.Register })"
            >{{ t('auth.createAccount') }}</a>

            <wt-button
              :loading="!isLoadedCheckDomain"
              :disabled="isInvalidForm"
              @click="goNextStep"
            >{{ t('webitelUI.pagination.next') }}
            </wt-button>
        </template>

        <template #footer>
          <login-providers />
        </template>
      </auth-wrapper>
    </div>

    <login-change-password
      v-else
      @submit="emit('submit')"
    ></login-change-password>
  </div>
</template>
<script setup lang="ts">
import { LoginOptions } from '@webitel/ui-sdk/enums';
import { storeToRefs } from 'pinia';
import { computed, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { AuthMode } from '../../enums/AuthMode.enum';
import { auth } from '../../stores/auth';
import { expiredPassword } from '../../stores/expiredPassword';
import { sso } from '../../stores/sso';
import { tfa } from '../../stores/tfa';
import AuthWrapper from '../_shared/auth-wrapper.vue';
import LoginChangePassword from './utils/login-change-password.vue';
import LoginFormFields from './utils/login-form-fields.vue';
import LoginProviders from './utils/login-providers.vue';

const emit = defineEmits<{
	submit: [];
	'change-tab': [
		payload: {
			value: AuthMode;
		},
	];
}>();

const { t } = useI18n();

const activeStep = ref(1);
const isLoadedCheckDomain = ref(true);
const isInvalidForm = ref(true);

const authStore = auth();
const { domain, username, password } = storeToRefs(authStore);
const { reset } = authStore;

const tfaStore = tfa();
const { enabledTfa } = storeToRefs(tfaStore);
const { get2faSessionId } = tfaStore;

const ssoStore = sso();
const { loginOptions, providers } = storeToRefs(ssoStore);
const { executeOnlySsoProvider, checkDomain } = ssoStore;

const expiredPasswordStore = expiredPassword();
const { isExpiredPassword } = storeToRefs(expiredPasswordStore);

const steps = computed(() => {
	const stepsArray = [
		{
			count: 1,
			description: t('auth.enterLogin'),
		},
		{
			count: 2,
			description: t('auth.enterPassword'),
		},
	];

	if (enabledTfa.value)
		stepsArray.push({
			count: 3,
			description: t('auth.enterCredentials'),
		});

	return stepsArray;
});

const titleForm = computed(() => {
	const currentStep = steps.value.find(
		(step) => step.count === activeStep.value,
	);
	return currentStep ? currentStep.description : '';
});

const changeLogin = () => {
	password.value = '';
	providers.value = [];
	activeStep.value = 1;
};

const goNextStep = async () => {
	if (activeStep.value === 1) {
		try {
			isLoadedCheckDomain.value = false;
			await checkDomain(domain.value);
		} finally {
			isLoadedCheckDomain.value = true;
		}

		if (loginOptions.value === LoginOptions.SSO_ONLY) {
			executeOnlySsoProvider();
		}
		activeStep.value = 2;
		return;
	}

	if (activeStep.value === 2 && enabledTfa.value) {
		await get2faSessionId(username.value, password.value);
		activeStep.value = 3;
		return;
	}

	emit('submit');
};

onUnmounted(() => {
	reset();
});
</script>

<style scoped>
.the-login__link {
  cursor: pointer;
  color: var(--info-color);
}
</style>
