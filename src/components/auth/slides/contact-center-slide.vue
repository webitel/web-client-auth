<template>
  <div class="contact-center-slide">
    <div class="contact-center-slide__text-wrap">
      <div class="contact-center-slide__title">
       <span> Contact Center </span>
        <span> Automation Platform </span>
      </div>
      <div class="contact-center-slide__line"></div>
      <div  class="contact-center-slide__text">
        Flexible and fully customizable contact center software that drives business growth and delivers a unique customer experience. Powerful tools for managing omnichannel communications, teams, workflows, tasks, integrations, call history, analytics, and more.
      </div>
    </div>
    <img alt="pic" class="contact-center-slide__image" src="../../../assets/img/auth/slides/contact-center.svg">
  </div>

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
$text-width-md: 0;
$img-width-lg: 1024px;
$img-width-md: 640px;

.contact-center-slide {
  position: relative;
  width: fit-content;

  &__text-wrap {
    width: $text-width-lg;
    position: absolute;
    top: 0;
    left:0;

    @media (max-width: $breakpoint-md) {
      max-width: $text-width-md;
    }
  }

  &__line {
    border-top: 2px solid var(--accent-color);
    margin: var(--spacing-md) 0;
  }

  &__image {
    max-width: $img-width-lg;
    width: 100%;

    @media (max-width: $breakpoint-md) {
      max-width: $img-width-md;
    }
  }
}

</style>
