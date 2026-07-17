---
title: "Map, Set, WeakMap & WeakSet"
---

# Map, Set, WeakMap & WeakSet

## Map

`Map` holds key-value pairs like a plain object, but keys can be **any type** (not just strings/symbols), insertion order is preserved, and size is tracked directly.

```js
const scores = new Map();
scores.set("Ada", 95);
scores.set("Grace", 88);

const objKey = { id: 1 };
scores.set(objKey, "value keyed by an object"); // objects work as keys, unlike plain objects

console.log(scores.get("Ada")); // 95
console.log(scores.has("Grace")); // true
console.log(scores.size); // 3

scores.delete("Grace");
console.log(scores.size); // 2

for (const [key, value] of scores) {
  console.log(key, value);
}
// Ada 95
// {id: 1} "value keyed by an object"
// (Grace was removed by the delete() above)

console.log([...scores.keys()]); // ["Ada", objKey]
console.log([...scores.values()]); // [95, "value keyed by an object"]
console.log([...scores.entries()]); // [["Ada", 95], [objKey, "value keyed by an object"]]

scores.forEach((value, key) => console.log(key, value));

scores.clear();
console.log(scores.size); // 0
```

```js
// Map vs Object — plain objects inherit properties/methods from Object.prototype,
// so a key like "toString" can silently overwrite a real method
const obj = {};
obj["toString"] = "gotcha"; // overwrites the inherited toString method
console.log(obj.toString()); // TypeError: obj.toString is not a function

const map = new Map();
map.set("toString", "no collision");
console.log(map.get("toString")); // "no collision"
console.log(typeof map.toString); // "function" — Map's own data never touches its prototype methods
```

```js
// Converting between Map, Object, and Array
const obj = { name: "Ada", age: 36 };

const mapFromObj = new Map(Object.entries(obj));
console.log(mapFromObj.get("name")); // "Ada"

const objFromMap = Object.fromEntries(mapFromObj);
console.log(objFromMap); // { name: "Ada", age: 36 }

const arrayFromMap = Array.from(mapFromObj); // same as [...mapFromObj]
console.log(arrayFromMap); // [["name", "Ada"], ["age", 36]]
```

```js
// Gotcha: object keys are compared by reference (identity), not shape
const map = new Map();
map.set({ id: 1 }, "first");
map.set({ id: 1 }, "second"); // a *different* object, even though it looks identical

console.log(map.size); // 2 — two distinct keys, not merged

// NaN is the one primitive that behaves specially: Map uses SameValueZero,
// so NaN is treated as equal to itself (unlike ===)
map.set(NaN, "not a number");
console.log(map.get(NaN)); // "not a number"
```

## Set

`Set` stores a collection of **unique** values of any type — duplicates are automatically ignored.

```js
const ids = new Set([1, 2, 2, 3, 3, 3]);
console.log(ids); // Set(3) {1, 2, 3}
console.log(ids.size); // 3

ids.add(4);
ids.has(2); // true
ids.delete(1);
console.log([...ids]); // [2, 3, 4] — spread converts back to an array

ids.forEach((value) => console.log(value)); // 2, 3, 4

ids.clear();
console.log(ids.size); // 0

// Common use: deduplicate an array
const unique = [...new Set([1, 1, 2, 2, 3])];
console.log(unique); // [1, 2, 3]
```

> New in modern JS engines: `Set` also has composition methods — `union()`, `intersection()`, `difference()`, `symmetricDifference()`, `isSubsetOf()`, `isSupersetOf()`, and `isDisjointFrom()` — for combining sets without manually looping.
>
> ```js
> const a = new Set([1, 2, 3]);
> const b = new Set([2, 3, 4]);
> console.log(a.union(b)); // Set(4) {1, 2, 3, 4}
> console.log(a.intersection(b)); // Set(2) {2, 3}
> console.log(a.difference(b)); // Set(1) {1}
> ```

## WeakMap & WeakSet

`WeakMap` and `WeakSet` are similar to `Map`/`Set`, but with key differences:

- Keys (for `WeakMap`) or values (for `WeakSet`) **must be objects**, not primitives.
- References are **weak** — if there's no other reference to the object, it can be garbage-collected, and its entry is removed automatically.
- Not iterable, and have no `.size` — because entries can disappear at any time, enumerating them wouldn't be reliable.

```js
let user = { name: "Ada" };

const metadata = new WeakMap();
metadata.set(user, { lastLogin: "2026-07-12" });

console.log(metadata.get(user)); // { lastLogin: "2026-07-12" }

user = null; // no other references to the object left
// The entry in `metadata` becomes eligible for garbage collection
// automatically — a regular Map would have kept it alive forever.
```

This makes `WeakMap` ideal for attaching private/extra data to objects (e.g. DOM nodes, class instances) without causing memory leaks.

`WeakSet` works the same way, but as a plain collection of objects rather than key-value pairs — commonly used to track "has this object already been processed?" without preventing garbage collection.

```js
const processedNodes = new WeakSet();

function processNode(node) {
  if (processedNodes.has(node)) {
    return; // already handled, skip
  }
  processedNodes.add(node);
  console.log("Processing:", node);
}

let el = document.createElement("div");
processNode(el); // "Processing: <div>"
processNode(el); // skipped, already in the set

el = null; // once no other references exist, the WeakSet entry is
// automatically eligible for garbage collection too.
```
