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
      <template slot="after-input">
        <wt-icon-btn
            icon="generate"
            :tooltip="$t('auth.oauthProviders.checkProvidersTooltip')"
            tooltip-position="left"
            :disabled="$v.username.$error"
            @click="loadAvailableProviders"
        ></wt-icon-btn>
      </template>
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
          v-for="(providerName, key) of Object.keys(loginProviders)"
          :key="key"
          color="secondary"
          @click="redirectToServiceProvider({ name: providerName })"
      >{{ providerName }}</wt-button>
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

    checkAvailableProviders() {},

    submit() {
      const invalid = this.checkValidations();
      if (!invalid) this.login();

    },

    redirectToServiceProvider({ name }) {
      const baseUrl = `${process.env.VUE_APP_API_URL}/login`;
      const ticket = this.loginProviders[name];
      const query = {
        redirect_url: window.location.href,
      };
      const url = `${baseUrl}${ticket}?${qs.stringify(query)}`;
      window.location.replace(url);
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

.form__reset-password {

  display: block;
  text-align: right;
  margin: 14px 0 28px;
  color: #000;
  text-decoration: none;
}
</style>
