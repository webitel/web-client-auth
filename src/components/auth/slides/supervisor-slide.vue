<template>
  <section class="supervisor-slide">
    <div class="supervisor-slide__wrap">
      <div class="supervisor-slide__text-wrap">
        <div class="supervisor-slide__title">
          Supervisor
        </div>
        <div class="supervisor-slide__line"></div>
        <div  class="supervisor-slide__text">
          A comprehensive service to monitor and effectively manage queues, active calls, agents' work and KPIs. Advanced settings for configuring agent skills and statuses, dedicated teams, participating in ongoing calls, and forming detailed reports.
        </div>
      </div>
      <img
          alt="supervisor-pic"
          class="supervisor-slide__image"
          src="../../../assets/img/auth/slides/supervisor.svg"
          draggable="false"
      >
    </div>
  </section>

</template>

<script>

export default {
  name: 'supervisor-slide',
  data: () => ({
  }),
  methods: {
  },
};
</script>

<style lang="scss" scoped>
$text-width-lg: 473px;
$text-width-md: 376px;
$img-width-lg: 1024px;
$img-width-md: 640px;

.supervisor-slide {
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

    @media (max-width: $breakpoint-lg) {
      max-width: $text-width-md;
      height: 480px;
    }
  }

  &__title {
    font-size: 64px;
    font-weight: 700;
    line-height: 78px;

    @media (max-width: $breakpoint-lg) {
      font-size: 48px;
      line-height: 59px;
    }
  }

  &__text {
    @extend %typo-body-1;

    @media (max-width: $breakpoint-lg) {
      // @extend %typo-body-2
      // link to stackoverflow issue
      // https://stackoverflow.com/questions/14840918/extending-selectors-from-within-media-queries-with-sass
      font-size: 12px;
      line-height: 16px;
    }
  }

  &__line {
    border-top: 3px solid var(--accent-color);
    margin: var(--spacing-md) 0;

    @media (max-width: $breakpoint-lg) {
      border-top: 2px solid var(--accent-color);
      margin: var(--spacing-sm) 0;
    }
  }

  &__image {
    max-width: $img-width-lg;
    width: 100%;

    @media (max-width: $breakpoint-lg) {
      max-width: $img-width-md;
    }
  }
}

</style>
