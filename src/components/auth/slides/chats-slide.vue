<template>
  <div class="chats-slide">
    <div class="chats-slide__text-wrap">
      <div class="chats-slide__title">
        Chats
      </div>
      <div class="chats-slide__line"></div>
      <div  class="chats-slide__text">
        Easy way to improve customer service and engagement. Efficient handling of text communications from multiple channels: messengers, emails, and website chats, on one platform.
      </div>
    </div>
    <img alt="pic" class="chats-slide__image" src="../../../assets/img/auth/slides/chats.svg">
  </div>

</template>

<script>

export default {
  name: 'chats-slide',
  data: () => ({
  }),
  methods: {
  },
};
</script>

<style lang="scss" scoped>
$text-width-lg: 331px;
$text-width-md: 0;
$img-width-lg: 1024px;
$img-width-md: 640px;

.chats-slide {
  position: relative;

  &__text-wrap {
    width: $text-width-lg;

    @media (max-width: $breakpoint-md) {
      max-width: $text-width-md;
    }
  }

  &__line {
    border-top: 2px solid var(--accent-color);
    margin: var(--spacing-md) 0;
  }

  &__image {
    position: absolute;
    max-width: $img-width-lg;
    top: 0;
    left:0;

    @media (max-width: $breakpoint-md) {
      max-width: $img-width-md;
    }
  }
}

</style>
