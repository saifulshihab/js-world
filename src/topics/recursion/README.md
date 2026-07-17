---
title: "Recursion"
---

# Recursion

A recursive function is one that calls itself to break a problem down into smaller instances of the same problem. Every recursive function needs two things: a **base case** (when to stop) and a **recursive case** (how to shrink the problem and call itself again). Without a base case, it recurses forever and blows the [call stack](../execution-context).

```js
function factorial(n) {
  if (n <= 1) return 1; // base case
  return n * factorial(n - 1); // recursive case: shrink the problem
}

console.log(factorial(5)); // 120
// factorial(5)
//   = 5 * factorial(4)
//   = 5 * (4 * factorial(3))
//   = 5 * (4 * (3 * factorial(2)))
//   = 5 * (4 * (3 * (2 * factorial(1))))
//   = 5 * (4 * (3 * (2 * 1)))
//   = 120
```

## Without a base case

```js
function infinite(n) {
  return infinite(n + 1); // no stopping condition
}

infinite(1); // RangeError: Maximum call stack size exceeded
```

## Recursion on data structures

Recursion is a natural fit for structures that contain smaller versions of themselves, like nested arrays/trees.

```js
function sumNested(arr) {
  return arr.reduce((total, item) => {
    return total + (Array.isArray(item) ? sumNested(item) : item); // recurse into nested arrays
  }, 0);
}

console.log(sumNested([1, [2, 3], [4, [5, 6]]])); // 21
```

```js
// Traversing a tree-shaped structure (e.g. DOM, file system, org chart)
const tree = {
  name: "CEO",
  reports: [
    { name: "VP Eng", reports: [{ name: "Engineer", reports: [] }] },
    { name: "VP Sales", reports: [] },
  ],
};

function countPeople(node) {
  return 1 + node.reports.reduce((total, report) => total + countPeople(report), 0);
}

console.log(countPeople(tree)); // 4
```

## Recursion vs iteration

Anything recursive can be rewritten as a loop, and vice versa — recursion tends to read more naturally for tree-like/divide-and-conquer problems, while loops are usually more efficient and easier to follow for simple linear repetition.

```js
// Recursive
function sumTo(n) {
  if (n === 0) return 0;
  return n + sumTo(n - 1);
}

// Iterative — same result, no call stack growth
function sumToIterative(n) {
  let total = 0;
  for (let i = 1; i <= n; i++) total += i;
  return total;
}

console.log(sumTo(5), sumToIterative(5)); // 15 15
```

## Tail-call style (a note on optimization)

Some languages optimize a recursive call that's the very last action in a function ("tail position") to avoid growing the stack. JavaScript's spec allows for tail-call optimization, but in practice, **no major engine implements it** — so even a tail-recursive function like this can still overflow on large inputs.

```js
function sumTailRecursive(n, accumulator = 0) {
  if (n === 0) return accumulator;
  return sumTailRecursive(n - 1, accumulator + n); // "tail position" call
}

console.log(sumTailRecursive(5)); // 15
// sumTailRecursive(100000) would still throw RangeError in most JS engines today
```
