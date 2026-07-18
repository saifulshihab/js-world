---
title: "Immutability & Pure Functions"
---

# Immutability & Pure Functions

## Pure functions

A pure function always returns the same output for the same input, and causes **no side effects** — it doesn't modify anything outside its own scope (no mutating arguments, no touching global state, no I/O).

```js
// Pure — same input always gives the same output, nothing outside is touched
function add(a, b) {
  return a + b;
}
console.log(add(2, 3)); // 5, always

// Impure — depends on external state that can change between calls
let taxRate = 0.1;
function addTax(price) {
  return price + price * taxRate; // result depends on something outside its arguments
}
```

```js
// Impure — mutates its argument (a side effect visible outside the function)
function addItem(cart, item) {
  cart.push(item); // mutates the caller's array
  return cart;
}

// Pure — returns a new array, leaves the original untouched
function addItemPure(cart, item) {
  return [...cart, item];
}

const cart = ["apple"];
const newCart = addItemPure(cart, "banana");
console.log(cart); // ["apple"] — unchanged
console.log(newCart); // ["apple", "banana"]
```

## Why pure functions matter

- **Predictable**: no hidden dependencies to reason about — the function signature tells the whole story.
- **Testable**: no setup/mocking of external state needed, just call it with inputs and assert the output.
- **Safe to run anywhere**: no ordering dependencies, easy to memoize (see [memoization](/topics/memoization)), parallelize, or cache.

## Immutability

Treating data as unchangeable — instead of modifying a value in place, you create a new value with the change applied. JavaScript doesn't enforce this by default (see the mutating-vs-non-mutating array methods in [array-methods](/topics/array-methods)), so it's a discipline you opt into.

```js
// Mutating (avoid, especially for shared/passed-in data)
const user = { name: "Ada", age: 36 };
function haveBirthdayMutating(user) {
  user.age++; // mutates the original object
  return user;
}

// Immutable (preferred)
function haveBirthday(user) {
  return { ...user, age: user.age + 1 }; // returns a new object
}

const older = haveBirthday(user);
console.log(user.age, older.age); // 36 37 — original untouched
```

```js
// Same idea for arrays — spread/slice/map/filter instead of push/splice/sort in place
const numbers = [3, 1, 2];

const sorted = [...numbers].sort((a, b) => a - b); // copy first, then sort
console.log(numbers, sorted); // [3, 1, 2]  [1, 2, 3]
```

## Enforcing immutability with `Object.freeze`

```js
const config = Object.freeze({ apiUrl: "https://api.example.com" });
config.apiUrl = "https://evil.com"; // silently fails (throws in strict mode)
console.log(config.apiUrl); // unchanged

// Remember: freeze() is shallow — see object-methods for the nested-object gotcha
```

## Where this matters in practice

Frameworks like React and state libraries like Redux rely on immutability to detect changes efficiently — they compare object references (`oldState !== newState`) rather than deep-inspecting values, which only works correctly if updates always produce new objects instead of mutating existing ones.
