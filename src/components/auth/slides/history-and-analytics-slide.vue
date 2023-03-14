<template>
  <section
    class="history-and-analytics-slide"
    :class="{ 'history-and-analytics-slide--lg': $breakpoint.lgOnly }"
  >
    <div class="history-and-analytics-slide__wrap">
      <div class="history-and-analytics-slide__text-wrap">
        <div class="history-and-analytics-slide__title">
          History and Analytics
        </div>
        <div class="history-and-analytics-slide__line"></div>
        <div  class="history-and-analytics-slide__text">
          <p> Records of all calls made through the platform, with the ability to comment, search by keywords and filter for a selected period. Enhanced options for transcribing conversation recordings into text, and text messages – into sound files.</p>
          <br/>
          <p> A built-in analytical module for tracking, displaying, and visualizing key indicators and processes within a contact center with the possibility to create custom reports. </p>
        </div>
      </div>
      <img
          alt="history-and-analytics-pic"
          class="history-and-analytics-slide__image"
          src="../../../assets/img/auth/slides/history-and-analytics.svg"
          draggable="false"
      >
    </div>
  </section>

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
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  &__wrap {
    position: relative;
    width: fit-content;
  }

  &__text-wrap {
    width: $text-width-lg;
    position: absolute;
    top: 0;
    left: 0;
  }

  &__title {
    font-size: 64px;
    font-weight: 700;
    line-height: 78px;
  }

  &__text {
    @extend %typo-body-1;
  }

  &__line {
    border-top: 3px solid var(--accent-color);
    margin: var(--spacing-md) 0;
  }

  &__image {
    width: $img-width-lg;
  }
}

.history-and-analytics-slide--lg {
  .history-and-analytics-slide__text {
      @extend %typo-body-2;
  }
}

//@media (max-width: $viewport-lg) {
//
//  .history-and-analytics-slide {
//    &__wrap {
//      width: 640px;
//      height: 480px;
//    }
//
//    &__text-wrap {
//      width: $text-width-md;
//    }
//
//    &__title {
//      font-size: 48px;
//      line-height: 59px;
//    }
//
//    &__line {
//      border-top: 2px solid var(--accent-color);
//      margin: var(--spacing-sm) 0;
//    }
//
//    &__image {
//      width: $img-width-md;
//    }
//  }
//}

</style>
