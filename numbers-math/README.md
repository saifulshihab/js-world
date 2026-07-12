# Numbers & Math

## Floating-point precision

JavaScript stores all numbers as 64-bit floating point (IEEE 754) — there's no separate integer type. This means some decimal arithmetic doesn't come out exactly as expected, because certain fractions can't be represented perfectly in binary.

```js
console.log(0.1 + 0.2); // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3); // false

// Comparing floats safely: check they're within a tiny tolerance instead of using ===
console.log(Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON); // true
```

```js
// toFixed() rounds the DISPLAYED string, but the rounding itself can be
// surprising because the underlying number was never exactly 1.005 to begin with
console.log((1.005).toFixed(2)); // "1.00" — not "1.01" as you might expect!
console.log((3.14159).toFixed(2)); // "3.14"
console.log((1234.5678).toPrecision(6)); // "1234.57" — total significant digits, not decimal places
```

## Parsing & type checks

```js
console.log(Number("42")); // 42
console.log(Number("42px")); // NaN — the ENTIRE string must be numeric
console.log(parseFloat("42.5px")); // 42.5 — parses until it hits a non-numeric character
console.log(parseInt("42px")); // 42 — same idea, integer only

console.log(Number.isInteger(42)); // true
console.log(Number.isInteger(42.5)); // false

console.log(Number.isNaN(NaN)); // true
console.log(Number.isNaN("hello")); // false — Number.isNaN does NOT coerce
console.log(isNaN("hello")); // true  — global isNaN DOES coerce "hello" to NaN first

console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991
console.log(Number.isSafeInteger(Number.MAX_SAFE_INTEGER + 1)); // false — precision already lost
```

> Prefer `Number.isNaN`/`Number.isInteger` over the global `isNaN`/`isFinite` — the global versions coerce their argument first, which can hide bugs (see [equality-type-coercion](../equality-type-coercion)).

## Number bases & formatting

```js
console.log((255).toString(16)); // "ff" — convert to hexadecimal
console.log((8).toString(2)); // "1000" — convert to binary
console.log(parseInt("ff", 16)); // 255 — parse FROM a given base

console.log((1234.5).toLocaleString()); // "1,234.5" — locale-aware formatting
console.log((0.5).toLocaleString("en-US", { style: "percent" })); // "50%"
```

## The `Math` object

```js
console.log(Math.max(1, 5, 3), Math.min(1, 5, 3)); // 5 1
console.log(Math.max(...[1, 5, 3])); // 5 — spread an array into individual args

console.log(Math.round(4.5), Math.round(4.4)); // 5 4
console.log(Math.floor(4.9), Math.ceil(4.1)); // 4 5
console.log(Math.trunc(4.9), Math.trunc(-4.9)); // 4 -4 — chops the decimal, doesn't round toward -Infinity like floor

console.log(Math.pow(2, 10), 2 ** 10); // 1024 1024 — ** is the modern shorthand for Math.pow
console.log(Math.sqrt(16)); // 4
console.log(Math.abs(-5)); // 5

console.log(Math.random()); // a float in [0, 1)
```

```js
// Common pattern: random integer in an inclusive range
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

console.log(randomInt(1, 10)); // an integer from 1 to 10, inclusive
```
