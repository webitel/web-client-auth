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
        @input="disabledNextBtn"
      >
        <div v-if="activeStep === 1">
          <wt-input
            v-model.trim="domain"
            :label="$t('auth.domain')"
            :v="v$.domain"
          ></wt-input>
        </div>

        <div v-if="activeStep === 2">
          <wt-input
            v-model.trim="domain"
            :label="$t('auth.domain')"
            :v="v$.domain"
            disabled
          ></wt-input>

          <wt-input
            v-model.trim="username"
            :label="$t('vocabulary.login')"
            :v="v$.username"
          ></wt-input>

          <wt-input
            v-model.trim="password"
            :label="$t('auth.password')"
            :v="v$.password"
            type="password"
            has-show-password
          ></wt-input>
        </div>

        <div class="auth-form-actions">
          <p v-if="activeStep === 1"
             class="auth-form-actions--changes-tab"
             @click="primaryAction">{{ $t('auth.createAccount') }}</p>

          <wt-button
            v-else
            @click="primaryAction"
            color="secondary"
          >{{ $t('auth.back') }}
          </wt-button>

          <wt-button
            @click="secondaryAction"
            :disabled="isDisabledNextBtn"
          >{{ nextBtnText || $t('webitelUI.pagination.next') }}
          </wt-button>
        </div>
      </form>
    </template>

    <template
      v-if="serviceProviders.length && activeStep !== 1"
      v-slot:footer>
      <footer class="auth-form-footer">
        <p class="auth-form-footer__title">{{ $t('auth.providersTitle') }}</p>
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
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import ServiceProvider from '../../enums/ServiceProvider.enum';
import WtStepper from './wt-stepper.vue';

export default {
  name: 'the-login',
  data: () => ({
    ServiceProvider,
    activeStep: 1,
    isDisabledNextBtn: true,
    nextBtnText: '',
  }),
  setup: () => ({
    v$: useVuelidate(),
  }),
  components: {
    WtStepper,
  },
  //  by vuelidate
  validations: {
    username: {
      required,
    },
    password: {
      required,
    },
    domain: {
      required,
    },
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
      ]
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
    username: {
      get() {
        return this.$store.state.auth.username;
      },
      set(value) {
        this.setProp({ prop: 'username', value });
      },
    },
    password: {
      get() {
        return this.$store.state.auth.password;
      },
      set(value) {
        this.setProp({ prop: 'password', value });
      },
    },
    domain: {
      get() {
        return this.$store.state.auth.domain;
      },
      set(value) {
        this.setProp({ prop: 'domain', value });
      },
    },
  },

  methods: {
    checkValidations() {
      this.v$.$touch();
      // if its still pending or an error is returned do not submit
      return this.v$.$pending || this.v$.$error;
    },

    submit() {
      const invalid = this.checkValidations();
      if (!invalid) this.login();
    },

    disabledNextBtn() {
      if (this.activeStep === 1) {
        this.isDisabledNextBtn = this.v$.domain.$error;
      } else {
        this.isDisabledNextBtn = this.checkValidations();
      }
    },

    primaryAction() {
      if (this.activeStep === 1) {
        this.$emit('change-tab', { value: 'register' });
      } else {
        this.activeStep = this.activeStep - 1;
        if (this.nextBtnText) this.nextBtnText = '';
      }
      this.disabledNextBtn();
    },

    secondaryAction() {
      if (this.steps.length > this.activeStep) {
        this.activeStep = this.activeStep + 1;

        if (this.activeStep !== 1) {
          this.loadAvailableProviders();
          this.setProp({ prop: 'password', value: ''});
          this.nextBtnText = this.$t('vocabulary.login');
          this.disabledNextBtn();
        }
      } else this.submit();
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

  mounted() {
    this.resetState();
  },
};
</script>

<style lang="scss" scoped>
@import '../../assets/css/auth/auth';
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

  &__title {
    display: flex;
    line-height: 1em;
    margin: var(--spacing-md) 0 var(--spacing-sm) 0;

    &::before,
    &::after {
      content: '';
      display: inline-block;
      flex-grow: 1;
      margin-top: 0.5em;
      background: var(--secondary-color);
      height: 1px;
      margin-right: var(--spacing-xs);
      margin-left:var(--spacing-xs);
    }
  }
}
</style>
