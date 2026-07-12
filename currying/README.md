# Currying

Currying transforms a function that takes multiple arguments into a sequence of functions, each taking a single argument, where each call returns a new function until all arguments have been supplied.

```js
// Normal function
function add(a, b, c) {
  return a + b + c;
}
console.log(add(1, 2, 3)); // 6

// Curried version
function curriedAdd(a) {
  return function (b) {
    return function (c) {
      return a + b + c;
    };
  };
}
console.log(curriedAdd(1)(2)(3)); // 6
```

With arrow functions, this reads more compactly:

```js
const curriedAdd = (a) => (b) => (c) => a + b + c;

console.log(curriedAdd(1)(2)(3)); // 6
```

## Why it's useful — partial application

Currying lets you "pre-fill" some arguments and get back a specialized function, reusable with different remaining arguments.

```js
const multiply = (a) => (b) => a * b;

const double = multiply(2); // pre-fill `a` with 2
const triple = multiply(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

```js
// A practical example: building a reusable logger
const log = (level) => (message) => console.log(`[${level}] ${message}`);

const logError = log("ERROR");
const logInfo = log("INFO");

logError("Something broke"); // "[ERROR] Something broke"
logInfo("Server started"); // "[INFO] Server started"
```

## A generic `curry` helper

A general-purpose curry function that works for any arity, calling the original function once enough arguments have accumulated.

```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function (...nextArgs) {
      return curried.apply(this, [...args, ...nextArgs]);
    };
  };
}

function sum(a, b, c) {
  return a + b + c;
}

const curriedSum = curry(sum);

console.log(curriedSum(1)(2)(3)); // 6
console.log(curriedSum(1, 2)(3)); // 6, mixed grouping works too
console.log(curriedSum(1, 2, 3)); // 6, calling with all args at once also works
```

## Function composition

Composition combines several single-argument functions into one, where each function's output feeds into the next — a natural pairing with curried/partially-applied functions from above.

```js
const compose = (...fns) =>
  (initialValue) =>
    fns.reduceRight((acc, fn) => fn(acc), initialValue); // right to left

const pipe = (...fns) =>
  (initialValue) =>
    fns.reduce((acc, fn) => fn(acc), initialValue); // left to right

const double = (n) => n * 2;
const increment = (n) => n + 1;
const square = (n) => n * n;

const composed = compose(square, increment, double); // square(increment(double(x)))
console.log(composed(3)); // double(3)=6, increment(6)=7, square(7)=49

const piped = pipe(double, increment, square); // square(increment(double(x)))
console.log(piped(3)); // same order of operations, read left-to-right instead
```

```js
// A practical pipeline: each step takes one argument and returns one value,
// exactly what curried functions naturally produce
const clampToZero = (n) => Math.max(0, n);
const applyDiscount = (rate) => (price) => price * (1 - rate); // curried
const roundToCents = (n) => Math.round(n * 100) / 100;

const finalPrice = pipe(clampToZero, applyDiscount(0.2), roundToCents);

console.log(finalPrice(99.999)); // 79.99, discount and rounding applied in sequence
```

`compose` reads "mathematically" (rightmost function runs first, like `f(g(h(x)))`), while `pipe` reads like a left-to-right pipeline — most real-world code favors `pipe` for readability.
