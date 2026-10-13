# Звёздный остров — paywall

Мобильный paywall для детской игры, который открывается во встроенном webview: два тарифа, тестовая покупка с записью в БД, восстановление покупок, состояния загрузки, ошибок и успеха.

- **Figma:** https://www.figma.com/design/YDDIUw1G6Ba5dsXc8pRFRK
- **Демо:** _DEPLOY_URL_ (состояния можно посмотреть через `?simulate=offers-error`, `?simulate=purchase-error` или `?simulate=slow`)
- **Репозиторий:** _REPO_URL_

## Локальный запуск

```bash
npm install
npm run dev        # http://localhost:3000, БД поднимется сама (PGlite в .data/)
npm test           # unit-тесты (vitest)
npm run typecheck
```

Чтобы локально работать с той же базой, что и прод, положите `DATABASE_URL` в `.env` (см. `.env.example`) или выполните `vercel env pull`.

## Где что лежит

| | |
|---|---|
| Frontend | `app/app.vue` (экран), `app/components/paywall/*` (UI), `app/composables/usePaywall.ts` (весь сценарий: тарифы → выбор → покупка/восстановление → успех) |
| Server routes | `server/api/offers.get.ts`, `server/api/purchase.post.ts`, `server/api/restore.post.ts` |
| БД | `server/utils/db.ts` (подключение и схема), `server/utils/purchases.ts` (SQL) |
| Общие типы и форматирование цен | `shared/types/paywall.ts`, `shared/utils/price.ts` |
| SVG из макета | `design/svg/` (те же векторы, что в Figma) |

Таблица `purchases`: `id`, `offer_id`, `device_id`, `price`, `currency`, `idempotency_key` (unique), `created_at`. `device_id` берётся из `?deviceId=` (его может передать нативное приложение), иначе генерируется и хранится в `localStorage`. Ключ идемпотентности защищает от двойной записи при повторном тапе или ретрае. Закрытие экрана и покупка передаются в нативную оболочку через `postMessage` (React Native / WKWebView / Android bridge, см. `app/utils/host.ts`).

## Деплой и БД

**Vercel + Neon Postgres.** Nuxt деплоится на Vercel без настройки, а server routes становятся serverless-функциями. Neon подключается из Vercel Storage в пару кликов и сам прокидывает `DATABASE_URL`. Драйвер работает по HTTP, поэтому в serverless не нужен пул соединений. В бесплатных тарифах обоих сервисов этого хватает с запасом.

Для локальной разработки используется PGlite: это тот же Postgres, только встроенный (WASM), и SQL одинаковый в обоих окружениях. В прод-бандл он не попадает. Схема создаётся идемпотентно при первом запросе. Для одной таблицы это проще, чем подключать мигратор.

## AI-инструменты

Использовал Claude Code: генерация кода, а также Figma MCP, через который макет собран из компонентов `Plan card` и `CTA button` с вариантами.

Что проверил сам:
- сценарии в браузере на 390×844 и 360×800: выбор тарифа, покупка, успех, восстановление, все `?simulate=` состояния;
- API через curl: валидация (400), неизвестный тариф (404), повтор с тем же ключом идемпотентности возвращает ту же покупку, а не дубликат;
- запись в БД;
- попиксельное сравнение (pixelmatch) скриншотов страницы с экспортом фреймов из Figma: Default 390 — 98.9%, Default 360 — 98.8%, Offers error — 99.0%, Success — 99.5%. Геометрия совпадает до пикселя, остаток — сглаживание шрифта: Chrome при DPR 1 округляет базовую линию до целого пикселя, Figma — нет.

## Если бы было ещё 2 часа

- e2e на Playwright для основных сценариев и визуальная регрессия против Figma в CI;
- миграции через drizzle-kit вместо `CREATE TABLE IF NOT EXISTS` на старте;
- `GET /api/entitlement`, чтобы игра проверяла доступ сама, плюс rate limit на `POST /api/purchase`;
- аналитика воронки: `paywall_view`, `plan_select`, `purchase_start/success/fail`;
- тарифы и тексты в БД или конфиге, чтобы проводить A/B-тесты paywall без релиза.
