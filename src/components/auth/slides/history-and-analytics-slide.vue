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
$text-width-lg: 387px;
$text-width-md: 291px;
$img-width-lg: 1024px;
$img-width-md: 640px;

.history-and-analytics-slide {
  position: relative;

  &__text-wrap {
    width: $text-width-lg;

    @media (max-width: $breakpoint-lg) {
      max-width: $text-width-md;
    }
  }

  &__line {
    border-top: 3px solid var(--accent-color);
    margin: var(--spacing-md) 0;

    @media (max-width: $breakpoint-lg) {
      border-top: 2px solid var(--accent-color);
    }
  }

  &__image {
    position: absolute;
    max-width: $img-width-lg;
    top: 0;
    left:0;

    @media (max-width: $breakpoint-lg) {
      max-width: $img-width-md;
    }
  }
}

</style>
