<template>
  <div class="supervisor-slide">
    <div class="supervisor-slide__text-wrap">
      <div class="supervisor-slide__title">
        Supervisor Module
      </div>
      <div class="supervisor-slide__line"></div>
      <div  class="supervisor-slide__text">
        A comprehensive service to monitor and effectively manage queues, active calls, agents' work and KPIs. Advanced settings for configuring agent skills and statuses, dedicated teams, participating in ongoing calls, and forming detailed reports.
      </div>
    </div>
    <img alt="pic" class="supervisor-slide__image" src="../../../assets/img/auth/slides/supervisor.svg">
  </div>

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
