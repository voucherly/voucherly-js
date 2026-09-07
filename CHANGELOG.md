# Changelog

## 2.0.0

First release of the Voucherly.js loader.

- `loadVoucherly()` injects `https://checkout.voucherly.it/embed/v1/voucherly.js` once and resolves with the `Voucherly` global.
- TypeScript types for `Voucherly.init`, `Voucherly.initExpress`, their options and the events they raise.
- ESM and CommonJS builds, no runtime dependencies.
