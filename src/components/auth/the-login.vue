<template>
  <wt-stepper
    :form-data="formData"
    @prev-step-action="primaryAction"
    @next-step-action="secondaryAction">
    <template v-slot:header>
      <h1 class="auth-header">{{$t('auth.loginSubmit')}}</h1>
    </template>

    <template v-slot:desc>
      <p>{{description}}</p>
    </template>

    <template v-slot:main>
      <form
        class="auth-form"
        @submit.prevent="submit"
      >
        <wt-input
          v-model.trim="domain"
          :disabled="formData.activeStep !== 1"
          :label="$t('auth.domain')"
          :v="v$.domain"
        ></wt-input>
        <div v-if="formData.activeStep !== 1">
          <wt-input
            v-model.trim="username"
            :label="$t('auth.user')"
            :v="v$.username"
          >
<!--            <template v-slot:after-input>-->
<!--              <wt-icon-btn-->
<!--                icon="generate"-->
<!--                :tooltip="$t('auth.oauthProviders.checkProvidersTooltip')"-->
<!--                tooltip-position="left"-->
<!--                :disabled="v$.username.$error"-->
<!--                @click="loadAvailableProviders"-->
<!--              ></wt-icon-btn>-->
<!--            </template>-->
          </wt-input>
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

    <template v-slot:primary-action>
      <p v-if="formData.activeStep === 1"
         @click="primaryAction"
      >{{$t('auth.createAccount')}}</p>

    </template>

    <template v-slot:footer v-if="formData.activeStep === 2">
      <footer class="auth-form__actions">
      <p>{{$t('auth.continue')}}</p>
<!--            <wt-button-->
<!--              class="auth-form__action&#45;&#45;service-provider"-->
<!--              v-for="({ ticket, icon }, key) of serviceProviders"-->
<!--              :key="key"-->
<!--              color="secondary"-->
<!--              @click="redirectToServiceProvider({ ticket })"-->
<!--            >-->
<!--              <wt-icon :icon="icon"></wt-icon>-->
<!--            </wt-button>-->
          </footer>



    </template>

  </wt-stepper>

</template>

<script>
import { mapState, mapActions } from 'vuex';
import qs from 'querystring';
import { useVuelidate } from '@vuelidate/core';
import { email, required } from '@vuelidate/validators';
import ServiceProvider from '../../enums/ServiceProvider.enum';
import WtStepper from './wt-stepper.vue';

export default {
  name: 'the-login',
  data: () => ({
    ServiceProvider,
    formData: {
      activeStep: 1,
      steps: [
        {
          name: 'Step 1',
        },
        {
          name: 'Step 2',
        }
      ],
    },
  }),
  components: {
    WtStepper
  },
  setup: () => ({
    v$: useVuelidate(),
  }),
  //  by vuelidate
  validations: {
    username: {
      required,
      email,
    },
    password: {
      required,
    },
    domain: {
      required,
    },
  },

  mounted() {
    this.resetState();
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
    computeDisabled() {
      return this.checkValidations();
    },
    description() {
      if(this.formData.activeStep === 1) {
        return this.$t('auth.enterDomain');
      } else return this.$t('auth.enterUserName');
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

    primaryAction() {
      if(this.formData.activeStep > 1) return this.formData.activeStep = this.formData.activeStep - 1;
      if(this.formData.activeStep === 1) this.$emit('change', {value: 'register'});
    },

    secondaryAction() {
      this.formData.activeStep = this.formData.activeStep + 1;
      if(this.formData.activeStep === 2) this.loadAvailableProviders();
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
  watch: {
    formData: {
      handler() {
        if(this.formData.activeStep === this.formData.steps.length) {
          this.formData.nextBtnText = 'auth.login';
        } else this.formData.nextBtnText = '';
      },
      deep: true,
    }
  },
};
</script>

<style lang="scss" scoped>
@import '../../assets/css/auth/auth';

.wt-button.auth-form__action--service-provider {
  // FIXME
  padding: calc(var(--spacing-xs) - 1px); // вирівняти під стару кнопку
  line-height: 0;
  border: none;
}

.auth-header {
  @extend %typo-heading-3;
  text-align: center;
  margin-bottom: var(--spacing-xs);
}

p {
  text-align: center;
}
</style>
