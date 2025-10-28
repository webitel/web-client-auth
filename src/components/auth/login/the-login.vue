<template>
  <wt-stepper
    v-if="!isExpiredPassword"
    :steps="steps"
    :active-step="activeStep"
  >
    <template #description></template>
    <template #main>
<!--     dont know why, but <form> with @submit.prevent still sends request on child input @keyup.enter
        so that, i wrapped it with div
 -->
      <div class="auth-form">
        <first-step
          v-if="activeStep === 1"
          :is-submitting="isFirstStepSubmitting"
          @register="backPrevStep"
          @next="goNextStep"
        ></first-step>

        <second-step
          v-if="activeStep === 2"
          @back="backPrevStep"
          @next="goNextStep"
        ></second-step>

        <third-step
          v-if="activeStep === 3"
          @back="backPrevStep"
          @next="goNextStep"
        ></third-step>
      </div>

    </template>
  </wt-stepper>

  <wt-login-change-password
    v-else
    @save="saveChangedPassword"
    @back="closePasswordChange"
  ></wt-login-change-password>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import FirstStep from '../login/steps/the-login-first-step.vue';
import SecondStep from '../login/steps/the-login-second-step.vue';
import ThirdStep from './steps/the-login-third-step.vue';
import WtLoginChangePassword from './the-login-change-password.vue';

const emit = defineEmits(['change-tab', 'submit']);

const isBackPrevStep = defineModel('isBackPrevStep', { type: Boolean, default: false });

const store = useStore();
const { t } = useI18n();

const activeStep = ref(1);
const isFirstStepSubmitting = ref(false);

const enabledTfa = computed(() => store.state.auth.enabledTfa);
const isExpiredPassword = computed(() => store.state.auth.isExpiredPassword);

const steps = computed(() => {
  const stepsArray = [
    {
      name: t('reusable.step', { count: 1 }),
      description: t('auth.enterDomain'),
    },
    {
      name: t('reusable.step', { count: 2 }),
      description: t('auth.enterUsername'),
    },
  ];

  if (enabledTfa.value) stepsArray.push({
    name: t('reusable.step', { count: 3 }),
    description: t('auth.enterAuthenticationCode'),
  });

  return stepsArray;
});

const backPrevStep = () => {
  if (activeStep.value === 1) {
    emit('change-tab', { value: 'register' });
  } else {
    activeStep.value = activeStep.value - 1;
  }

  if (activeStep.value === 2 && enabledTfa.value) {
    store.dispatch('auth/SET_PROPERTY', { prop: 'totp', value: '' });
  }
};

const goNextStep = async () => {
  if (steps.value.length > activeStep.value) {

    if (activeStep.value === 1) {
      try {
        isFirstStepSubmitting.value = true;
        await store.dispatch('auth/CHECK_DOMAIN');
      } finally {
        isFirstStepSubmitting.value = false;
      }
    }

    if (activeStep.value === 2 && enabledTfa.value) {
        await store.dispatch('auth/GET_2FA_SESSION_ID');
    }
    activeStep.value += 1;

  } else {
    emit('submit');
  }
};

const saveChangedPassword = async () => {
  try {
    await store.dispatch('auth/CHANGE_PASSWORD');
    if(enabledTfa.value) {
      try {
        await store.dispatch('auth/GET_2FA_SESSION_ID');
      } catch (err) {
        activeStep.value = 2
      }
    } else {
      emit('submit');
    }
  } catch (err) {
    throw err;
  }
};

const closePasswordChange = () => {
  store.dispatch('auth/CLEAR_EXPIRED_PASSWORD_FIELDS');
};

watch(() => isBackPrevStep, (value) => {
  if (value && activeStep.value === 3) {
    backPrevStep();
    isBackPrevStep.value = false;
  }
});

onUnmounted(() => {
  store.dispatch('auth/RESET_STATE');
});
</script>

<style lang="scss" scoped>
@import '../../../assets/css/auth/auth';
</style>
