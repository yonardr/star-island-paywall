import type { Offer, OffersResponse, Purchase, PurchaseResponse, RestoreResponse } from '#shared/types/paywall'

export interface ToastMessage {
  kind: 'error' | 'info'
  title: string
  text: string
}

type Simulation = 'offers-error' | 'purchase-error' | 'slow'

const TOAST_TIMEOUT = 4000

/**
 * Whole paywall flow in one place: offers → selection → purchase / restore → success.
 * Components stay presentational and only render what this returns.
 */
export function usePaywall() {
  // `?simulate=` is a one-shot test hook: the first request fails (or is slow), the retry goes through normally
  const simulation = ref(useRoute().query.simulate as Simulation | undefined)
  const offersSimulation = ref(simulation.value === 'offers-error' ? 'error' : simulation.value === 'slow' ? 'slow' : undefined)

  // SSR by default: the webview gets HTML with tariffs already in it. Simulated runs fetch on the client so the
  // loading/error states are actually visible.
  const offersRequest = useFetch<OffersResponse>('/api/offers', {
    key: 'offers',
    query: { simulate: offersSimulation },
    server: !offersSimulation.value,
  })

  const offers = computed<Offer[]>(() => offersRequest.data.value?.offers ?? [])
  const offersState = computed<'loading' | 'error' | 'ready'>(() => {
    if (offersRequest.data.value) return 'ready'
    return offersRequest.status.value === 'error' ? 'error' : 'loading'
  })

  function retryOffers() {
    if (offersSimulation.value) offersSimulation.value = undefined // reactive query → refetch
    else offersRequest.refresh()
  }

  // Derived, not synced by a watcher: watchers don't run after the SSR fetch, so a synced ref would hydrate empty
  const pickedOfferId = ref<string>()
  const selectedOfferId = computed<string | undefined>({
    get: () => {
      const data = offersRequest.data.value
      if (!data) return undefined
      return data.offers.some(offer => offer.id === pickedOfferId.value) ? pickedOfferId.value : data.defaultOfferId
    },
    set: (id) => {
      pickedOfferId.value = id
    },
  })
  const selectedOffer = computed(() => offers.value.find(offer => offer.id === selectedOfferId.value))

  const purchase = ref<Purchase | null>(null)
  const isRestored = ref(false)
  const isPurchasing = ref(false)
  const isRestoring = ref(false)
  const purchasedOffer = computed(() => offers.value.find(offer => offer.id === purchase.value?.offerId))

  // One key per purchase attempt: double taps and retries after a network error never create a second row
  let idempotencyKey: string | null = null
  watch(selectedOfferId, () => {
    idempotencyKey = null
  })

  const toast = ref<ToastMessage | null>(null)
  let toastTimer: ReturnType<typeof setTimeout> | undefined
  function showToast(message: ToastMessage) {
    clearTimeout(toastTimer)
    toast.value = message
    toastTimer = setTimeout(() => (toast.value = null), TOAST_TIMEOUT)
  }
  function hideToast() {
    clearTimeout(toastTimer)
    toast.value = null
  }
  onScopeDispose(() => clearTimeout(toastTimer))

  function complete(result: Purchase, restored: boolean) {
    purchase.value = result
    isRestored.value = restored
    hideToast()
    notifyHost({ type: 'purchase', purchase: result, restored })
  }

  async function buy() {
    const offer = selectedOffer.value
    if (!offer || isPurchasing.value || isRestoring.value) return

    idempotencyKey ??= randomId()
    isPurchasing.value = true
    hideToast()
    try {
      const response = await $fetch<PurchaseResponse>('/api/purchase', {
        method: 'POST',
        query: { simulate: simulation.value === 'purchase-error' ? 'error' : undefined },
        body: { offerId: offer.id, deviceId: getDeviceId(), idempotencyKey },
      })
      idempotencyKey = null
      complete(response.purchase, false)
    }
    catch {
      if (simulation.value === 'purchase-error') simulation.value = undefined
      showToast({ kind: 'error', title: 'Покупка не прошла', text: 'Деньги не списаны, попробуйте снова' })
    }
    finally {
      isPurchasing.value = false
    }
  }

  async function restore() {
    if (isPurchasing.value || isRestoring.value) return

    isRestoring.value = true
    hideToast()
    try {
      const response = await $fetch<RestoreResponse>('/api/restore', {
        method: 'POST',
        body: { deviceId: getDeviceId() },
      })
      if (response.purchase) complete(response.purchase, true)
      else showToast({ kind: 'info', title: 'Покупок не найдено', text: 'На этом устройстве ещё нет подписки' })
    }
    catch {
      showToast({ kind: 'error', title: 'Не удалось восстановить', text: 'Проверьте интернет и попробуйте снова' })
    }
    finally {
      isRestoring.value = false
    }
  }

  function close(reason: 'dismissed' | 'purchased') {
    notifyHost({ type: 'close', reason })
  }

  return {
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
  }
}
