<script setup lang="ts">
const {
  offers,
  offersState,
  retryOffers,
  selectedOfferId,
  selectedOffer,
  purchase,
  purchasedOffer,
  isRestored,
  isPurchasing,
  isRestoring,
  toast,
  hideToast,
  buy,
  restore,
  close,
} = usePaywall()

const busy = computed(() => isPurchasing.value || isRestoring.value)
</script>

<template>
  <div class="app">
    <Transition name="screen" mode="out-in">
      <PaywallSuccess
        v-if="purchase"
        :purchase="purchase"
        :offer="purchasedOffer"
        :restored="isRestored"
        @play="close('purchased')"
        @close="close('purchased')"
      />

      <main v-else class="screen">
        <PaywallHero illustration="planet" @close="close('dismissed')">
          <template #title>
            Открой весь<br>Звёздный остров
          </template>
          <template #subtitle>
            Полный доступ для всей семьи —<br>играем и учимся без ограничений
          </template>
        </PaywallHero>

        <section class="screen__content">
          <PaywallBenefits />
          <PaywallPlans
            v-if="offersState === 'ready'"
            v-model="selectedOfferId"
            :offers="offers"
            :disabled="busy"
          />
          <PaywallOffersError v-else-if="offersState === 'error'" @retry="retryOffers" />
          <PaywallPlansSkeleton v-else />
        </section>

        <div class="screen__spacer" />

        <footer class="screen__footer">
          <PaywallCta :loading="isPurchasing" :disabled="!selectedOffer || isRestoring" @click="buy">
            <template v-if="isPurchasing">
              Оформляем покупку…
            </template>
            <template v-else-if="selectedOffer">
              Оформить за {{ formatPrice(selectedOffer.price) }}
            </template>
            <template v-else>
              Оформить подписку
            </template>
          </PaywallCta>
          <button type="button" class="restore" :disabled="busy" @click="restore">
            {{ isRestoring ? 'Ищем покупки…' : 'Восстановить покупки' }}
          </button>
          <p class="legal">
            Тестовый режим — деньги не списываются.<br>Отменить подписку можно в любой момент.
          </p>
        </footer>
      </main>
    </Transition>

    <PaywallToast :message="toast" @dismiss="hideToast" />
  </div>
</template>

<style scoped>
.app {
  position: relative;
  max-width: 430px;
  margin: 0 auto;
}

.restore {
  height: 44px;
  padding: 0 12px;
  color: var(--c-primary);
  font-size: 15px;
  line-height: 20px;
  font-weight: 700;
  transition: opacity 0.2s ease;
}

.restore:disabled {
  opacity: 0.4;
}

.screen-enter-active,
.screen-leave-active {
  transition: opacity 0.2s ease;
}

.screen-enter-from,
.screen-leave-to {
  opacity: 0;
}
</style>
