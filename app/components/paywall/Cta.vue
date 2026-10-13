<script setup lang="ts">
defineProps<{ loading?: boolean, disabled?: boolean }>()
defineEmits<{ click: [] }>()
</script>

<template>
  <button
    type="button"
    class="cta"
    :class="{ 'cta--loading': loading }"
    :disabled="disabled"
    :aria-busy="loading"
    @click="loading || $emit('click')"
  >
    <PaywallIcon v-if="loading" name="spinner" class="cta__spinner" />
    <slot />
  </button>
</template>

<style scoped>
.cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 56px;
  padding: 0 16px;
  border-radius: 18px;
  background: var(--c-primary);
  color: #fff;
  font-size: 17px;
  line-height: 22px;
  font-weight: 800;
  box-shadow: 0 8px 20px rgb(124 58 237 / 0.35);
  transition: opacity 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease, background-color 0.15s ease;
}

.cta:not(:disabled, .cta--loading):active {
  transform: scale(0.98);
  background: #6d2ee0;
}

.cta:disabled {
  opacity: 0.45;
  box-shadow: none;
}

.cta--loading {
  cursor: progress;
}

.cta__spinner {
  flex: none;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
