<template>
  <div>
    <wt-input
      v-model.trim="domain"
      :label="$t('auth.domain')"
      :v="v$.domain"
    ></wt-input>

    <div class="auth-form-actions">
      <p
        class="auth-form-actions--link"
        @click="$emit('change-tab')">{{ $t('auth.signIn') }}</p>

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
import { required } from '@vuelidate/validators';
import { mapActions } from 'vuex';

export default {
  name: 'the-register-first-step',
  setup: () => ({
    v$: useVuelidate(),
  }),
  validations: {
    domain: {
      required,
    },
  },
  computed: {
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
