<script setup lang="ts">
import type { Offer } from '#shared/types/paywall'

defineProps<{ offers: Offer[], disabled?: boolean }>()
const selected = defineModel<string>()
</script>

<template>
  <!-- Native radios: arrow-key navigation and screen-reader semantics for free -->
  <fieldset class="plans" :disabled="disabled">
    <legend class="sr-only">
      Выберите тариф
    </legend>
    <label
      v-for="offer in offers"
      :key="offer.id"
      class="plan"
      :class="{ 'plan--selected': offer.id === selected }"
    >
      <input v-model="selected" type="radio" name="offer" class="sr-only" :value="offer.id">
      <span class="plan__radio" aria-hidden="true">
        <PaywallIcon v-if="offer.id === selected" name="check" />
      </span>
      <span class="plan__info">
        <span class="plan__title">{{ offer.title }}</span>
        <span class="plan__note">{{ offer.caption }}</span>
      </span>
      <span class="plan__price">
        <span class="plan__amount">{{ formatPrice(pricePerMonth(offer.price, offer.periodMonths)) }}</span>
        <span class="plan__note">в месяц</span>
      </span>
      <span v-if="offer.badge" class="plan__badge">{{ offer.badge }}</span>
    </label>
  </fieldset>
</template>

<style scoped>
.plans {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  border: 0;
  transition: opacity 0.2s ease;
}

.plans:disabled {
  opacity: 0.6;
}

.plan {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  /* 2px border + 14px = the 16px padding of the Figma card (its stroke is drawn inside) */
  padding: 14px;
  border: 2px solid var(--c-border);
  border-radius: 20px;
  background: var(--c-surface);
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
}

.plans:disabled .plan {
  cursor: default;
}

.plan:active {
  transform: scale(0.985);
}

.plan:has(:focus-visible) {
  outline: 3px solid var(--c-primary);
  outline-offset: 2px;
}

.plan--selected {
  border-color: var(--c-primary);
  box-shadow: 0 8px 24px rgb(124 58 237 / 0.18);
}

.plan__radio {
  display: grid;
  flex: none;
  place-items: center;
  width: 24px;
  height: 24px;
  border: 2px solid var(--c-radio-border);
  border-radius: 50%;
  background: var(--c-surface);
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.plan--selected .plan__radio {
  border-color: var(--c-primary);
  background: var(--c-primary);
}

.plan__info,
.plan__price {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.plan__info {
  flex: 1 1 auto;
  min-width: 0;
}

.plan__price {
  flex: none;
  align-items: flex-end;
  text-align: right;
}

.plan__title {
  font-size: 17px;
  line-height: 22px;
  font-weight: 800;
}

.plan__amount {
  font-size: 18px;
  line-height: 22px;
  font-weight: 800;
  white-space: nowrap;
}

.plan__note {
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
  color: var(--c-text-muted);
}

/* Absolute offsets are measured from the padding box, i.e. inside the 2px border: -13/14 here = -11/16 in Figma */
.plan__badge {
  position: absolute;
  top: -13px;
  right: 14px;
  padding: 3px 10px;
  border-radius: 11px;
  background: var(--c-badge);
  color: var(--c-badge-text);
  font-size: 12px;
  line-height: 16px;
  font-weight: 800;
  white-space: nowrap;
}
</style>
