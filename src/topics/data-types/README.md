# Data Types

JavaScript has 8 data types: 7 **primitives** and 1 non-primitive (**Object**, which arrays, functions, and everything else compound is built on). Knowing which category a value belongs to explains a lot of JS's quirkier behavior.

## Primitives

`string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`. Primitives are **immutable** and compared/copied **by value**.

```js
typeof "hello"; // "string"
typeof 42; // "number"
typeof true; // "boolean"
typeof undefined; // "undefined"
typeof Symbol("id"); // "symbol"
typeof 42n; // "bigint"
typeof null; // "object" — a long-standing bug in JS, kept for backwards compatibility
```

- ### `null` vs `undefined`

  ```js
  let a; // declared, never assigned
  console.log(a); // undefined — JS's own "no value yet"

  let b = null; // explicitly assigned
  console.log(b); // null — intentional "no value", set by the developer

  console.log(null == undefined); // true  (loose equality treats them as equal)
  console.log(null === undefined); // false (different types)
  ```

- ### `Symbol` — guaranteed-unique values

  Useful as object keys that will never collide, even with an identical description.

  ```js
  const id1 = Symbol("id");
  const id2 = Symbol("id");
  console.log(id1 === id2); // false — every Symbol() call creates a unique value

  const user = { name: "Ada", [id1]: "hidden metadata" };
  console.log(Object.keys(user)); // ["name"] — symbol keys are skipped by normal enumeration
  ```

- ### `BigInt` — integers beyond `Number.MAX_SAFE_INTEGER`

  ```js
  console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991
  console.log(Number.MAX_SAFE_INTEGER + 1 === Number.MAX_SAFE_INTEGER + 2); // true — precision lost!

  const big = 9007199254740993n; // the `n` suffix makes it a BigInt
  console.log(big); // 9007199254740993n

  console.log(typeof 10n); // "bigint"
  console.log(10n + 20n); // 30n — can't mix BigInt and Number directly
  console.log(10n + 20); // TypeError: Cannot mix BigInt and other types
  ```

## Reference type — Object

Arrays, functions, dates, and plain objects are all `object` under the hood. Objects are **mutable** and compared/copied **by reference**, not by value.

```js
typeof {}; // "object"
typeof []; // "object" — arrays are objects too
typeof function () {}; // "function" — a special callable object
typeof new Date(); // "object"
```

## Value vs reference — the core distinction

```js
// Primitives: copying creates an independent value
let x = 10;
let y = x;
y = 20;
console.log(x, y); // 10 20 — changing y didn't affect x

// Objects: copying copies the REFERENCE, not the data
const obj1 = { count: 10 };
const obj2 = obj1;
obj2.count = 20;
console.log(obj1.count, obj2.count); // 20 20 — both point to the same object in memory
```

```js
// This is also why equality behaves differently
console.log(10 === 10); // true — same value
console.log({} === {}); // false — two different objects, even though they look identical
console.log([1, 2] === [1, 2]); // false — same reason

const shared = { a: 1 };
console.log(shared === shared); // true — same reference
```

## Shallow vs deep copy

```js
const original = { name: "Ada", address: { city: "London" } };

// Shallow copy: top-level properties are copied, nested objects are still shared
const shallow = { ...original };
shallow.address.city = "Paris";
console.log(original.address.city); // "Paris" — the nested object was never actually copied!

// Deep copy: every nested level gets its own independent copy
const deep = structuredClone(original);
deep.address.city = "Tokyo";
console.log(original.address.city); // "Paris" — unaffected, fully independent copy
```

## Type coercion & equality

See [equality-type-coercion](../equality-type-coercion) for how JS converts between these types in comparisons and operators.
