<template>
  <form
      class="auth__form"
      @submit.prevent="submit"
  >
    <wt-input
        v-model.trim="username"
        :label="$t('auth.user')"
        :v="$v.username"
    ></wt-input>
    <wt-input
        v-model.trim="password"
        :label="$t('auth.password')"
        :v="$v.password"
        class="form__input"
        type="password"
    ></wt-input>
    <wt-input
        v-model.trim="confirmPassword"
        :label="$t('auth.confirmPassword')"
        :v="$v.confirmPassword"
        type="password"
    ></wt-input>
    <wt-input
        v-model.trim="certificate"
        :label="$t('auth.key')"
        :v="$v.certificate"
    ></wt-input>
    <wt-button
        :disabled="computeDisabled"
        type="submit"
    >{{ computeButton }}
    </wt-button>
  </form>
</template>

<script>
import { email, required, sameAs } from 'vuelidate/lib/validators';
import { mapActions } from "vuex";

export default {
  name: 'the-register',

  data() {
    return {
      confirmPassword: '',
    };
  },

  validations: {
    confirmPassword: {
      sameAs: sameAs('password'),
    },
    username: {
      required,
      email,
    },
    password: {
      required,
    },
    certificate: {
      required,
    },
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
    certificate: {
      get() {
        return this.$store.state.auth.certificate;
      },
      set(value) {
        this.setProp({ prop: 'certificate', value });
      },
    },

    computeTitle() {
      return this.$route.query.reset ? this.$t('auth.registerReset') : this.$t('auth.register');
    },
    computeButton() {
      return this.$route.query.reset ? this.$t('auth.resetSubmit') : this.$t('auth.registerSubmit');
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
      if (!invalid) this.register();

    },

    ...mapActions('auth', {
      register: 'REGISTER',
      setProp: 'SET_PROPERTY',
      resetState: 'RESET_STATE',
    }),
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/auth/auth";
</style>
