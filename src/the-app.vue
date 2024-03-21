<template>
  <!--  :class="$i18n.locale" root element class to control fonts on each locale  -->
  <router-view :class="$i18n.locale"></router-view>
</template>

<script>
import { mapActions } from "vuex";
import { objSnakeToCamel } from '@webitel/ui-sdk/src/scripts/caseConverters';
import qs from 'qs';
import Flicking from '@egjs/vue3-flicking';

export default {
  name: 'the-app',
  components: { Flicking },
  inject: ['$eventBus'],
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
    this.setLanguage();
    this.checkCurrentSession();
  },
  mounted() {
    this.handlePathQuery();
  },
};
</script>

<style lang="scss">
#app {
  height: 100%;
}
</style>
