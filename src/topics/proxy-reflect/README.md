---
title: "Proxy & Reflect"
---

# Proxy & Reflect

## Proxy

A `Proxy` wraps an object and lets you intercept and customize fundamental operations on it — reading, writing, deleting properties, and more — via a set of **trap** functions.

```js
const target = { name: "Ada", age: 36 };

const handler = {
  get(obj, prop) {
    console.log(`Reading property: ${prop}`);
    return obj[prop];
  },
  set(obj, prop, value) {
    console.log(`Setting property: ${prop} = ${value}`);
    obj[prop] = value;
    return true; // must return true to indicate success
  },
};

const proxiedUser = new Proxy(target, handler);

proxiedUser.name; // "Reading property: name"
proxiedUser.age = 37; // "Setting property: age = 37"
console.log(target.age); // 37 — the underlying target is actually modified
```

## Common uses

- ### Validation

  ```js
  const validated = new Proxy(
    {},
    {
      set(obj, prop, value) {
        if (prop === "age" && (typeof value !== "number" || value < 0)) {
          throw new TypeError("age must be a non-negative number");
        }
        obj[prop] = value;
        return true;
      },
    }
  );

  validated.age = 25; // fine
  validated.age = -5; // TypeError: age must be a non-negative number
  ```

- ### Default values

  ```js
  const withDefaults = new Proxy(
    { theme: "dark" },
    {
      get(obj, prop) {
        return prop in obj ? obj[prop] : "N/A"; // fallback for missing keys
      },
    }
  );

  console.log(withDefaults.theme); // "dark"
  console.log(withDefaults.missing); // "N/A" — instead of undefined
  ```

- ### Read-only objects

  ```js
  const readOnly = new Proxy(
    { id: 1 },
    {
      set() {
        throw new Error("This object is read-only");
      },
    }
  );

  readOnly.id = 2; // Error: This object is read-only
  ```

## Reflect

`Reflect` is a built-in object with methods that mirror the same operations Proxy traps intercept (`get`, `set`, `deleteProperty`, `has`, etc.) — it provides the "default behavior" so a trap can delegate to it instead of reimplementing it manually.

```js
const target = { name: "Ada" };

const logger = new Proxy(target, {
  get(obj, prop, receiver) {
    console.log(`Accessed: ${String(prop)}`);
    return Reflect.get(obj, prop, receiver); // equivalent to obj[prop], but respects edge cases (like getters/proxied prototypes)
  },
});

console.log(logger.name); // "Accessed: name" then "Ada"
```

```js
// Reflect also offers cleaner alternatives to older reflection idioms
console.log(Reflect.has(target, "name")); // true, same as `"name" in target`
console.log(Reflect.ownKeys(target)); // ["name"], like Object.keys but includes symbols
Reflect.deleteProperty(target, "name"); // same as `delete target.name`, but returns true/false instead of throwing
```

## Why pair them together

Proxy traps often need to perform the *default* version of an operation after their custom logic runs — `Reflect`'s methods are designed to be the exact counterpart of each trap, making that delegation reliable (especially with inheritance and `this` binding via the `receiver` argument), instead of hand-rolling `obj[prop] = value` and hoping it behaves identically in every case.
