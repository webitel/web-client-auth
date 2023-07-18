<template>
  <div class="wt-stepper">
    <div class="wt-stepper-header">
      <slot name="title">
        <h1 class="wt-stepper-title">{{ $t(props.formData.title) }}</h1>
      </slot>

      <div
        class="wt-stepper-steps"
      >
        <div
          class="wt-stepper-steps__wrapper"
          v-for="({name, completed}, idx) in props.formData.steps"
          :class="{ 'wt-stepper-steps__wrapper--first': idx === 0 }"
        >
          <div
            v-if="idx !== 0"
            class="wt-stepper-steps__divider"
            :class="{ 'wt-stepper-steps__divider--completed': completed }"
          ></div>
          <wt-chip
            class="wt-stepper-steps__item"
            :color="!completed && 'secondary'"
          >{{ name }}
          </wt-chip>
        </div>
      </div>
    </div>

    <slot name="description">
      <p class="wt-stepper-desc">{{ $t(description) }}</p>
    </slot>

    <div class="wt-stepper-main">
      <slot name="main"></slot>

      <div class="wt-stepper-actions">
        <slot name="primary-action">
          <wt-button
            @click="emit('prevStepAction')"
            color="secondary"
          >{{ $t(props.formData.prevBtnText || 'auth.back') }}
          </wt-button>
        </slot>

        <wt-button
          @click="emit('nextStepAction')"
          :disabled="props.formData.isDisabledNextBtn"
        >{{ $t(props.formData.nextBtnText || 'webitelUI.pagination.next') }}
        </wt-button>
      </div>
    </div>

    <slot name="footer"></slot>

  </div>
</template>
<script setup>
import { computed } from 'vue';

const props = defineProps({
  formData: {
    type: Object,
  },
});
const emit = defineEmits([
  'prevStepAction',
  'nextStepAction',
]);

const description = computed(() => props.formData.steps[props.formData.activeStep - 1].desc);

</script>

<style lang="scss">
.wt-stepper {
  text-align: center;
}

.wt-stepper-header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);

  .wt-stepper-title {
    @extend %typo-heading-3;
  }
}

//.wt-stepper-steps {
//  display: flex;
//  align-items: center;
//
//  &__wrapper {
//    display: contents;
//  }
//
//  &__item {
//  }
//
//  &__divider {
//    flex: 1 1 auto;
//    height: 1px;
//    background: var(--secondary-color);
//
//    &--completed {
//      background-color: var(--chip-bg-color);
//    }
//  }
//}

.wt-stepper-steps {
  display: flex;
  align-items: center;

  &__wrapper {
    display: flex;
    align-items: center;

    // remove this class, i added it only for representation purposes to this case
    &:not(&--first) {
      flex-grow: 1;
    }
  }

  &__item {
  }

  &__divider {
    flex: 1 1 auto;
    height: 1px;
    background: var(--secondary-color);

    &--completed {
      background-color: var(--chip-bg-color);
    }
  }
}

.wt-stepper-desc {
  padding-bottom: var(--spacing-lg);
}

.wt-stepper-main {
  .wt-stepper-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: var(--spacing-sm);
  }
}
</style>
