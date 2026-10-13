<script setup lang="ts">
// Same vector data as the icons in the Figma file (design/svg/*.svg)
defineProps<{ name: 'close' | 'star' | 'heart' | 'shield' | 'check' | 'alert' | 'spinner' }>()
</script>

<template>
  <svg v-if="name === 'close'" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4 4L12 12M12 4L4 12" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />
  </svg>
  <svg v-else-if="name === 'star'" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 2L12.47 7.01L18 7.81L14 11.71L14.94 17.21L10 14.61L5.06 17.21L6 11.71L2 7.81L7.53 7.01L10 2Z" fill="#7C3AED" stroke="#7C3AED" stroke-width="1.5" stroke-linejoin="round" />
  </svg>
  <svg v-else-if="name === 'heart'" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 17.2L8.9 16.2C4.6 12.4 2 10 2 7.1C2 4.7 3.9 2.8 6.3 2.8C7.7 2.8 9 3.4 10 4.5C11 3.4 12.3 2.8 13.7 2.8C16.1 2.8 18 4.7 18 7.1C18 10 15.4 12.4 11.1 16.2L10 17.2Z" fill="#7C3AED" />
  </svg>
  <svg v-else-if="name === 'shield'" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 1.7L3.3 4.4V9.2C3.3 13.3 6.2 17.1 10 18.3C13.8 17.1 16.7 13.3 16.7 9.2V4.4L10 1.7Z" fill="#7C3AED" />
    <path d="M7 10.2L9.1 12.3L13.3 8" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
  <svg v-else-if="name === 'check'" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M3.5 7.3L5.9 9.7L10.6 5" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
  <svg v-else-if="name === 'alert'" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 7V13" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" />
    <circle cx="12" cy="17" r="1.5" fill="currentColor" />
  </svg>
  <svg v-else-if="name === 'spinner'" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="8" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="2.5" />
    <path d="M10 2C14.42 2 18 5.58 18 10" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" />
  </svg>
</template>
