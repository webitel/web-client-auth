<template>
  <form
      class="auth__form"
      @submit.prevent="submit"
  >
    <wt-input
        v-model.trim="username"
        :label="$t('auth.user')"
        :v="v.username"
    ></wt-input>
    <wt-input
        v-model.trim="password"
        :label="$t('auth.password')"
        :v="v.password"
        :type="'password'"
    ></wt-input>
    <!--            <router-link-->
    <!--                    class="form__reset-password"-->
    <!--                    :to="{ path: '/auth', query: { reset: true }}">-->
    <!--                {{$t('auth.resetPasswordLink')}}-->
    <!--            </router-link>-->

    <wt-button
        class="btn form__button"
        type="submit"
        :disabled="computeDisabled"
    >
      {{ $t('auth.loginSubmit') }}
    </wt-button>
  </form>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: 'the-login',

  props: {
    v: {
      type: Object,
    },
  },

  data() {
    return {};
  },

  mounted() {
    this.resetState();
  },

  computed: {
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
      this.v.$touch();
      return this.v.username.$anyError || this.v.password.$anyError;
    },

    submit() {
      const invalid = this.checkValidations();
      if (!invalid) this.login();

    },

    ...mapActions('auth', {
      login: 'LOGIN',
      setProp: 'SET_PROPERTY',
      resetState: 'RESET_STATE',
    }),
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/auth/auth";

.form__reset-password {
  @extend .typo-input-label;

  display: block;
  text-align: right;
  margin: 14px 0 28px;
  color: #000;
  text-decoration: none;
}
</style>
