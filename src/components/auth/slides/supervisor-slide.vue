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

.supervisor-slide {
  position: relative;

  &__text-wrap {
    width: 473px;
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
