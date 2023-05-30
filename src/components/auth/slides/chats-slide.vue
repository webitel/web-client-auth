<template>
  <section
    class="chats-slide"
    :class="{ 'chats-slide--lg': $breakpoint.lgOnly }"
  >
    <div class="chats-slide__wrap">
      <div class="chats-slide__text-wrap">
        <div class="chats-slide__title">
          Chats
        </div>
        <div class="chats-slide__line"></div>
        <div  class="chats-slide__text">
          Easy way to improve customer service and engagement. Efficient handling of text communications from multiple channels: messengers, emails, and website chats, on one platform.
        </div>
      </div>
      <img
          alt="chats-slide-pic" class="chats-slide__image"
          src="../../../assets/img/auth/slides/chats.svg"
          draggable="false"
      >
    </div>
  </section>

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
$text-width-md: 245px;
$img-width-lg: 1024px;
$img-width-md: 640px;

.chats-slide {
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

.chats-slide--lg {
  .chats-slide__text {
      @extend %typo-body-2;
  }
}

@media (max-width: $viewport-lg) {

  .chats-slide {
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

    &__line {
      border-top: 2px solid var(--accent-color);
      margin: var(--spacing-sm) 0;
    }

    &__image {
      width: $img-width-md;
    }
  }
}

</style>
