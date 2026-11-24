# Changelog

## 2.1.0

The Payment Component in its final shape, and instalment messages.

- `paymentGateways`, the same option on both components, says which gateways a component offers, each `"auto" | "never"` and `auto` by default: `wallets.applePay` and `wallets.googlePay`; `voucherlyCustoms.wallet` (personal credit), `voucherlyCustoms.prepaid` and, on the Payment Component only, `voucherlyCustoms.manual`, the merchant's manual methods such as cash at the counter. It replaces `wallets` of the Payment Component and `paymentMethods` of the Express Checkout Component.
- On the Express Checkout Component, `auto` shows personal credit and prepaid quota only when they cover the whole remaining amount; `always` is gone, and a partial payment stays in the Payment Component.
- `layout` of the Payment Component, read when it is mounted: `"auto"` (the default) or `"list"`, or an object with `type`, `radios` (`auto`, `always`, `never`, `if_multiple`), `paymentGatewayLogoPosition` (`start`, `end`) and `visibleItemsCount` (`4` by default, `0` shows every method).
- `walletTopUp` and `savedPaymentMethods.remove` on the Payment Component, `"auto" | "never"`, for topping up personal credit and removing a saved payment method.
- `locked` on the Payment Component and the `onLockedAttempt` callback: while `locked` is `true` no payment starts from the component, wallets included, and the callback tells your page the customer tried, so it can show what is still missing.
- `Voucherly.submit()` returns a promise of `{ status }`, settled when the component has handled the submission: `done`, `no_method`, `locked` or `unanswered`.
- The components start from the merchant's branding, and `appearance.variables` override it. `fontSize` sets the root size of the component and scales all of it.
- Types for `Voucherly.paymentMessages({ publicKey, container, amount, currency })`, which shows the official message of each instalment gateway the merchant has active — PayPal Pay Later, Klarna, Scalapay — and returns `update({ amount })` and `destroy()`.
- A Content Security Policy needs `api.voucherly.it` in `connect-src`, and the hosts of the providers the merchant uses: `*.paypal.com` and `*.paypalobjects.com` for PayPal, `js.klarna.com` in `script-src` and `https://*.klarna.com` in `frame-src` for Klarna, `cdn.scalapay.com` for Scalapay.

## 2.0.1

Voucherly.js moved to its own host.

- `loadVoucherly()` injects `https://js.voucherly.it/embed/v1/voucherly.js`. The script, its API and the iframe served by `checkout.voucherly.it` are unchanged.
- A Content Security Policy needs `js.voucherly.it` in `script-src`; `frame-src` and `connect-src` stay on `checkout.voucherly.it`.

## 2.0.0

First release of the Voucherly.js loader.

- `loadVoucherly()` injects `https://checkout.voucherly.it/embed/v1/voucherly.js` once and resolves with the `Voucherly` global.
- TypeScript types for `Voucherly.init`, `Voucherly.initExpress`, their options and the events they raise.
- Types for the popup mode of the Payment Component: `Voucherly.init({ displayMode: "popup", … })` with `overlay`, `onPopupOpened` and `onPopupClosed`, and `Voucherly.submit()` opening the popup.
- `redirect` on both components, `always` by default or `if_required`, and the `redirect_url_missing` error code.
- ESM and CommonJS builds, no runtime dependencies.
