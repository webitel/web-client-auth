<template>
  <div class="contact-center-slide">
    <div class="contact-center-slide__text-wrap">
      <div class="contact-center-slide__title">
        Contact Center Automation Platform
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

.contact-center-slide {
  position: relative;

  &__text-wrap {
    width: 462px;
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
