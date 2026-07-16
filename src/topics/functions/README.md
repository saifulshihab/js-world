# Functions

## Function declaration

Hoisted entirely (see [hoisting](../hoisting)) — can be called before the line it's defined on.

```js
console.log(add(2, 3)); // 5, works even though called before the declaration below

function add(a, b) {
  return a + b;
}
```

## Function expression

Assigned to a variable; only the variable name is hoisted (not the function body), so calling it early fails.

```js
console.log(subtract(5, 2)); // ReferenceError: Cannot access 'subtract' before initialization

const subtract = function (a, b) {
  return a - b;
};
```

```js
// Named function expressions — the name is only visible INSIDE the function
// itself (useful for recursion), not in the outer scope
const factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1);
};

console.log(factorial(5)); // 120
console.log(typeof fact); // "undefined" — `fact` doesn't leak outside
```

## Arrow functions

Shorter syntax, and — critically — no own `this`, `arguments`, or `super`; they inherit these lexically from the enclosing scope (see [this-keyword](../this-keyword)).

```js
const multiply = (a, b) => a * b; // implicit return, no braces needed
console.log(multiply(3, 4)); // 12

const square = (n) => {
  // explicit return needed once braces are used
  return n * n;
};

const sayHi = () => console.log("hi"); // no params still needs parens
```

```js
// Arrow functions can't be used as constructors
const Person = (name) => {
  this.name = name;
};
new Person("Ada"); // TypeError: Person is not a constructor

// They also have no `arguments` object
const showArgs = () => console.log(arguments);
showArgs(1, 2, 3); // ReferenceError: arguments is not defined (in a module/strict context)
```

## Default parameters

```js
function greet(name = "Guest", greeting = "Hello") {
  return `${greeting}, ${name}!`;
}

console.log(greet()); // "Hello, Guest!"
console.log(greet("Ada")); // "Hello, Ada!"
console.log(greet("Ada", "Hi")); // "Hi, Ada!"
console.log(greet(undefined, "Hey")); // "Hey, Guest!" — undefined triggers the default, null does not
```

## Rest parameters

Collects any number of arguments into a real array (see [destructuring-spread-rest](../destructuring-spread-rest)).

```js
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
console.log(sum(1, 2, 3, 4)); // 10
```

## IIFE — Immediately Invoked Function Expression

A function that runs the instant it's defined, used to create an isolated scope without leaking variables into the surrounding code — a pre-ES6-modules pattern for avoiding global namespace pollution.

```js
(function () {
  const secret = "hidden from the outside world";
  console.log(secret);
})();

console.log(typeof secret); // "undefined" — secret never leaked out
```

```js
// Arrow function IIFE
(() => {
  console.log("runs immediately");
})();

// Useful for top-level await before it was natively allowed at module scope
(async () => {
  const data = await fetch("/api/data");
  console.log(data);
})();
```

## Quick comparison

```js
// Declaration: hoisted fully, has its own `this`, works as a constructor
function greet1() {}

// Expression: only the variable is hoisted, has its own `this`, works as a constructor
const greet2 = function () {};

// Arrow: not hoisted (as a function), no own `this`/`arguments`, NOT a constructor
const greet3 = () => {};
```

Use a **declaration** for top-level named functions, an **expression** when you need to conditionally define or pass a function around, and an **arrow function** for short callbacks — especially ones that need the surrounding `this` (e.g. inside a class method or another callback).
