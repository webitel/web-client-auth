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
          @register="backPrevStep"
          @next="goNextStep"
        ></first-step>

        <second-step
          v-if="activeStep === 2"
          @back="backPrevStep"
          @next="goNextStep"
        ></second-step>
      </form>

    </template>
  </wt-stepper>
</template>

<script>
import { mapActions } from 'vuex';
import FirstStep from '../login/steps/the-login-first-step.vue';
import SecondStep from '../login/steps/the-login-second-step.vue';

export default {
  name: 'the-login',
  data: () => ({
    activeStep: 1,
  }),
  components: {
    FirstStep,
    SecondStep,
  },

  computed: {
    steps() {
      return [
        {
          name: this.$t('reusable.step', { count: 1 }),
          description: this.$t('auth.enterDomain'),
        },
        {
          name: this.$t('reusable.step', { count: 2 }),
          description: this.$t('auth.enterUsername'),
        },
      ];
    },
  },

  methods: {
    backPrevStep() {
      if (this.activeStep === 1) {
        this.$emit('change-tab', { value: 'register' });
      } else {
        this.activeStep = this.activeStep - 1;
      }
    },

    goNextStep() {
      if (this.steps.length > this.activeStep) {
        this.activeStep = this.activeStep + 1;

        if (this.activeStep === 2) {
          this.setProp({ prop: 'password', value: '' });
        }
      } else this.login();
    },

    ...mapActions('auth', {
      login: 'LOGIN',
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
