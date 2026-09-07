// The root package.json declares "type": "module", so Node would read dist/cjs/*.js as ESM without this override.
import { writeFileSync } from "node:fs";

writeFileSync("dist/cjs/package.json", JSON.stringify({ type: "commonjs" }, null, 2) + "\n");
