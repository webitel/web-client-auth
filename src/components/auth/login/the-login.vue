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

        <third-step
          v-if="activeStep === 3"
          @back="backPrevStep"
          @next="goNextStep"
        ></third-step>
      </div>

    </template>
  </wt-stepper>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import router from '../../../router/router';
import FirstStep from '../login/steps/the-login-first-step.vue';
import SecondStep from '../login/steps/the-login-second-step.vue';
import ThirdStep from './steps/the-login-third-step.vue';
export default {
  name: 'the-login',
  props: {
    isBackPrevStep: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    activeStep: 1,
    isFirstStepSubmitting: false,
  }),
  components: {
    FirstStep,
    SecondStep,
    ThirdStep,
  },
  inject: ['$eventBus'],

  computed: {
    ...mapState('auth', {
      enabledTfa: (state) => state.enabledTfa,
      domain: (state) => state.domain,
    }),

    steps() {
      const steps = [
        {
          name: this.$t('reusable.step', { count: 1 }),
          description: this.$t('auth.enterDomain'),
        },
        {
          name: this.$t('reusable.step', { count: 2 }),
          description: this.$t('auth.enterUsername'),
        },
      ];

      if (this.enabledTfa) steps.push({
        name: this.$t('reusable.step', { count: 3 }),
        description: this.$t('auth.enterAuthenticationCode'),
      });

      return steps;
    },
  },

  methods: {
    ...mapActions('auth', {
      setProp: 'SET_PROPERTY',
      resetState: 'RESET_STATE',
      checkDomain: 'CHECK_DOMAIN',
      get2faSessionId: 'GET_2FA_SESSION_ID',
      onAuthSuccess: 'ON_AUTH_SUCCESS',
    }),

    backPrevStep() {
      if (this.activeStep === 1) {
        this.$emit('change-tab', { value: 'register' });
      } else {
        this.activeStep = this.activeStep - 1;
      }

      if (this.activeStep === 2 && this.enabledTfa) {
        this.setProp({ prop: 'totp', value: '' });
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

        if (this.activeStep === 2 && this.enabledTfa) {
          try {
            await this.get2faSessionId();
          } catch (err) {
            return;
          }
        }

        this.activeStep = this.activeStep + 1;

      } else {
        this.$emit('submit');
      }
    },
    async authCheck() {
      const query = router.currentRoute.value?.query
      if(query?.error) {
        return this.$eventBus.$emit('notification', { type: 'error', text: query?.error_description });
      }

      // if user is already authorized with SSO, API get /login will return the token.
      // Otherwise federation if they are allowed
      // https://webitel.atlassian.net/browse/WTEL-4395

      const response = await this.checkDomain();
      if (response?.access_token) this.onAuthSuccess({ accessToken: response.access_token });
    }
  },
  mounted() {
    this.authCheck();
  },

  unmounted() {
    this.resetState();
  },

  watch: {
    isBackPrevStep: {
      handler(value) {
        if(value && this.activeStep === 3)
          this.backPrevStep();
          this.$emit('change-is-back-prev-step');
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../../assets/css/auth/auth';
</style>
