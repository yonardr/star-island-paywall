<script setup lang="ts">
defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="offers-error" role="alert">
    <div class="offers-error__message">
      <span class="offers-error__icon"><PaywallIcon name="alert" /></span>
      <div class="offers-error__text">
        <p class="offers-error__title">
          Не удалось загрузить тарифы
        </p>
        <p class="offers-error__description">
          Проверьте интернет и повторите
        </p>
      </div>
    </div>
    <button type="button" class="offers-error__retry" @click="$emit('retry')">
      Повторить
    </button>
  </div>
</template>

<style scoped>
.offers-error {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 14px;
  border: 2px solid var(--c-danger-border);
  border-radius: 20px;
  background: var(--c-surface);
}

.offers-error__message {
  display: flex;
  align-items: center;
  gap: 12px;
}

.offers-error__icon {
  display: grid;
  flex: none;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--c-danger-soft);
  color: var(--c-danger);
}

.offers-error__text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.offers-error__title {
  font-size: 17px;
  line-height: 22px;
  font-weight: 800;
}

.offers-error__description {
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
  color: var(--c-text-muted);
}

.offers-error__retry {
  height: 44px;
  border-radius: 14px;
  background: var(--c-primary-soft);
  color: var(--c-primary);
  font-size: 15px;
  line-height: 20px;
  font-weight: 800;
  transition: transform 0.15s ease;
}

.offers-error__retry:active {
  transform: scale(0.98);
}
</style>
