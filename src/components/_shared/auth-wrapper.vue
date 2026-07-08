<template>
  <section class="auth-wrapper">
    <div v-if="$slots.title" class="auth-wrapper__title">
      <slot name="title" />
    </div>

    <div class="auth-wrapper__content">
      <slot />
    </div>

    <div v-if="$slots.actions" class="auth-wrapper__actions">
      <slot name="actions" />
    </div>

    <div v-if="$slots.footer" class="auth-wrapper__footer">
      <slot name="footer" />
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped lang="scss">
.auth-wrapper {
  display: flex;
  flex-direction: column;
}

.auth-wrapper__actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-sm);
}

.auth-wrapper__title {
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.auth-wrapper__actions {
  margin-top: var(--spacing-md);
}
</style>
