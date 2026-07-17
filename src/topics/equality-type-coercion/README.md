---
title: "Equality & Type Coercion"
---

# Equality & Type Coercion

Type coercion is JavaScript's automatic conversion of a value from one type to another (e.g. string to number) when an operation expects a different type. It happens implicitly in comparisons, arithmetic, and template literals.

- ### `==` vs `===`

  `===` (strict equality) compares both value and type — no conversion happens. `==` (loose equality) converts operands to the same type before comparing, which can produce surprising results.

  ```js
  1 === 1; // true
  1 === "1"; // false, different types

  1 == "1"; // true, "1" is coerced to 1
  0 == false; // true, false is coerced to 0
  null == undefined; // true, special case
  null === undefined; // false, different types
  ```

  ```js
  "" == 0; // true    ("" coerced to 0)
  "" == false; // true    (both coerced to 0)
  [] == false; // true    ([] → "" → 0)
  [] == ![]; // true    (![] is false, so this reduces to [] == false)
  NaN == NaN; // false   NaN is never equal to anything, including itself
  ```

  > Rule of thumb: always use `===`/`!==` unless you have a specific, well-understood reason to use `==` (like checking for `null` **or** `undefined` in one go with `value == null`).

- ### Implicit coercion in operators

  ```js
  "5" + 1; // "51"   + with a string triggers string concatenation
  "5" - 1; // 4      - forces numeric conversion (no string "-" operator exists)
  "5" * "2"; // 10      both coerced to numbers
  true + 1; // 2      true → 1
  "3" + true; // "3true" true → "true" since one operand is a string
  ```

- ### Truthy and falsy values

  Every value is truthy unless it's one of these falsy values:

  ```js
  Boolean(false); // false
  Boolean(0); // false
  Boolean(-0); // false
  Boolean(0n); // false (BigInt zero)
  Boolean(""); // false
  Boolean(null); // false
  Boolean(undefined); // false
  Boolean(NaN); // false

  // Everything else, including these, is truthy:
  Boolean([]); // true  (empty array is truthy!)
  Boolean({}); // true  (empty object is truthy!)
  Boolean("0"); // true  (non-empty string, even "0")
  ```

- ### Explicit conversion

  ```js
  Number("42"); // 42
  Number("42px"); // NaN, whole string must be numeric
  parseInt("42px"); // 42, parses until it hits a non-digit
  String(42); // "42"
  String(null); // "null"
  Boolean("false"); // true, any non-empty string is truthy, even the string "false"
  ```

- ### `Object.is()`

  Similar to `===` but treats `NaN` as equal to itself and distinguishes `+0`/`-0`. Mostly used internally (e.g. by React) rather than in everyday code.

  ```js
  Object.is(NaN, NaN); // true
  NaN === NaN; // false

  Object.is(0, -0); // false
  0 === -0; // true
  ```
