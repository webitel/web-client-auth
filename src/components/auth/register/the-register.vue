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
          @change-tab="backPrevStep"
          @go-next-step="goNextStep"
        ></first-step>

        <second-step
          v-if="activeStep === 2"
          :confirm-password="confirmPassword"
          @back-prev-step="backPrevStep"
          @go-next-step="goNextStep"
          @update:confirm-password="updateConfirmPassword"
        ></second-step>

        <third-step
          v-if="activeStep === 3"
          @back-prev-step="backPrevStep"
          @go-next-step="goNextStep"
        ></third-step>

      </form>
    </template>

  </wt-stepper>
</template>

<script>
import { mapActions } from 'vuex';
import WtStepper from '../wt-stepper.vue';
import FirstStep from '../register/steps/the-register-first-step.vue';
import SecondStep from '../register/steps/the-register-second-step.vue';
import ThirdStep from '../register/steps/the-register-third-step.vue';

export default {
  name: 'the-register',

  data() {
    return {
      confirmPassword: '',
      activeStep: 1,
    };
  },
  components: {
    WtStepper,
    FirstStep,
    SecondStep,
    ThirdStep,
  },

  computed: {
    steps() {
      return [
        {
          name: this.$t('auth.step', { count: 1 }),
          description: this.$t('auth.enterDomain'),
        },
        {
          name: this.$t('auth.step', { count: 2 }),
          description: this.$t('auth.enterNewUsername'),
        },
        {
          name: this.$t('auth.step', { count: 3 }),
          description: this.$t('auth.enterLicense'),
        },
      ];
    },
    password() {
      return this.$store.state.auth.password;
    },
  },

  methods: {
    clearPassword() {
      if (this.password) this.setProp({ prop: 'password', value: '' });
      if (this.confirmPassword) this.confirmPassword = '';
    },

    updateConfirmPassword(value) {
      this.confirmPassword = value;
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

    goNextStep() {
      if (this.steps.length > this.activeStep) {
        this.activeStep = this.activeStep + 1;

        if (this.activeStep === 2) {
          this.clearPassword();
        }

      } else this.register();
    },

    ...mapActions('auth', {
      register: 'REGISTER',
      setProp: 'SET_PROPERTY',
      resetState: 'RESET_STATE',
    }),
  },

  unmounted() {
    this.resetState();
  },
};
</script>

<style lang="scss" scoped>
@import '../../../assets/css/auth/auth';
</style>
