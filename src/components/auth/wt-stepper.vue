<template>
  <div class="wt-stepper">
    <div class="wt-stepper-header">
      <div
        class="wt-stepper-steps"
      >
        <div
          class="wt-stepper-steps__wrapper"
          v-for="({name, completed}, idx) in props.steps"
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
      <p class="wt-stepper-description">{{ description }}</p>
    </slot>

    <slot name="main"></slot>

    <slot name="footer"></slot>

  </div>
</template>
<script setup>
import { computed, watch } from 'vue';

const props = defineProps({
  steps: {
    type: Object,
  },
  activeStep: {
    type: Number,
    default: 1,
  }
});

const description = computed(() => props.steps[props.activeStep - 1].description);

function updateCompletedValue() {
  props.steps.map((item, idx) => {
    if(props.activeStep > idx) {
      item.completed = true
    } else item.completed = false;
  })
}

updateCompletedValue();

watch(() => props.activeStep, () => updateCompletedValue());
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
}

.wt-stepper-steps {
  display: flex;
  align-items: center;

  &__wrapper {
    display: contents;
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

.wt-stepper-description {
  padding-bottom: var(--spacing-lg);
}
</style>
