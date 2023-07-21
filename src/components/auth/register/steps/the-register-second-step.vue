<template>
  <div>
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
    ></wt-input>

    <wt-input
      :value="confirmPassword"
      :label="$t('auth.confirmPassword')"
      :v="v$.confirmPassword"
      type="password"
      @input="$emit('update:confirm-password', $event)"
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
        >{{ $t('webitelUI.pagination.next') }}
      </wt-button>
    </div>
  </div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import { required, sameAs } from '@vuelidate/validators';
import { mapActions } from 'vuex';

export default {
  name: 'the-register-second-step',
  props: {
    confirmPassword: {
      type: String,
    }
  },
  setup: () => ({
    v$: useVuelidate(),
  }),
  validations() {
    return {
      username: {
        required,
      },
      password: {
        required,
      },
      confirmPassword: {
        sameAs: sameAs(this.password),
      },
    }
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
  }
}

</script>
