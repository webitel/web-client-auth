<template>
  <!--  :class="$i18n.locale" root element class to control fonts on each locale  -->
  <router-view :class="$i18n.locale"></router-view>
</template>

<script>

import { mapActions } from "vuex";
import { objSnakeToCamel } from '@webitel/ui-sdk/src/scripts/caseConverters';
import qs from 'querystring';

export default {
  name: 'app',
  methods: {
    ...mapActions('auth', {
      checkCurrentSession: 'CHECK_CURRENT_SESSION',
    }),
    setLanguage() {
      const lang = localStorage.getItem('lang');
      if (lang) this.$i18n.locale = lang;
    },
    handlePathQuery() {
      const query = objSnakeToCamel(qs.parse(window.parent.location.search.slice(1))); // query, without "?" sign
      if (query.error || query.errorDescription) this.handleErrorsInQuery(query);
    },
    handleErrorsInQuery({ error, errorDescription }) {
      this.$eventBus.$emit('notification', { type: 'error', text: errorDescription });
    },
  },
  created() {
    this.checkCurrentSession();
    this.setLanguage();
  },
  mounted() {
    this.handlePathQuery();
  },
};
</script>

<style>

</style>
