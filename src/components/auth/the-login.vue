<template>
  <form
      class="auth-form"
      @submit.prevent="submit"
  >
    <wt-input
        v-model.trim="username"
        :label="$t('auth.user')"
        :v="$v.username"
    >
<!--      <template slot="after-input">-->
<!--        <wt-icon-btn-->
<!--            icon="generate"-->
<!--            :tooltip="$t('auth.oauthProviders.checkProvidersTooltip')"-->
<!--            tooltip-position="left"-->
<!--            :disabled="$v.username.$error"-->
<!--            @click="loadAvailableProviders"-->
<!--        ></wt-icon-btn>-->
<!--      </template>-->
    </wt-input>
    <wt-input
        v-model.trim="password"
        :label="$t('auth.password')"
        :v="$v.password"
        type="password"
        has-show-password
    ></wt-input>
    <footer class="auth-form__actions">
      <wt-button
          class="auth-form__action--service-provider"
          v-for="({ ticket, icon }, key) of serviceProviders"
          :key="key"
          color="secondary"
          @click="redirectToServiceProvider({ ticket })"
      >
        <wt-icon :icon="icon"></wt-icon>
      </wt-button>
      <wt-button
          :disabled="computeDisabled"
          type="submit"
      >{{ $t('auth.loginSubmit') }}
      </wt-button>
    </footer>
  </form>
</template>

<script>
import { mapState, mapActions } from "vuex";
import qs from 'querystring';
import { email, required } from 'vuelidate/lib/validators';
import ServiceProvider from '../../enums/ServiceProvider.enum';

export default {
  name: 'the-login',
  data: () => ({
    ServiceProvider,
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
    computeDisabled() {
      return this.checkValidations();
    },
  },

  methods: {
    checkValidations() {
      this.$v.$touch();
      // if its still pending or an error is returned do not submit
      return this.$v.$pending || this.$v.$error;
    },

    submit() {
      const invalid = this.checkValidations();
      if (!invalid) this.login();

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
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/auth/auth";

.wt-button.auth-form__action--service-provider {
  // FIXME
  padding: calc(var(--spacing-xs) - 1px); // вирівняти під стару кнопку
  line-height: 0;
  border: none;
}
</style>
