<template>
  <wt-stepper
    :steps="steps"
    :active-step="activeStep"
  >
    <template v-slot:description></template>
    <template v-slot:main>
      <form
        class="auth-form"
        @submit.prevent
        @input="disabledNextBtn"
      >
        <div v-if="activeStep === 1">
          <wt-input
            v-model.trim="domain"
            :label="$t('auth.domain')"
            :v="v$.domain"
          ></wt-input>
        </div>

        <div v-if="activeStep === 2">
          <wt-input
            v-model.trim="username"
            :label="$t('vocabulary.login')"
            :v="v$.username"
          ></wt-input>

          <wt-input
            v-model.trim="password"
            :label="$t('auth.password')"
            :v="v$.password"
            class="form__input"
            type="password"
          ></wt-input>

          <wt-input
            v-model.trim="confirmPassword"
            :label="$t('auth.confirmPassword')"
            :v="v$.confirmPassword"
            type="password"
          ></wt-input>

        </div>

        <div v-if="activeStep === 3">
          <wt-textarea
            :value="certificate"
            :label="$t('auth.key')"
            :v="v$.certificate"
            @input="setProp({ prop: 'certificate', value: $event });"
          ></wt-textarea>
        </div>

        <div class="auth-form-actions">
          <p v-if="activeStep === 1"
            class="auth-form-actions--changes-tab"
            @click="primaryAction">{{ $t('auth.signIn') }}</p>

          <wt-button
            v-else
            @click="primaryAction"
            color="secondary"
          >{{ $t('auth.back') }}
          </wt-button>

          <wt-button
            @click="secondaryAction"
            :disabled="isDisabledNextBtn"
            >{{ nextBtnText || $t('webitelUI.pagination.next') }}
          </wt-button>
        </div>

      </form>
    </template>

  </wt-stepper>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import { required, sameAs } from '@vuelidate/validators';
import { mapActions, mapState } from 'vuex';
import WtStepper from './wt-stepper.vue';

export default {
  name: 'the-register',

  data() {
    return {
    confirmPassword: '',
    activeStep: 1,
    isDisabledNextBtn: true,
    nextBtnText: '',
  }},
  setup: () => ({
    v$: useVuelidate(),
  }),
  components: {
    WtStepper,
  },
  validations() {
    return {
      confirmPassword: {
        sameAs: sameAs(this.password),
      },
      domain: {
        required,
      },
      username: {
        required,
      },
      password: {
        required,
      },
      certificate: {
        required,
      },
    };
  },

  computed: {
    ...mapState('auth', {
      certificate: (state) => state.certificate,
    }),
    steps() {
      return [
          {
            name: this.$t('auth.step', { count: 1 }),
            description: this.$t('auth.enterDomain'),
          },
          {
            name: this.$t('auth.step', { count: 2 }),
            description: this.$t('auth.enterNewUsername'),
          },
          {
            name: this.$t('auth.step', { count: 3 }),
            description: this.$t('auth.enterLicense'),
          },
        ]
    },
    domain: {
      get() {
        return this.$store.state.auth.domain;
      },
      set(value) {
        this.setProp({ prop: 'domain', value });
      },
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
    checkValidations() {
      this.v$.$touch();
      // if its still pending or an error is returned do not submit
      return this.v$.$pending || this.v$.$error;
    },

    submit() {
      const invalid = this.checkValidations();
      if (!invalid) this.register();
    },

    clearPassword() {
      if (this.password) this.setProp({ prop: 'password', value: ''});
      if (this.confirmPassword) this.confirmPassword = '';
    },

    disabledNextBtn() {
      if(this.activeStep === 1) {
        this.isDisabledNextBtn = this.v$.domain.$error;
      } else if(this.activeStep === 2) {
        this.v$.$touch();
        const validationArray = [
          this.v$.username,
          this.v$.password,
          this.v$.confirmPassword
        ];
        this.isDisabledNextBtn = validationArray.some((item) => item.$error);
      } else {
        this.isDisabledNextBtn = this.checkValidations();
      }
    },

    primaryAction() {
      if (this.activeStep === 1) {
        this.$emit('change-tab', { value: 'login' });
      } else
        this.activeStep = this.activeStep - 1;

      if (this.activeStep === 2) {
        if(this.nextBtnText) this.nextBtnText = '';
        this.clearPassword();
      }
      this.disabledNextBtn();
    },

    secondaryAction() {
      if (this.steps.length > this.activeStep) {
        this.activeStep = this.activeStep + 1;

        if (this.activeStep === 2) {
          this.clearPassword();
          this.disabledNextBtn();
        }

        if (this.activeStep === 3) {
          this.nextBtnText = this.$t('auth.registerSubmit');
          this.disabledNextBtn();
        }
      } else this.submit();
    },

    ...mapActions('auth', {
      register: 'REGISTER',
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
</style>
