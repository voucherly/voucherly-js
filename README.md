# Voucherly.js loader

[![npm](https://img.shields.io/npm/v/@voucherly/voucherly-js.svg)](https://www.npmjs.com/package/@voucherly/voucherly-js)
[![Publish](https://github.com/voucherly/voucherly-js/actions/workflows/publish.yml/badge.svg)](https://github.com/voucherly/voucherly-js/actions?query=event%3Arelease)

Loader and TypeScript types for **Voucherly.js**, the library that renders [Voucherly Components](https://docs.voucherly.it/en/guides/integrations/components/) — a payment form embedded in your own checkout page, with cards, meal vouchers, Apple Pay, Google Pay and every other payment method of your [Voucherly](https://voucherly.it) account.

This package does not contain Voucherly.js. It injects `https://checkout.voucherly.it/embed/v1/voucherly.js` into the page and resolves with the `Voucherly` global, so your integration always runs the current version of the library. Voucherly.js must be loaded from `checkout.voucherly.it`: do not bundle it and do not host a copy.

## Installation

```sh
npm install @voucherly/voucherly-js
```

## Usage

```js
import { loadVoucherly } from "@voucherly/voucherly-js";

const voucherly = await loadVoucherly();

voucherly.init({
    publicKey: "pk_live_…",
    paymentId: "pay_…",
    containerId: "voucherly-payment",
    onPaymentComplete: function (event) {
        // Confirm the outcome from your server before fulfilling the order.
    },
});
```

`loadVoucherly()` injects the script once; later calls share the same promise. It resolves with `null` when there is no `window`, so it is safe to call during server-side rendering. The `paymentId` comes from a Payment created on your server with your secret key: see the [integration guide](https://docs.voucherly.it/en/guides/integrations/components/).

The same library is also available with a plain script tag, without this package:

```html
<script src="https://checkout.voucherly.it/embed/v1/voucherly.js"></script>
```

## Versioning

The major version of this package follows the version in the Voucherly.js path.

| `@voucherly/voucherly-js` | Voucherly.js |
| --- | --- |
| `2.x` | `https://checkout.voucherly.it/embed/v1/voucherly.js` |

Voucherly.js receives backward-compatible updates on the same path, without any change to your integration. An incompatible change ships on a new path (`/embed/v2/`) together with a new major of this package, and the previous path keeps working.

## Documentation

- [Voucherly Components guide](https://docs.voucherly.it/en/guides/integrations/components/)
- [Voucherly.js reference](https://docs.voucherly.it/en/guides/integrations/components/reference/)

## Development

This repository is a read-only mirror of the `src/Web/voucherly-js/` folder of the Voucherly platform repository, pushed on every merge. Issues are welcome here; changes land through the platform repository and reach npm with a GitHub release of this mirror.

```sh
npm ci
npm run typecheck
npm run build
```

For any request, bug or comment, [open an issue](https://github.com/voucherly/voucherly-js/issues/new).
