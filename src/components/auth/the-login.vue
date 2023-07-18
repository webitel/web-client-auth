<template>
  <wt-stepper
    :form-data="formData"
    @prev-step-action="primaryAction"
    @next-step-action="secondaryAction"
  >
    <template v-slot:title></template>
    <template v-slot:description></template>
    <template v-slot:main>
      <form
        class="auth-form"
        @submit.prevent
        @input="disabledNextBtn"
      >
        <div v-if="isFirstStepActive">
          <wt-input
            v-model.trim="domain"
            :label="$t('auth.domain')"
            :v="v$.domain"
          ></wt-input>
        </div>

        <div v-else>
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
      </form>
    </template>

    <template
      v-if="isFirstStepActive"
      v-slot:primary-action>
        <p
          class="auth-form--changes-tab"
          @click="primaryAction">{{$t('auth.createAccount')}}</p>
    </template>

    <template
      v-if="serviceProviders.length && !isFirstStepActive"
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
    formData: {
      activeStep: 1,
      title: 'auth.signIn',
      isDisabledNextBtn: true,
      steps: [
        {
          name: 'Step 1',
          desc: 'auth.enterDomain',
          completed: true,
        },
        {
          name: 'Step 2',
          desc: 'auth.enterUsername',
          completed: false,
        },
        {
          name: 'Step 2',
          desc: 'auth.enterUsername',
          completed: false,
        },
        {
          name: 'Step 2',
          desc: 'auth.enterUsername',
          completed: false,
        },
      ],
    },
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
    isFirstStepActive() {
      return this.formData.activeStep === 1;
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
      if(this.isFirstStepActive) {
        this.formData.isDisabledNextBtn = this.v$.domain.$error;
      } else {
        this.formData.isDisabledNextBtn = this.checkValidations();
      }
    },

    primaryAction() {
      if (this.isFirstStepActive) {
        this.$emit('changeTab', { value: 'register' });
      } else {
        this.formData.activeStep = this.formData.activeStep - 1;
        this.formData.steps.map((item,idx) => {
          if(this.formData.activeStep - 1 < idx) {
            item.completed = false;
          }
        });
        if(this.formData.nextBtnText) this.formData.nextBtnText = '';
      }
      this.disabledNextBtn();
    },

    secondaryAction() {
      if (this.formData.steps.length > this.formData.activeStep) {
        this.formData.activeStep = this.formData.activeStep + 1;
        this.formData.steps[this.formData.activeStep - 1].completed = true;
        if (!this.isFirstStepActive) {
          this.loadAvailableProviders();
          this.setProp({ prop: 'password', value: ''});
          this.formData.nextBtnText = 'vocabulary.login';
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
