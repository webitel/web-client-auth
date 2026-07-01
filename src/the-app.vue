<template>
  <!--  :class="$i18n.locale" root element class to control fonts on each locale  -->
  <router-view :class="locale"></router-view>
</template>

<script setup>
import { objSnakeToCamel } from '@webitel/ui-sdk/src/scripts/caseConverters';
import querystring from 'querystring';
import { inject, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from './stores/useAuthStore';

const authStore = useAuthStore();
const { checkCurrentSession } = authStore;

const eventBus = inject('$eventBus');
const { locale, fallbackLocale } = useI18n();

const setLanguage = () => {
	const lang = localStorage.getItem('lang');
	if (lang) locale.value = lang;

	const fallbackLang = localStorage.getItem('fallbackLang');
	if (fallbackLang) fallbackLocale.value = fallbackLang;
};

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

setLanguage();
checkCurrentSession();

onMounted(() => {
	handlePathQuery();
});
</script>

<style lang="scss">
#app {
  height: 100%;
}
</style>
