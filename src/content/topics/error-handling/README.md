---
title: "Error Handling"
---

# Error Handling

## `try...catch...finally`

`try` runs code that might throw; `catch` handles the error if one occurs; `finally` always runs, whether an error happened or not — useful for cleanup.

```js
try {
  const data = JSON.parse("{ invalid json }");
  console.log(data);
} catch (error) {
  console.error("Failed to parse:", error.message);
} finally {
  console.log("Parsing attempt finished"); // always runs
}
// "Failed to parse: Expected property name or '}' in JSON at position 2..."
// (exact wording varies by JS engine/version — Chrome, Node, and Firefox all phrase it slightly differently)
// "Parsing attempt finished"
```

```js
// catch's error parameter is optional (ES2019+) if you don't need the error object
try {
  riskyOperation();
} catch {
  console.log("Something went wrong");
}
```

## Throwing your own errors

Any value can technically be thrown, but throwing an `Error` (or subclass) is standard practice — it captures a stack trace automatically.

```js
function divide(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}

try {
  divide(10, 0);
} catch (error) {
  console.log(error.message); // "Cannot divide by zero"
  console.log(error.name); // "Error"
  console.log(error.stack); // full stack trace, useful for debugging
}
```

## Custom error classes

Extending `Error` lets you create specific, identifiable error types — useful for distinguishing failure modes in a `catch` block.

```js
class ValidationError extends Error {
  constructor(message, field) {
    super(message); // sets this.message
    this.name = "ValidationError"; // overrides the default "Error"
    this.field = field;
  }
}

function validateAge(age) {
  if (age < 0) {
    throw new ValidationError("Age cannot be negative", "age");
  }
  return age;
}

try {
  validateAge(-5);
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(`Invalid field "${error.field}": ${error.message}`);
  } else {
    throw error; // re-throw anything we don't recognize
  }
}
// 'Invalid field "age": Age cannot be negative'
```

## Built-in error types

```js
new TypeError("wrong type"); // e.g. calling a non-function, reading a property of undefined
new RangeError("out of range"); // e.g. new Array(-1), exceeding call stack size
new ReferenceError("not defined"); // e.g. referencing an undeclared variable
new SyntaxError("bad syntax"); // e.g. JSON.parse on malformed JSON

null.toString(); // TypeError: Cannot read properties of null
new Array(-1); // RangeError: Invalid array length
```

## Errors and async code

A `try...catch` around an `await` catches rejected promises just like it catches synchronous throws — but it does **not** catch errors from unrelated, un-awaited promises.

```js
async function loadUser(id) {
  try {
    const res = await fetch(`/api/user/${id}`);
    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Failed to load user:", error.message);
    return null;
  }
}
```

```js
// Unhandled promise rejections need their own handling — try/catch around
// a synchronous call to an async function does NOT catch its internal errors
async function risky() {
  throw new Error("boom");
}

try {
  risky(); // missing `await`! the returned promise rejects asynchronously
} catch (error) {
  console.log("never runs"); // this catch never fires
}

risky().catch((error) => console.log("Caught:", error.message)); // this is the correct way
```

## Global fallback handlers

For errors that slip past every `try/catch` (a real safety net, not a substitute for handling errors properly).

```js
window.addEventListener("error", (event) => {
  console.error("Uncaught error:", event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
});
```
