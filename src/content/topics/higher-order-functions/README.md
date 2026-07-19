---
title: "Higher-Order Functions"
---

# Higher-Order Functions

A higher-order function is a function that either **takes one or more functions as arguments**, **returns a function**, or both. They're the foundation of functional-style JavaScript, and power the most common array methods.

```js
function greetWith(formatter) {
  return function (name) {
    return formatter(name);
  };
}

const shout = greetWith((name) => `HEY ${name.toUpperCase()}!`);
console.log(shout("Ada")); // "HEY ADA!"
// greetWith is higher-order: it accepts a function and returns one
```

## `Array.prototype.map()`

Transforms every element and returns a **new array** of the same length.

```js
const prices = [10, 20, 30];
const withTax = prices.map((price) => price * 1.1);
console.log(withTax); // [11, 22, 33]
console.log(prices); // [10, 20, 30] — original is untouched
```

## `Array.prototype.filter()`

Returns a **new array** containing only the elements that pass a test.

```js
const numbers = [1, 2, 3, 4, 5, 6];
const evens = numbers.filter((n) => n % 2 === 0);
console.log(evens); // [2, 4, 6]
```

## `Array.prototype.reduce()`

Reduces an array to a single accumulated value, by calling a reducer on each element in turn.

```js
const cart = [{ price: 10 }, { price: 20 }, { price: 30 }];
const total = cart.reduce((sum, item) => sum + item.price, 0);
console.log(total); // 60

// reduce can build any shape of output, not just a number
const wordCounts = ["a", "b", "a", "c", "b", "a"].reduce((counts, word) => {
  counts[word] = (counts[word] || 0) + 1;
  return counts;
}, {});
console.log(wordCounts); // { a: 3, b: 2, c: 1 }
```

## Other common ones

```js
[1, 2, 3].forEach((n) => console.log(n)); // runs a side effect per element, returns undefined

[1, 2, 3].find((n) => n > 1); // 2, first element that matches
[1, 2, 3].findIndex((n) => n > 1); // 1, index of first match

[1, 2, 3].some((n) => n > 2); // true, at least one matches
[1, 2, 3].every((n) => n > 0); // true, all match

[1, 2, 3].sort((a, b) => b - a); // [3, 2, 1], custom comparator (mutates in place!)
```

## Chaining higher-order functions

Since `map`/`filter` return new arrays, they can be chained fluently.

```js
const orders = [
  { item: "Book", price: 15, paid: true },
  { item: "Pen", price: 2, paid: false },
  { item: "Laptop", price: 1200, paid: true }
];

const totalPaid = orders
  .filter((order) => order.paid)
  .map((order) => order.price)
  .reduce((sum, price) => sum + price, 0);

console.log(totalPaid); // 1215
```

## Functions returning functions

```js
function multiplyBy(factor) {
  return function (n) {
    return n * factor;
  };
}

const double = multiplyBy(2);
const triple = multiplyBy(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

See also [currying](/topics/currying), which builds directly on this idea.
