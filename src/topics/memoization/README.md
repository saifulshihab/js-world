---
title: "Memoization"
---

# Memoization

Memoization is an optimization technique used to speed up computer programs by storing the results of expensive function calls and returning the cached result when the same inputs occur again. It essentially trades memory space for execution speed.

```js
function add(x) {
  return 10 + x;
}

function memo(func) {
  const cache = {};
  return function (x) {
    if (cache[x] !== undefined) {
      console.log("Return from cache for input:", x);
      return cache[x];
    }
    const result = func(x);
    cache[x] = result;
    console.log("Calculating result for input:", x);
    return result;
  };
}

const calculate = memo(add);
console.log(calculate(5)); // 15
console.log(calculate(5)); // 15
```

```js
function memo(func) {
  const cache = {};
  return function (...args) {
    const key = JSON.stringify(args);
    if (key in cache) {
      return cache[key];
    }
    const result = func.apply(this, args);
    cache[key] = result;
    return result;
  };
}
```
