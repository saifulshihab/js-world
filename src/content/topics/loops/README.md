---
title: "Loops"
---

# Loops

JavaScript has several ways to repeat code. Picking the right one makes intent obvious — a `for...of` loop over an array says "iterate values," a `for...in` loop says "iterate keys," and so on.

- ### `for`

  The classic counted loop — best when you need an index, a custom step, or to iterate in reverse.

  ```js
  for (let i = 0; i < 3; i++) {
    console.log(i); // 0, 1, 2
  }

  // Reverse iteration
  const fruits = ["apple", "banana", "cherry"];
  for (let i = fruits.length - 1; i >= 0; i--) {
    console.log(fruits[i]); // "cherry", "banana", "apple"
  }
  ```

- ### `while`

  Runs as long as a condition is true — use it when the number of iterations isn't known ahead of time.

  ```js
  let attempts = 0;
  let success = false;

  while (!success && attempts < 3) {
    attempts++;
    success = attempts === 3; // pretend the 3rd attempt succeeds
    console.log(`Attempt ${attempts}: ${success ? "success" : "failed"}`);
  }
  ```

- ### `do...while`

  Same as `while`, but the condition is checked **after** the body runs — guarantees at least one execution.

  ```js
  let n = 10;
  do {
    console.log(n); // 10 — runs once even though the condition is false
    n++;
  } while (n < 5);
  ```

- ### `for...in`

  Iterates over an object's **enumerable property keys** (as strings) — including inherited ones from the prototype chain. Meant for plain objects, not arrays.

  ```js
  const user = { name: "Ada", age: 36 };
  for (const key in user) {
    console.log(key, user[key]); // "name" "Ada", "age" 36
  }
  ```

  ```js
  // Gotcha: for...in on an array iterates indices as strings, in
  // unspecified order, and picks up any enumerable inherited properties too
  const arr = ["a", "b", "c"];
  for (const index in arr) {
    console.log(typeof index, index); // "string" "0", "string" "1", "string" "2"
  }
  // Prefer for...of (or forEach/map) for arrays instead.
  ```

- ### `for...of`

  Iterates over the **values** of any iterable — arrays, strings, Maps, Sets, generators (see [generators-iterators](/topics/generators-iterators)). This is the go-to loop for arrays when you don't need the index.

  ```js
  const scores = [10, 20, 30];
  for (const score of scores) {
    console.log(score); // 10, 20, 30
  }

  for (const char of "hi") {
    console.log(char); // "h", "i"
  }

  // Need the index too? Destructure entries()
  for (const [index, score] of scores.entries()) {
    console.log(index, score); // 0 10, 1 20, 2 30
  }
  ```

- ### `break` and `continue`

  `break` exits the loop entirely; `continue` skips to the next iteration.

  ```js
  for (let i = 0; i < 5; i++) {
    if (i === 3) break;
    console.log(i); // 0, 1, 2
  }

  for (let i = 0; i < 5; i++) {
    if (i % 2 === 0) continue; // skip even numbers
    console.log(i); // 1, 3
  }
  ```

- ### Labeled loops

  Labels let `break`/`continue` target an **outer** loop from inside a nested one — useful for escaping nested loops in one step.

  ```js
  outer: for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (j === 1) continue outer; // skips to the next `i`, not just the next `j`
      console.log(i, j);
    }
  }
  // 0 0
  // 1 0
  // 2 0
  ```

## Loops vs array iteration methods

`forEach`/`map`/`filter`/etc. (see [higher-order-functions](/topics/higher-order-functions)) are usually preferred over manual loops for arrays because they're more declarative — but they aren't a drop-in replacement for every case.

```js
// forEach cannot be stopped early — break/continue don't work inside it
[1, 2, 3].forEach((n) => {
  if (n === 2) break; // SyntaxError: Illegal break statement
});

// A regular for/for...of loop CAN be stopped early
for (const n of [1, 2, 3]) {
  if (n === 2) break; // works fine
  console.log(n); // 1
}
```

```js
// await inside forEach's callback does NOT pause the outer function —
// the callback's promise is silently ignored
async function processAll(items) {
  items.forEach(async (item) => {
    await save(item); // fires all saves concurrently, unordered, unawaited
  });
  console.log("done"); // logs before any save() has actually finished
}

// for...of DOES pause correctly, awaiting each iteration in sequence
async function processAllSequentially(items) {
  for (const item of items) {
    await save(item); // waits for each save before moving to the next
  }
  console.log("done"); // logs only after every save() has finished
}
```

## Quick guide

- Need an index or custom step/direction → `for`
- Unknown number of iterations, condition-driven → `while` / `do...while`
- Iterating a plain object's keys → `for...in`
- Iterating an array's/iterable's values, with `break`/`continue`/`await` support → `for...of`
- Transforming/filtering/reducing an array declaratively, no early exit needed → `map`/`filter`/`reduce` (see [higher-order-functions](/topics/higher-order-functions))
