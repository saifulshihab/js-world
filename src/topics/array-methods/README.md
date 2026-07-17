---
title: Array Methods
---

# Array Methods

Array methods split into two important camps: ones that **mutate** the original array in place, and ones that return a **new** array (or value) and leave the original untouched. Knowing which is which prevents accidental bugs from unexpected mutation.

> For `map`, `filter`, `reduce`, `forEach`, `find`, `some`, `every` — see [higher-order-functions](../higher-order-functions). This topic covers the rest.

## Adding & removing elements (mutating)

- ### `push` / `pop` — end of the array

  ```js
  const stack = [1, 2, 3];
  stack.push(4); // adds to the end, returns the new length
  console.log(stack); // [1, 2, 3, 4]

  const last = stack.pop(); // removes & returns the last element
  console.log(last, stack); // 4  [1, 2, 3]
  ```

- ### `unshift` / `shift` — start of the array

  ```js
  const queue = [2, 3];
  queue.unshift(1); // adds to the start, returns the new length
  console.log(queue); // [1, 2, 3]

  const first = queue.shift(); // removes & returns the first element
  console.log(first, queue); // 1  [2, 3]
  ```

  > `push`/`pop` operate at the end and are fast (O(1)). `unshift`/`shift` operate at the start and are slower (O(n)) — every remaining element has to be re-indexed.

- ### `splice` — insert, remove, or replace anywhere

  The general-purpose mutator: `splice(start, deleteCount, ...itemsToInsert)`.

  ```js
  const letters = ["a", "b", "c", "d", "e"];

  const removed = letters.splice(1, 2); // remove 2 elements starting at index 1
  console.log(removed, letters); // ["b", "c"]  ["a", "d", "e"]

  letters.splice(1, 0, "x", "y"); // insert without removing (deleteCount = 0)
  console.log(letters); // ["a", "x", "y", "d", "e"]

  letters.splice(0, 1, "z"); // replace: remove 1, insert 1
  console.log(letters); // ["z", "x", "y", "d", "e"]
  ```

## Extracting & combining (non-mutating)

- ### `slice` — extract a shallow copy

  `slice(start, end)` (end exclusive) returns a **new** array — the original is untouched. Easy to confuse with `splice`, but `slice` never mutates.

  ```js
  const nums = [10, 20, 30, 40, 50];
  console.log(nums.slice(1, 3)); // [20, 30] — new array
  console.log(nums.slice(-2)); // [40, 50] — negative index counts from the end
  console.log(nums); // [10, 20, 30, 40, 50] — original unchanged

  const copy = nums.slice(); // no args = shallow copy of the whole array
  ```

- ### `concat` and spread — combine arrays

  ```js
  const a = [1, 2];
  const b = [3, 4];

  console.log(a.concat(b)); // [1, 2, 3, 4] — new array
  console.log([...a, ...b]); // [1, 2, 3, 4] — spread does the same, more common in modern code
  console.log(a); // [1, 2] — original unchanged either way
  ```

- ### `join` — array to string

  ```js
  const words = ["Hello", "World"];
  console.log(words.join(" ")); // "Hello World"
  console.log(words.join("-")); // "Hello-World"
  console.log([1, 2, 3].join()); // "1,2,3" — default separator is a comma
  ```

## Searching

- ### `includes` vs `indexOf` vs `find`

  ```js
  const nums = [1, 2, NaN, 4];

  console.log(nums.indexOf(2)); // 1 — position of first match, or -1 if not found
  console.log(nums.indexOf(NaN)); // -1 — indexOf uses ===, and NaN !== NaN

  console.log(nums.includes(2)); // true — just want a yes/no answer
  console.log(nums.includes(NaN)); // true — includes uses SameValueZero, so it DOES find NaN

  // find() is for objects/complex matches, not just primitives (see higher-order-functions)
  const users = [{ id: 1 }, { id: 2 }];
  console.log(users.find((u) => u.id === 2)); // { id: 2 }
  ```

  > Use `includes` for a boolean check, `indexOf` when you need the position, and `find`/`findIndex` when matching by a condition rather than an exact value.

## Reshaping

- ### `flat` / `flatMap`

  ```js
  const nested = [1, [2, 3], [4, [5, 6]]];
  console.log(nested.flat()); // [1, 2, 3, 4, [5, 6]] — flattens 1 level deep by default
  console.log(nested.flat(2)); // [1, 2, 3, 4, 5, 6] — depth argument controls how deep
  console.log(nested.flat(Infinity)); // fully flattens, regardless of depth

  // flatMap = map() immediately followed by flat(1) — useful when each
  // element maps to zero or more results
  const sentences = ["hello world", "foo bar"];
  console.log(sentences.flatMap((s) => s.split(" ")));
  // ["hello", "world", "foo", "bar"]
  ```

- ### `reverse` and `sort` (both mutate!)

  ```js
  const nums = [3, 1, 2];
  nums.sort(); // mutates in place, default sort is lexicographic (string-based!)
  console.log(nums); // [1, 2, 3] — looks right here, but watch out below

  console.log([10, 2, 1].sort()); // [1, 10, 2] — "10" sorts before "2" as strings!
  console.log([10, 2, 1].sort((a, b) => a - b)); // [1, 2, 10] — always pass a comparator for numbers

  const letters = ["a", "b", "c"];
  letters.reverse(); // also mutates in place
  console.log(letters); // ["c", "b", "a"]

  // To sort/reverse WITHOUT mutating the original, copy first
  const originalNums = [3, 1, 2];
  const sortedCopy = [...originalNums].sort((a, b) => a - b);
  console.log(originalNums, sortedCopy); // [3, 1, 2]  [1, 2, 3]
  ```

## Creating & checking arrays

```js
Array.isArray([1, 2, 3]); // true
Array.isArray("not an array"); // false

Array.from({ length: 3 }, (_, i) => i * 2); // [0, 2, 4] — build from a length + mapper
Array.from("abc"); // ["a", "b", "c"] — any iterable works too

Array.of(7); // [7]        — unlike `new Array(7)`, which creates a hole-filled array of length 7
new Array(7); // [ <7 empty items> ]

Array(3).fill(0); // [0, 0, 0] — fill every slot with a value
```

## Mutating vs non-mutating cheat sheet

```js
// Mutating (changes the original array):
// push, pop, shift, unshift, splice, sort, reverse, fill, copyWithin

// Non-mutating (returns a new array/value, original untouched):
// slice, concat, map, filter, reduce, flat, flatMap, join,
// includes, indexOf, find, findIndex, some, every
```
