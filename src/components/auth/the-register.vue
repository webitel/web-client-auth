<template>
  <wt-stepper
    :form-data="formData"
    @prev-step-action="primaryAction"
    @next-step-action="secondaryAction"
  >
    <template v-slot:title></template>
    <template v-slot:description></template>
    <template v-slot:main>
      <form
        class="auth-form"
        @submit.prevent
        @input="disabledNextBtn"
      >
        <div v-if="formData.activeStep === 1">
          <wt-input
            v-model.trim="domain"
            :label="$t('auth.domain')"
            :v="v$.domain"
          ></wt-input>
        </div>

        <div v-if="formData.activeStep === 2">
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
            :label="$t('auth.password')"
            :v="v$.confirmPassword"
            type="password"
          ></wt-input>

        </div>

        <div v-if="formData.activeStep === 3">
          <wt-textarea
            v-model.trim="certificate"
            :label="$t('auth.key')"
            :v="v$.certificate"
          ></wt-textarea>
        </div>

      </form>
    </template>

    <template
      v-if="formData.activeStep === 1"
      v-slot:primary-action>
        <p
          class="auth-form--changes-tab"
          @click="primaryAction">{{$t('auth.signIn')}}</p>
    </template>

  </wt-stepper>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import { required, sameAs } from '@vuelidate/validators';
import { mapActions } from 'vuex';
import WtStepper from './wt-stepper.vue';

export default {
  name: 'the-register',

  data() {
    return {
      confirmPassword: '',
      formData: {
        activeStep: 1,
        title: 'auth.titleRegistration',
        isDisabledNextBtn: true,
        steps: [
          {
            name: 'Step 1',
            desc: 'auth.enterDomain',
            completed: true,
          },
          {
            name: 'Step 2',
            desc: 'auth.enterNewUsername',
            completed: false,
          },
          {
            name: 'Step 3',
            desc: 'auth.enterLicense',
            completed: false,
          },
        ],
      },
    };
  },
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
        $autoDirty: true,
      },
      username: {
        required,
        $autoDirty: true,
      },
      password: {
        required,
        $autoDirty: true,
      },
      certificate: {
        required,
        $autoDirty: true,
      },
    };
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
      if(this.formData.activeStep === 1) {
        this.formData.isDisabledNextBtn = this.v$.domain.$error;
      } else if(this.formData.activeStep === 2) {
        const validationArray = [
          this.v$.username,
          this.v$.password,
          this.v$.confirmPassword
        ];
        this.formData.isDisabledNextBtn = validationArray.some((item) => item.$error);
      } else {
        this.formData.isDisabledNextBtn = this.checkValidations();
      }
    },

    primaryAction() {
      if (this.formData.activeStep === 1) {
        this.$emit('changeTab', { value: 'login' });
      } else
        this.formData.activeStep = this.formData.activeStep - 1;
        this.formData.steps.map((item,idx) => {
          if(this.formData.activeStep - 1 < idx) {
            item.completed = false;
          }
        })

      if (this.formData.activeStep === 2) {
        if(this.formData.nextBtnText) this.formData.nextBtnText = '';
        this.clearPassword();
      }
    },

    secondaryAction() {
      if (this.formData.steps.length > this.formData.activeStep) {

        this.formData.activeStep = this.formData.activeStep + 1;
        this.formData.steps[this.formData.activeStep - 1].completed = true;

        this.disabledNextBtn();

        if (this.formData.activeStep === 2) {
          this.clearPassword();
        }

        if (this.formData.activeStep === 3) {
          this.formData.nextBtnText = 'auth.registerSubmit';
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
