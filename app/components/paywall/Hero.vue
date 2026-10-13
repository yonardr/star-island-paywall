<script setup lang="ts">
defineProps<{ illustration: 'planet' | 'success' }>()
defineEmits<{ close: [] }>()
</script>

<template>
  <header class="hero">
    <div class="hero__bar">
      <button type="button" class="hero__close" aria-label="Закрыть" @click="$emit('close')">
        <PaywallIcon name="close" />
      </button>
    </div>
    <PaywallIllustration :name="illustration" />
    <div class="hero__heading">
      <h1 class="hero__title">
        <slot name="title" />
      </h1>
      <p class="hero__subtitle">
        <slot name="subtitle" />
      </p>
    </div>
  </header>
</template>

<style scoped>
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: calc(12px + var(--safe-top)) 20px 24px;
  background: var(--hero-gradient);
  border-radius: 0 0 32px 32px;
  color: #fff;
}

.hero__bar {
  display: flex;
  width: 100%;
}

.hero__close {
  position: relative;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgb(255 255 255 / 0.18);
  transition: background-color 0.15s ease, transform 0.15s ease;
}

/* 44×44 hit area around the 40 px visual */
.hero__close::before {
  content: '';
  position: absolute;
  inset: -2px;
}

.hero__close:active {
  background: rgb(255 255 255 / 0.28);
  transform: scale(0.94);
}

.hero__heading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding-top: 16px;
  text-align: center;
}

.hero__title {
  font-size: 26px;
  line-height: 32px;
  font-weight: 800;
}

.hero__subtitle {
  font-size: 15px;
  line-height: 21px;
  font-weight: 600;
  color: rgb(255 255 255 / 0.85);
}
</style>
