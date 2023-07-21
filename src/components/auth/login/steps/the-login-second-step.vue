<template>
  <div>
    <wt-input
      :value="domain"
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

    <div class="auth-form-actions">
      <wt-button
        @click="$emit('back-prev-step')"
        color="secondary"
      >{{ $t('auth.back') }}
      </wt-button>

      <wt-button
        @click="$emit('go-next-step')"
        :disabled="checkValidations()"
      >{{ $t('vocabulary.login') }}
      </wt-button>
    </div>
  </div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { mapActions } from 'vuex';

export default {
  name: 'the-login-second-step',
  setup: () => ({
    v$: useVuelidate(),
  }),
  validations: {
    domain: {
      required,
    },
    username: {
      required,
    },
    password: {
      required,
    },
  },

  computed: {
    domain() {
      return this.$store.state.auth.domain;
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
  },
  methods: {
    ...mapActions('auth', {
      setProp: 'SET_PROPERTY',
    }),
    checkValidations() {
      return this.v$.$pending || this.v$.$error;
    },
  },
  mounted() {
    this.v$.$touch();
  },
};

</script>
