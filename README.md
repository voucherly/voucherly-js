# voucherly-js

## Installation
Manually add the Voucherly-js script tag to the `<head>` of each page on your site.

```html
<!-- Somewhere in your site's <head> -->
<script src="https://unpkg.com/@@voucherly/voucherly-js"></script>
```

## Configuration
The package needs to be configured with your merchant public key, which is available in the Voucherly Dashboard.

```js
const voucherly = Voucherly("pk_sand_xxxxx...");
```

Now you are ready to integrate drop-in or API only payments. Follow the Voucherly documentation for a step by step guide.