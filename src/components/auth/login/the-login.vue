<template>
  <wt-stepper
    :steps="steps"
    :active-step="activeStep"
  >
    <template v-slot:description></template>
    <template v-slot:main>
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
      </div>

    </template>
  </wt-stepper>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import AuthAPI from '../../../api/auth/auth.js';
import FirstStep from '../login/steps/the-login-first-step.vue';
import SecondStep from '../login/steps/the-login-second-step.vue';

export default {
  name: 'the-login',
  data: () => ({
    activeStep: 1,
    isFirstStepSubmitting: false,
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
    ...mapActions('auth', {
      login: 'LOGIN',
      setProp: 'SET_PROPERTY',
      resetState: 'RESET_STATE',
      checkDomain: 'CHECK_DOMAIN',
    }),

    backPrevStep() {
      if (this.activeStep === 1) {
        this.$emit('change-tab', { value: 'register' });
      } else {
        this.activeStep = this.activeStep - 1;
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

        if (this.activeStep === 2) {
          await this.setProp({ prop: 'password', value: '' });
        }

        this.activeStep = this.activeStep + 1;
      } else {
        this.$emit('submit');
      }
    },

    handleGlobalKeypress(event) {
      if (event.key === 'Enter') {
        if (event.ctrlKey) {
          this.$emit('submit');
        }
        this.goNextStep();
      }
    },
  },

  mounted() {
    window.addEventListener('keypress', this.handleGlobalKeypress);
  },

  unmounted() {
    window.removeEventListener('keypress', this.handleGlobalKeypress);
    this.resetState();
  },
};
</script>

<style lang="scss" scoped>
@import '../../../assets/css/auth/auth';
</style>
