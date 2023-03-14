<template>
  <section
    class="contact-center-slide"
    :class="{ 'contact-center-slide--lg': $breakpoint.lgOnly }"
  >
    <div class="contact-center-slide__wrap">
      <div class="contact-center-slide__text-wrap">
        <div class="contact-center-slide__title">
         Contact Center
        </div>
        <div class="contact-center-slide__subtitle">
          Automation Platform
        </div>
        <div class="contact-center-slide__line"></div>
        <div  class="contact-center-slide__text">
          Flexible and fully customizable contact center software that drives business growth and delivers a unique customer experience. Powerful tools for managing omnichannel communications, teams, workflows, tasks, integrations, call history, analytics, and more.
        </div>
      </div>
      <img
          alt="contact-center-pic"
          class="contact-center-slide__image"
          src="../../../assets/img/auth/slides/contact-center.svg"
          draggable="false"
      >
    </div>
  </section>

</template>

<script>

export default {
  name: 'contact-center-slide',
  data: () => ({
  }),
  methods: {
  },
};
</script>

<style lang="scss" scoped>
$text-width-lg: 462px;
$text-width-md: 290px;
$img-width-lg: 1024px;
$img-width-md: 640px;

.contact-center-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  &__wrap {
    position: relative;
    max-width: $img-width-lg;
    width: 54vw;
    min-width: $img-width-md;
  }

  &__text-wrap {
    width: 45%;
    //width: 24vw;
    position: absolute;
    top: 0;
    left: 0;
  }

  &__title {
    font-size: 2.9vw;
    font-weight: 700;
    line-height: 71px;
  }

  &__subtitle {
    font-size: 2vw;
    font-weight: 700;
    line-height: 49px;
  }

  &__text {
    font-size: 0.8vw;
    line-height: 24px;
  }

  &__line {
    border-top: 3px solid var(--accent-color);
    margin: var(--spacing-md) 0;
  }

  &__image {
    width: 100%;
  }
}

//.contact-center-slide--lg {
//  .contact-center-slide__text {
//      @extend %typo-body-2;
//  }
//}

@media (max-width: $viewport-lg) {

  .contact-center-slide {

    //&__title {
    //  font-size: 36px;
    //  line-height: 44px;
    //}
    //
    //&__subtitle {
    //  font-size: 26px;
    //  line-height: 32px;
    //}

    &__line {
      border-top: 2px solid var(--accent-color);
      margin: var(--spacing-sm) 0;
    }

    //&__image {
    //  width: $img-width-md;
    //}
  }
}

</style>
