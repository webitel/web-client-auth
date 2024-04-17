<template>
  <wt-stepper
    :steps="steps"
    :active-step="activeStep"
  >
    <template v-slot:description></template>
    <template v-slot:main>
      <form
        class="auth-form"
        @submit.prevent
      >
        <first-step
          v-if="activeStep === 1"
          :is-submitting="isFirstStepSubmitting"
          @login="backPrevStep"
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

      </form>
    </template>

  </wt-stepper>
</template>

<script>
import { mapActions } from 'vuex';
import FirstStep from '../register/steps/the-register-first-step.vue';
import SecondStep from '../register/steps/the-register-second-step.vue';
import ThirdStep from '../register/steps/the-register-third-step.vue';

export default {
  name: 'the-register',
  components: {
    FirstStep,
    SecondStep,
    ThirdStep,
  },
  data: () => ({
    activeStep: 1,
    isFirstStepSubmitting: false,
  }),

  computed: {
    steps() {
      return [
        {
          name: this.$t('reusable.step', { count: 1 }),
          description: this.$t('auth.enterDomain'),
        },
        {
          name: this.$t('reusable.step', { count: 2 }),
          description: this.$t('auth.enterNewUsername'),
        },
        {
          name: this.$t('reusable.step', { count: 3 }),
          description: this.$t('auth.enterLicense'),
        },
      ];
    },
  },

  methods: {
    ...mapActions('auth', {
      register: 'REGISTER',
      setProp: 'SET_PROPERTY',
      resetState: 'RESET_STATE',
      checkDomain: 'CHECK_DOMAIN',
    }),

    clearPassword() {
      this.setProp({ prop: 'password', value: '' });
      this.setProp({ prop: 'confirmPassword', value: '' });
    },

    backPrevStep() {
      if (this.activeStep === 1) {
        this.$emit('change-tab', { value: 'login' });
      } else {
        this.activeStep = this.activeStep - 1;
      }

      if (this.activeStep === 2) {
        this.clearPassword();
      }
    },

    async goNextStep() {
      if (this.steps.length > this.activeStep) {
        if (this.activeStep === 1) {
          try {
            this.isFirstStepSubmitting = true;
            await this.checkDomain();
          } finally {
            this.isFirstStepSubmitting = false;
          }
        }

        if (this.activeStep === 2) {}

        this.activeStep = this.activeStep + 1;
      } else {
        this.$emit('submit');
      }
    },
  },

  unmounted() {
    this.resetState();
  },
};
</script>

<style lang="scss" scoped>
@import '../../../assets/css/auth/auth';
</style>
