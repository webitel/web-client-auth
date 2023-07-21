<template>
  <div>
    <wt-textarea
      :value="certificate"
      :label="$t('auth.key')"
      :v="v$.certificate"
      @input="setProp({ prop: 'certificate', value: $event });"
    ></wt-textarea>

    <div class="auth-form-actions">
      <wt-button
        @click="$emit('back-prev-step')"
        color="secondary"
      >{{ $t('auth.back') }}
      </wt-button>

      <wt-button
        @click="$emit('go-next-step')"
        :disabled="checkValidations()"
      >{{ $t('auth.registerSubmit') }}
      </wt-button>
    </div>
  </div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { mapActions, mapState } from 'vuex';

export default {
  name: 'the-register-third-step',
  setup: () => ({
    v$: useVuelidate(),
  }),
  validations: {
    certificate: {
      required,
    },
  },
  computed: {
    ...mapState('auth', {
      certificate: (state) => state.certificate,
    }),
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
