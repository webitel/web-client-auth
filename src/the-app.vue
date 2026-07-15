<template>
  <!--  :class="$i18n.locale" root element class to control fonts on each locale  -->
  <router-view
    v-if="!isCheckingSession"
    :class="locale"
  ></router-view>
</template>

<script setup>
import querystring from 'node:querystring';
import { objSnakeToCamel } from '@webitel/ui-sdk/src/scripts/caseConverters';
import { inject, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore();
const { checkCurrentSession } = authStore;

const eventBus = inject('$eventBus');
const { locale, fallbackLocale } = useI18n();

const isCheckingSession = ref(true);

const setLanguage = () => {
	const lang = localStorage.getItem('lang');
	if (lang) locale.value = lang;

	const fallbackLang = localStorage.getItem('fallbackLang');
	if (fallbackLang) fallbackLocale.value = fallbackLang;
};

setLanguage();

const handleErrorsInQuery = ({ errorDescription }) => {
	eventBus.$emit('notification', {
		type: 'error',
		text: errorDescription,
	});
};

const handlePathQuery = () => {
	const query = objSnakeToCamel(
		querystring.parse(window.parent.location.search.slice(1)),
	); // query, without "?" sign

	if (query.error || query.errorDescription) handleErrorsInQuery(query);
};

onMounted(async () => {
	handlePathQuery();
	try {
		await checkCurrentSession();
	} finally {
		isCheckingSession.value = false;
	}
});
</script>

<style lang="scss">
#app {
  height: 100%;
}
</style>
