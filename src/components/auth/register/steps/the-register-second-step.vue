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
        @click="emits('back')"
        color="secondary"
      >{{ $t('auth.back') }}
      </wt-button>

      <wt-button
        :disabled="v$.$invalid"
        @click="emits('next')"
        >{{ $t('webitelUI.pagination.next') }}
      </wt-button>
    </div>
  </div>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core';
import { required, sameAs } from '@vuelidate/validators';
import { computed, onMounted, toRefs } from 'vue';
import { useStore } from 'vuex';

const props = defineProps({
  confirmPassword: {
    type: String,
  },
});

const emits = defineEmits(['back', 'next']);

const store = useStore();

const username = computed({
  get: () => store.state.auth.username,
  set: (value) => setProp({ prop: 'username', value })
});
const password = computed({
  get: () => store.state.auth.password,
  set: (value) => setProp({ prop: 'password', value })
});

const { confirmPassword } = toRefs(props);

const v$ = useVuelidate(
  computed(() => ({
    username: {
      required,
    },
    password: {
      required,
    },
    confirmPassword: {
      sameAs: sameAs(password)
    }
  })),
  { username, password, confirmPassword },
  { $autoDirty: true },
);

async function setProp(payload) {
  return store.dispatch('auth/SET_PROPERTY', payload);
};

onMounted(() => { v$.value.$touch() });
</script>
