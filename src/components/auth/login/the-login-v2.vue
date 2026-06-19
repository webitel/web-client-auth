<template>
  <div class="login">
    <div v-if="!isExpiredPassword">
      <div class="login-title" >{{ description }}</div>
      <the-login-content
        :active-step="activeStep"
        @invalid-change="isInvalidForm = $event"
      />

      <div class="auth-form-actions">
        <a
          class="auth-form-actions--link"
          @click="emit('register')"
        >{{ t('auth.createAccount') }}</a>

        <wt-button
          :loading="!isLoadedCheckDomain"
          :disabled="isInvalidForm"
          @click="goNextStep"
        >{{ t('webitelUI.pagination.next') }}
        </wt-button>
      </div>

      <login-providers />
    </div>

    <wt-login-change-password
      v-else
      @submit="emit('submit')"
    ></wt-login-change-password>
  </div>

</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '../../../stores/useAuthStore';
import { useExpiredPasswordStore } from '../../../stores/useExpiredPasswordStore';
import { useSsoStore } from '../../../stores/useSsoStore';
import { useTfaStore } from '../../../stores/useTfaStore';
import LoginProviders from './the-login-providers.vue';
import WtLoginChangePassword from './the-login-change-password.vue';
import TheLoginContent from './the-login-content.vue';
import { storeToRefs } from 'pinia';
import { LoginOptions } from '@webitel/ui-sdk/enums';

const { t } = useI18n();

const tfaStore = useTfaStore();
const ssoStore = useSsoStore();
const authStore = useAuthStore();
const expiredPasswordStore = useExpiredPasswordStore();

const activeStep = ref(1);
const isLoadedCheckDomain = ref(true);
const isInvalidForm = ref(true);

const { enabledTfa } = storeToRefs(tfaStore);
const { isExpiredPassword } = storeToRefs(expiredPasswordStore);
const { domain } = storeToRefs(authStore);
const { loginOptions, loginProviders } = storeToRefs(ssoStore);
const { get2faSessionId } = tfaStore;
const { executeOnlySsoProvider, checkDomain } = ssoStore;

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
			description: t('auth.enterAuthenticationCode'),
		});

	return stepsArray;
});

const description = computed(() => {
	const step = steps.value.find((step) => step.count === activeStep.value);
	return step ? step.description : '';
});

const goNextStep = async () => {
    if (activeStep.value === 1) {
      try {
        isLoadedCheckDomain.value = false;
        await checkDomain(domain.value);
      } finally {
        isLoadedCheckDomain.value = true;
        if (loginOptions.value === LoginOptions.SSO_ONLY) {
          executeOnlySsoProvider();
          return;
        }

        activeStep.value = 2;
        return;
      }
    }

      if (activeStep.value === 2 && enabledTfa.value) {
        await get2faSessionId();
        activeStep.value = 3;
        return;
      }
      emit('submit');
}

const emit = defineEmits([
	'register',
	'next',
	'submit',
]);

</script>
<style scoped>
.login-title {
  text-align: center;
  margin-bottom: var(--spacing-lg);
}
</style>
