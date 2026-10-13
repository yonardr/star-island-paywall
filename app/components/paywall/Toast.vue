<script setup lang="ts">
import type { ToastMessage } from '~/composables/usePaywall'

defineProps<{ message: ToastMessage | null }>()
defineEmits<{ dismiss: [] }>()
</script>

<template>
  <Transition name="toast">
    <div
      v-if="message"
      class="toast"
      :class="`toast--${message.kind}`"
      :role="message.kind === 'error' ? 'alert' : 'status'"
      @click="$emit('dismiss')"
    >
      <span class="toast__icon"><PaywallIcon name="alert" /></span>
      <div class="toast__text">
        <p class="toast__title">
          {{ message.title }}
        </p>
        <p class="toast__description">
          {{ message.text }}
        </p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.toast {
  position: absolute;
  top: calc(12px + var(--safe-top));
  left: 20px;
  right: 20px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 16px;
  background: var(--c-surface);
  box-shadow: 0 8px 24px rgb(31 22 64 / 0.16);
}

.toast__icon {
  display: grid;
  flex: none;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--c-danger-soft);
  color: var(--c-danger);
}

.toast--info .toast__icon {
  background: var(--c-primary-soft);
  color: var(--c-primary);
}

.toast__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.toast__title {
  font-size: 15px;
  line-height: 20px;
  font-weight: 800;
}

.toast__description {
  font-size: 13px;
  line-height: 18px;
  font-weight: 600;
  color: var(--c-text-muted);
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s ease, transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
