<template>
  <div class="history-and-analytics-slide">
    <div class="history-and-analytics-slide__text-wrap">
      <div class="history-and-analytics-slide__title">
        History and Analytics
      </div>
      <div class="history-and-analytics-slide__line"></div>
      <div  class="history-and-analytics-slide__text">
        Records of all calls made through the platform, with the ability to comment, search by keywords and filter for a selected period. Enhanced options for transcribing conversation recordings into text, and text messages – into sound files.
        <span> A built-in analytical module for tracking, displaying, and visualizing key indicators and processes within a contact center with the possibility to create custom reports. </span>
      </div>
    </div>
    <img alt="pic" class="history-and-analytics-slide__image" src="../../../assets/img/auth/slides/history-and-analytics.svg">
  </div>

</template>

<script>

export default {
  name: 'history-and-analytics-slide',
  data: () => ({
  }),
  methods: {
  },
};
</script>

<style lang="scss" scoped>

.history-and-analytics-slide {
  position: relative;

  &__text-wrap {
    width: 387px;
  }

  &__image {
    position: absolute;
    max-width: 1024px;
    top: 0;
    left:0;

    @media (max-width: $breakpoint-md) {
      max-width: 640px;
    }
  }
}

</style>
