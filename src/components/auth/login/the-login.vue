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
          @back-prev-step="backPrevStep"
          @go-next-step="goNextStep"
        ></second-step>
      </form>

      <footer
        v-if="serviceProviders.length && activeStep === 2"
        class="auth-form-footer"
      >
        <div class="auth-form-footer__inner">
          <wt-divider></wt-divider>
          <p class="auth-form-footer__title">{{ $t('auth.providersTitle') }}</p>
          <wt-divider></wt-divider>
        </div>

        <div class="auth-form-footer__wrapper">
          <wt-button
            class="auth-form-footer__button"
            v-for="({ ticket, icon }, key) of serviceProviders"
            :key="key"
            color="secondary"
            @click="redirectToServiceProvider({ ticket })"
          >
            <wt-icon :icon="icon"></wt-icon>
          </wt-button>
        </div>
      </footer>
    </template>
  </wt-stepper>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import qs from 'querystring';
import ServiceProvider from '../../../enums/ServiceProvider.enum';
import WtStepper from '../wt-stepper.vue';
import FirstStep from '../login/steps/the-login-first-step.vue';
import SecondStep from '../login/steps/the-login-second-step.vue';

export default {
  name: 'the-login',
  data: () => ({
    ServiceProvider,
    activeStep: 1,
  }),
  components: {
    WtStepper,
    FirstStep,
    SecondStep,
  },

  computed: {
    ...mapState('auth', {
      loginProviders: (state) => state.loginProviders,
    }),
    steps() {
      return [
        {
          name: this.$t('auth.step', { count: 1 }),
          description: this.$t('auth.enterDomain'),
        },
        {
          name: this.$t('auth.step', { count: 2 }),
          description: this.$t('auth.enterUsername'),
        },
      ];
    },
    serviceProviders() {
      const providerIcon = {
        [ServiceProvider.ADFS]: 'adfs',
        [ServiceProvider.GOOGLE]: 'google',
        [ServiceProvider.FACEBOOK]: 'messenger-facebook',
      };
      return Object.keys(this.loginProviders).map((provider) => ({
        name: provider,
        icon: providerIcon[provider],
        ticket: this.loginProviders[provider],
      }));
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
          this.loadAvailableProviders();
          this.setProp({ prop: 'password', value: '' });
        }
      } else this.login();
    },

    redirectToServiceProvider({ ticket }) {
      const baseUrl = `${process.env.VUE_APP_API_URL}/login`;
      const query = {
        redirect_uri: window.parent.location.href,
      };
      const url = `${baseUrl}${ticket}?${qs.stringify(query)}`;
      window.parent.location.replace(url);
    },

    ...mapActions('auth', {
      login: 'LOGIN',
      loadAvailableProviders: 'LOAD_SERVICE_PROVIDERS',
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

.auth-form-footer {
  display: flex;
  flex-direction: column;

  &__wrapper {
    display: flex;
    justify-content: space-between;
    gap: var(--spacing-sm);

    .auth-form-footer__button {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  &__inner {
    display: flex;
    align-items: center;
    margin: var(--spacing-md) 0 var(--spacing-sm) 0;
  }

  &__title {
    width: 100%;
  }
}
</style>
