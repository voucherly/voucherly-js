# Changelog

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
