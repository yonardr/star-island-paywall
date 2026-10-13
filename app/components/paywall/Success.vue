<script setup lang="ts">
import type { Offer, Purchase } from '#shared/types/paywall'

const props = defineProps<{ purchase: Purchase, offer?: Offer, restored: boolean }>()
defineEmits<{ play: [], close: [] }>()

const receipt = computed(() => [
  { label: 'Тариф', value: props.offer?.title ?? props.purchase.offerId },
  { label: 'Сумма', value: `${formatPrice(props.purchase.price)} · тест` },
  { label: 'Номер покупки', value: `#${props.purchase.id.slice(0, 8).toUpperCase()}` },
])
</script>

<template>
  <main class="screen">
    <PaywallHero illustration="success" @close="$emit('close')">
      <template #title>
        {{ restored ? 'Покупка' : 'Готово!' }}<br>{{ restored ? 'восстановлена' : 'Остров открыт' }}
      </template>
      <template #subtitle>
        Тариф «{{ offer?.title ?? purchase.offerId }}» активен.<br>Все уровни и герои уже ждут
      </template>
    </PaywallHero>

    <section class="screen__content">
      <dl class="receipt">
        <div v-for="row in receipt" :key="row.label" class="receipt__row">
          <dt>{{ row.label }}</dt>
          <dd>{{ row.value }}</dd>
        </div>
      </dl>
    </section>

    <div class="screen__spacer" />

    <footer class="screen__footer success__footer">
      <PaywallCta @click="$emit('play')">
        Начать играть
      </PaywallCta>
      <p class="legal">
        Покупка сохранена. На другом устройстве нажмите<br>«Восстановить покупки» на экране подписки.
      </p>
    </footer>
  </main>
</template>

<style scoped>
.receipt {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  padding: 14px;
  border: 2px solid var(--c-border);
  border-radius: 20px;
  background: var(--c-surface);
}

.receipt__row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 15px;
  line-height: 20px;
}

.receipt__row dt {
  font-weight: 600;
  color: var(--c-text-muted);
}

.receipt__row dd {
  margin: 0;
  font-weight: 800;
  text-align: right;
}

.success__footer {
  gap: 12px;
}
</style>
