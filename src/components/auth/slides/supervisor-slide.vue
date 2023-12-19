<template>
  <section
    class="supervisor-slide"
    :class="{ 'supervisor-slide--lg': $breakpoint.lgOnly }"
  >
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
$text-width-md: 301px;
$img-width-lg: 1024px;
$img-width-md: 602px;

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
    border-top: 3px solid var(--primary-color);
    margin: var(--spacing-md) 0;
  }

  &__image {
    width: $img-width-lg;
  }
}

.supervisor-slide--lg {
  .supervisor-slide__text {
      @extend %typo-body-2;
  }
}

@media (max-width: $viewport-lg) {

  .supervisor-slide {
    &__wrap {
      width: 640px;
      height: 480px;
    }

    &__text-wrap {
      width: $text-width-md;
    }

    &__title {
      font-size: 48px;
      line-height: 59px;
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
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }
}

</style>
