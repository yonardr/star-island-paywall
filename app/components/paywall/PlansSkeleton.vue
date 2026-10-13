<template>
  <div class="skeleton" role="status" aria-label="Загружаем тарифы">
    <span v-for="i in 2" :key="i" class="skeleton__card" />
  </div>
</template>

<style scoped>
.skeleton {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton__card {
  height: 76px;
  border-radius: 20px;
  background:
    linear-gradient(100deg, transparent 30%, rgb(255 255 255 / 0.55) 50%, transparent 70%) 0 0 / 200% 100% no-repeat,
    var(--c-skeleton);
  animation: shimmer 1.4s ease-in-out infinite;
}

@keyframes shimmer {
  from { background-position: 150% 0, 0 0; }
  to { background-position: -50% 0, 0 0; }
}
</style>
