<template>
  <div class="the-login-change-password">
    <div class="the-login-change-password-header">
      <wt-icon icon="lock" color="error"></wt-icon>
      <span class="the-login-change-password-header--text">{{ message }}</span>
    </div>

    <div>
      <div class="the-login-change-password-fields">
        <wt-password
          v-model.trim="newPassword"
          name="password"
          :label="t('auth.newPassword')"
          :v="v$.newPassword"
          autocomplete
          @keyup.enter="emit('save')"
        />

        <wt-password
          v-model.trim="confirmPassword"
          name="password"
          :label="t('auth.confirmNewPassword')"
          :v="v$.confirmPassword"
          autocomplete
          @keyup.enter="emit('save')"
        />
      </div>

      <div class="auth-form-actions">
        <wt-button
          color="secondary"
          @click="emit('back')"
        >{{ $t('reusable.back') }}
        </wt-button>

        <wt-button
          :disabled="v$.$invalid"
          @click="emit('save')"
        >{{ $t('reusable.save') }}
        </wt-button>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { useVuelidate } from "@vuelidate/core";
import { required, sameAs, helpers } from "@vuelidate/validators";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";

import { useNextOnEnter } from "../../../composables/useNextOnEnter.js";
import AuthAPI from "../../../api/auth/auth";

type PasswordSettings = {
	passwordRegExp: string;
	passwordValidationText?: string;
	passwordCategories?: string;
	PasswordMinLength?: string;
	PasswordContainsLogin?: string;
};

const { t } = useI18n();

const emit = defineEmits(["back", "save"]);
const store = useStore();

const vPasswordSettings = ref<PasswordSettings>({});

const newPassword = computed({
	get: () => store.state.auth.newPassword,
	set: (value) => setProp({ prop: "newPassword", value }),
});
const confirmPassword = computed({
	get: () => store.state.auth.confirmPassword,
	set: (value) => setProp({ prop: "confirmPassword", value }),
});
const reasonExpiredPassword = computed(
	() => store.state.auth.reasonExpiredPassword,
);

const loadPasswordSettings = async (): Promise<void> => {
	const { settings } = await AuthAPI.getPasswordSettings({
		domain: store.state.auth.domain,
		username: store.state.auth.username,
		password: store.state.auth.password,
	});

	vPasswordSettings.value = settings as PasswordSettings;
};

const regExpSettings = computed(() => {
	if (!vPasswordSettings.value?.passwordRegExp) {
		return {};
	}

	const regExpInstance = new RegExp(vPasswordSettings.value.passwordRegExp);
	const vRegExpRule = (v) => regExpInstance.test(v);

	return {
		regex: helpers.withParams(
			{ regex: vPasswordSettings.value.passwordRegExp },
			vPasswordSettings.value.passwordValidationText
				? helpers.withMessage(
						vPasswordSettings.value.passwordValidationText,
						vRegExpRule,
					)
				: vRegExpRule,
		),
	};
});

const v$ = useVuelidate(
	computed(() => ({
		newPassword: {
			required,
			...regExpSettings.value,
		},
		confirmPassword: {
			sameAs: sameAs(newPassword),
		},
	})),
	{ newPassword, confirmPassword },
	{ $autoDirty: true },
);

useNextOnEnter(() => !v$.value.$invalid && emit("save"));

const message = computed(() =>
	reasonExpiredPassword.value === "temporary"
		? t("auth.temporaryPasswordMessage")
		: t("auth.expiredPasswordMessage"),
);

async function setProp(payload) {
	return store.dispatch("auth/SET_PROPERTY", payload);
}

onMounted(async () => {
	await loadPasswordSettings();
	v$.value.$touch();
});
onUnmounted(() => {
	setProp({ prop: "newPassword", value: "" });
	setProp({ prop: "confirmPassword", value: "" });
});
</script>

<style scoped lang="scss">
.the-login-change-password-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);

  &--text {
    color: var(--error-color);
  }
}

.the-login-change-password-fields {
  display: flex;
  margin-bottom: var(--spacing-md);
  flex-direction: column;
  gap: var(--spacing-md);
}
</style>
