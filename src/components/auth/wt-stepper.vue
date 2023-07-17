<template>
  <div class="wt-stepper">
    <div class="wt-stepper-header">
      <slot name="title">
        <h1 class="wt-stepper-title">{{ $t(props.formData.title) }}</h1>
      </slot>

      <div class="wt-stepper-steps">
          <wt-chip
            v-for="({name, completed}, idx) in props.formData.steps"
            :color="!completed && 'secondary'"
            class="wt-stepper-steps__item"
          >{{ name }}
          </wt-chip>
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

.wt-stepper-steps {
  display: flex;
  justify-content: space-between;

  &__item{
    width: 100%;
    position: relative;
    flex-basis: calc(100% / 3);

    &:not(:first-child):before {
      content: '';
      position: absolute;
      left: -100%;
      bottom: 50%;
      height: 1px;
      width: 100%;
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
