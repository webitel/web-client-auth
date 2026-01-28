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
        <div
          class="contact-center-slide__text"
          :class="{ 'typo-body-2': $breakpoint.lgOnly, 'typo-body-1': !$breakpoint.lgOnly }"
        >
          Flexible and fully customizable contact center software that drives business growth and delivers a unique
          customer experience. Powerful tools for managing omnichannel communications, teams, workflows, tasks,
          integrations, call history, analytics, and more.
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
  name: 'ContactCenterSlide',
  data: () => ({
  }),
  methods: {
  },
};
</script>

<style
  lang="scss"
  scoped
>
@use '@webitel/styleguide/viewport-breakpoints' as *;

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
    width: fit-content;
  }

  &__text-wrap {
    width: $text-width-lg;
    position: absolute;
    top: 0;
    left: 0;
  }

  &__title {
    font-size: 58px;
    font-weight: 700;
    line-height: 71px;
  }

  &__subtitle {
    font-size: 40px;
    font-weight: 700;
    line-height: 49px;
  }

  &__text {}

  &__line {
    border-top: 3px solid var(--primary-color);
    margin: var(--spacing-md) 0;
  }

  &__image {
    width: $img-width-lg;
  }
}

@media (max-width: $viewport-lg) {

  .contact-center-slide {
    &__text-wrap {
      width: $text-width-md;
    }

    &__title {
      font-size: 36px;
      line-height: 44px;
    }

    &__subtitle {
      font-size: 26px;
      line-height: 32px;
    }

    &__line {
      border-top: 2px solid var(--primary-color);
      margin: var(--spacing-sm) 0;
    }

    &__image {
      width: $img-width-md;
    }
  }
}
</style>
