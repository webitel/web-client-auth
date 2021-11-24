<template>
  <!--  :class="$i18n.locale" root element class to control fonts on each locale  -->
  <router-view :class="$i18n.locale"></router-view>
</template>

<script>

import { mapActions } from "vuex";

export default {
  name: 'app',
  created() {
    this.checkToken();
    this.setLanguage();
  },
  methods: {
    setLanguage() {
      const lang = localStorage.getItem('lang');
      if (lang) this.$i18n.locale = lang;
    },

    ...mapActions('auth', {
      checkToken: 'CHECK_TOKEN',
    }),
  }
};
</script>

<style>

</style>
