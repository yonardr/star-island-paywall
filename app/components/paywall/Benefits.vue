<script setup lang="ts">
const benefits = [
  { icon: 'star', text: '120+ уровней и 8 миров' },
  { icon: 'heart', text: 'Новые герои каждую неделю' },
  { icon: 'shield', text: 'Безопасно и без рекламы' },
] as const
</script>

<template>
  <ul class="benefits">
    <li v-for="benefit in benefits" :key="benefit.icon" class="benefit">
      <span class="benefit__icon"><PaywallIcon :name="benefit.icon" /></span>
      {{ benefit.text }}
    </li>
  </ul>
</template>

<style scoped>
.benefits {
  display: flex;
  flex-direction: column;
  gap: 12px;
  list-style: none;
}

.benefit {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  line-height: 22px;
  font-weight: 700;
}

.benefit__icon {
  display: grid;
  flex: none;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: var(--c-primary-soft);
}
</style>
