# Modules (ESM vs CommonJS)

Modules let you split code into separate files with their own scope, and explicitly share (`export`) or consume (`import`/`require`) functionality between them, instead of relying on global variables.

## ES Modules (ESM) — the standard

The modern, standardized module system, used natively in browsers (`<script type="module">`) and in Node.js (`.mjs` files, or `"type": "module"` in `package.json`).

```js
// math.js
export function add(a, b) {
  return a + b;
}

export const PI = 3.14159;

export default function multiply(a, b) {
  return a * b;
}
```

```js
// main.js
import multiply, { add, PI } from "./math.js"; // default import + named imports

console.log(add(2, 3)); // 5
console.log(PI); // 3.14159
console.log(multiply(2, 3)); // 6

import * as math from "./math.js"; // import everything as a namespace object
console.log(math.add(1, 1)); // 2
```

Key characteristics:

- **Static**: imports/exports are resolved at parse time (before code runs), which enables tree-shaking (bundlers can strip unused exports).
- **Always strict mode**, automatically.
- Bindings are **live references** — if the exporting module updates the value, importers see the update.
- Runs asynchronously when loaded via `<script type="module">`, and `import()` (dynamic import) returns a Promise for lazy-loading:

```js
button.addEventListener("click", async () => {
  const { heavyFunction } = await import("./heavy-module.js"); // loaded on demand
  heavyFunction();
});
```

## CommonJS (CJS) — Node's original system

The module system Node.js used before ESM support landed; still the default in plain `.js` files without `"type": "module"`.

```js
// math.js
function add(a, b) {
  return a + b;
}

module.exports = { add, PI: 3.14159 };
```

```js
// main.js
const { add, PI } = require("./math.js");

console.log(add(2, 3)); // 5
console.log(PI); // 3.14159
```

Key characteristics:

- **Dynamic/synchronous**: `require()` is a normal function call, executed at runtime — you can call it conditionally, inside an `if`, etc.
- Exports are a **copy** of the value at the time of `require()` (for primitives) — no live-binding like ESM.
- No native browser support — needs a bundler (Webpack, esbuild, etc.) to run in the browser.

## Quick comparison

```js
// ESM: static, top-level only, live bindings, async-capable
import { add } from "./math.js";

// CommonJS: dynamic, works anywhere, synchronous, snapshot values
const { add } = require("./math.js");
```

Node.js today supports both, but a file's extension (or the `"type"` field in `package.json`) determines which system Node uses to parse it.
