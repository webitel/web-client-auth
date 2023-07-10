<template>
  <div>
    <slot name="header"></slot>

    <ul class="wt-stepper--header">
      <li class="wt-stepper--header__item" v-for="(step, idx) of props.formData.steps">
        <wt-chip class="wt-stepper--header__title">{{ step.name }}</wt-chip>
      </li>
    </ul>

    <slot name="desc"></slot>

    <slot name="main"></slot>

    <div class="wt-stepper--action">
      <slot name="primary-action">
        <wt-button
          @click="emit('prevStepAction')"
        >{{$t( props.formData.prevBtnText || 'webitelUI.errorPages.goBack') }}</wt-button>
      </slot>

      <wt-button
        @click="emit('nextStepAction')"
      >{{ $t( props.formData.nextBtnText || 'webitelUI.pagination.next') }}</wt-button>
    </div>

    <slot name="footer"></slot>

  </div>

</template>

<script setup>

const props = defineProps({
  formData: {
    type: Object,
  },
});

const emit = defineEmits([
  'prevStepAction',
  'nextStepAction',
]);
</script>

<style>
.wt-stepper--header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.wt-stepper--header__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: space-between;
  align-items: center;
}

.wt-stepper--header__title {
  ///width: max-content;
  z-index: 1000;
}

.wt-stepper--header__item:not(:last-child):after {
  content: "";
  position: relative;
  top: 50%;
  left: 0;
  height: 2px;
  background-color: #e0e0e0;
  order: -1;
  z-index: 1;
}

.wt-stepper--action {
  display: flex;
  justify-content: space-between;
}
</style>
