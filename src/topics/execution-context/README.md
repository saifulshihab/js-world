# Execution Context

A small and isolated environment where a specific piece of code is interpreted and converted into machine language.

JavaScript is an interpreted language. To understand this better, let's look at interpreters, compilers, and JIT (Just-In-Time) compilers:

1. Interpreter: An interpreter runs instructions directly from the programming language without changing them into machine code first.

   > `Easy debug, Slow Execution`

2. Compiler: A compiler changes the entire program into object code (or binary code) and saves it. This code can then be run by the machine.

   > Faster Execution, System Crashes

3. JIT Compiler: A JIT compiler converts code into byte code first. Then, at runtime, it changes the byte code into machine-readable code, which makes the program run faster.

> Interpretation + Compilation = JIT Compiler

> JavaScript is mainly interpreted, but modern JavaScript engines, like V8 in Google Chrome, use JIT (Just-In-Time) compilation to boost performance. They convert JavaScript code into optimized machine code right before it runs. This mix of interpretation and JIT compilation makes JavaScript fast and versatile for web applications.

There are two types of execution context

1. Global execution context:

   Created once, when the JS engine first starts running the script. It contains four main components — `window`, `this`, variable object, scope chain. Only one global execution context can exist per program.

2. Function execution context:

   Created every time a function is called (a new one is created per invocation, even for recursive calls to the same function). It has its own arguments object, local variables, and scope chain that points back to the environment in which the function was defined.

## Creation and Execution Phase

Every execution context (global or function) goes through two phases:

1. **Creation phase (a.k.a memory creation phase):**

   - The `this` keyword is determined.
   - A **Lexical Environment** is created (memory space for variables and functions).
   - `var` variables are hoisted and initialized with `undefined`.
   - `let`/`const` variables are hoisted but left uninitialized (Temporal Dead Zone).
   - Function declarations are hoisted with their entire definition, so they can be called before their line of code runs.

2. **Execution phase:**

   - Code runs line by line, top to bottom.
   - Variables are assigned their actual values.
   - Function calls push a brand new execution context onto the call stack.

```js
console.log(a); // undefined (hoisted, not yet assigned)
console.log(greet()); // works, function is hoisted with its full body

var a = 10;

function greet() {
  return "hi";
}
```

## The Call Stack

The call stack is where JavaScript keeps track of execution contexts — it's a LIFO (Last In, First Out) structure. The global execution context sits at the bottom, and each function call pushes a new function execution context on top. When a function returns, its context is popped off the stack.

```js
function multiply(a, b) {
  return a * b;
}

function square(n) {
  return multiply(n, n);
}

function printSquare(n) {
  console.log(square(n));
}

printSquare(5);

// Call stack grows like this:
// printSquare(5)
//   square(5)
//     multiply(5, 5)
// Each function pops off the stack once it returns a value,
// unwinding back down to the global execution context.
```

If the stack grows without bound (e.g. a recursive function with no base case), JavaScript throws a `RangeError: Maximum call stack size exceeded`.

```js
function recurse() {
  return recurse();
}

recurse();
// RangeError: Maximum call stack size exceeded
```
