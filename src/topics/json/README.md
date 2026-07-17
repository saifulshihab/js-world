---
title: "JSON"
---

# JSON

JSON (JavaScript Object Notation) is a text-based data format used to exchange data between a client and server (or between systems in general). Despite the name, it's language-agnostic — most languages have JSON libraries.

## `JSON.stringify` — object to JSON string

```js
const user = { name: "Ada", age: 36, active: true };

console.log(JSON.stringify(user)); // '{"name":"Ada","age":36,"active":true}'

console.log(JSON.stringify(user, null, 2));
// '{
//   "name": "Ada",
//   "age": 36,
//   "active": true
// }'
// The third argument adds indentation for readability
```

## `JSON.parse` — JSON string to object

```js
const json = '{"name":"Ada","age":36}';
const parsed = JSON.parse(json);

console.log(parsed.name); // "Ada"
console.log(typeof parsed); // "object"

JSON.parse("{ invalid }"); // SyntaxError: Expected property name or '}' in JSON at position 2...
// (exact wording is engine/version-dependent)
```

## What gets lost in translation

JSON only supports a subset of JS's types: strings, numbers, booleans, `null`, plain objects, and arrays. Everything else is dropped, converted, or throws.

```js
const data = {
  name: "Ada",
  greet: function () {}, // functions are silently omitted
  missing: undefined, // undefined properties are silently omitted
  created: new Date(), // Dates become ISO strings, not Date objects
  id: Symbol("id"), // symbol-keyed/valued properties are silently omitted
  big: 10n, // BigInt throws instead of being silently dropped
};

console.log(JSON.stringify(data));
// TypeError: Do not know how to serialize a BigInt
```

```js
// Without the BigInt, here's what actually survives:
const data2 = {
  name: "Ada",
  greet: function () {},
  missing: undefined,
  created: new Date("2026-01-01"),
};
console.log(JSON.stringify(data2));
// '{"name":"Ada","created":"2026-01-01T00:00:00.000Z"}'
// greet and missing are gone; created became a string
```

## Replacer & reviver — customizing (de)serialization

```js
// Replacer: filter or transform values while stringifying
const user = { name: "Ada", password: "secret123", age: 36 };

const safe = JSON.stringify(user, (key, value) => (key === "password" ? undefined : value));
console.log(safe); // '{"name":"Ada","age":36}' — password stripped out

// Replacer as an array: whitelist which keys to keep
console.log(JSON.stringify(user, ["name", "age"])); // '{"name":"Ada","age":36}'
```

```js
// Reviver: transform values while parsing
const json = '{"name":"Ada","created":"2026-01-01T00:00:00.000Z"}';

const revived = JSON.parse(json, (key, value) => {
  if (key === "created") return new Date(value); // turn the ISO string back into a real Date
  return value;
});

console.log(revived.created instanceof Date); // true
```

## Deep cloning with JSON (and its limits)

```js
const original = { name: "Ada", address: { city: "London" } };
const clone = JSON.parse(JSON.stringify(original)); // a common quick-and-dirty deep clone

clone.address.city = "Paris";
console.log(original.address.city); // "London" — fully independent copy

// But it silently drops functions, undefined, Symbols, and Dates become strings —
// prefer structuredClone() (see data-types) for a proper deep clone
```
