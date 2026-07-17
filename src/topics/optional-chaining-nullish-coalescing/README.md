---
title: "Optional Chaining & Nullish Coalescing"
---

# Optional Chaining & Nullish Coalescing

Two operators introduced in ES2020 that make working with potentially-missing values far less verbose.

## Optional chaining (`?.`)

Safely accesses a nested property, only continuing if everything along the chain is not `null`/`undefined` — short-circuits to `undefined` instead of throwing.

```js
const user = { profile: { name: "Ada" } };

console.log(user.profile.name); // "Ada"
console.log(user.address.city); // TypeError: Cannot read properties of undefined

console.log(user.address?.city); // undefined — no error, short-circuits immediately
console.log(user.profile?.name); // "Ada" — still works normally when the value exists
```

```js
// Before optional chaining, this required manual guards at every level
const city = user && user.address && user.address.city;

// With optional chaining
const city2 = user?.address?.city;
```

- ### Optional method calls

  ```js
  const api = {
    fetchData() {
      return "data";
    }
  };

  console.log(api.fetchData?.()); // "data"
  console.log(api.deleteData?.()); // undefined — deleteData doesn't exist, but no TypeError
  ```

- ### Optional array/bracket access

  ```js
  const users = [{ name: "Ada" }];

  console.log(users[0]?.name); // "Ada"
  console.log(users[5]?.name); // undefined — no error even though index 5 doesn't exist
  ```

## Nullish coalescing (`??`)

Returns the right-hand value only when the left-hand value is `null` or `undefined` — unlike `||`, it does **not** treat other falsy values (`0`, `""`, `false`, `NaN`) as missing.

```js
const settings = { volume: 0, name: "" };

console.log(settings.volume || 50); // 50   — WRONG, 0 is falsy so || overrides it
console.log(settings.volume ?? 50); // 0    — RIGHT, 0 is a valid, intentional value

console.log(settings.name || "Guest"); // "Guest" — WRONG if empty string was intentional
console.log(settings.name ?? "Guest"); // ""      — RIGHT, "" wasn't nullish

console.log(settings.theme ?? "light"); // "light" — theme really is missing (undefined)
```

## Combining both

They're commonly used together to safely read a nested value and fall back to a default only when it's truly missing.

```js
function getVolume(config) {
  return config?.audio?.volume ?? 50; // safe traversal + meaningful default
}

console.log(getVolume({ audio: { volume: 0 } })); // 0  — respects the explicit 0
console.log(getVolume({ audio: {} })); // 50 — volume is undefined, falls back
console.log(getVolume(undefined)); // 50 — config itself is missing, falls back
```

## Nullish coalescing assignment (`??=`)

Assigns only if the current value is `null`/`undefined` — shorthand for `x ?? (x = y)`.

```js
const config = { retries: 0 };

config.retries ??= 3;
console.log(config.retries); // 0 — untouched, 0 isn't nullish

config.timeout ??= 5000;
console.log(config.timeout); // 5000 — was undefined, so it got assigned
```
