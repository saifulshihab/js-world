---
title: "The Event Loop"
---

# Event Loop

JavaScript is single-threaded — it has one [call stack](../execution-context) and can only do one thing at a time. The **event loop** is the mechanism that lets JavaScript handle asynchronous operations (timers, network requests, DOM events) without blocking that single thread.

## The pieces

1. **Call Stack**: Where synchronous code executes, frame by frame (LIFO).
2. **Web APIs / Node APIs**: Browser (or Node) provided facilities — `setTimeout`, `fetch`, DOM events — that run outside the call stack.
3. **Callback Queue (a.k.a. Macrotask Queue)**: Holds callbacks from things like `setTimeout`, `setInterval`, and DOM events, waiting to be run.
4. **Microtask Queue**: Holds callbacks from Promises (`.then`/`.catch`/`.finally`), `queueMicrotask`, and `async/await` continuations.
5. **Event Loop**: Continuously checks — "is the call stack empty?" If yes, it pulls the next task and pushes it onto the stack.

## The golden rule

After each task finishes and the call stack is empty, the event loop **drains the entire microtask queue first**, before running even a single macrotask. This means promise callbacks always run before the next `setTimeout`, even a `setTimeout(fn, 0)`.

```js
console.log("1: sync start");

setTimeout(() => console.log("2: macrotask (setTimeout)"), 0);

Promise.resolve().then(() => console.log("3: microtask (promise)"));

console.log("4: sync end");

// Output:
// 1: sync start
// 4: sync end
// 3: microtask (promise)
// 2: macrotask (setTimeout)
```

Why: `console.log` calls run synchronously on the call stack immediately. `setTimeout`'s callback is handed to the Web API, then queued as a macrotask once its timer expires. The promise's `.then` callback is queued as a microtask as soon as the promise resolves. Once the synchronous code (`1` and `4`) finishes and the stack is empty, the event loop drains all microtasks (`3`) before picking up the next macrotask (`2`).

## Chained microtasks still beat macrotasks

```js
setTimeout(() => console.log("macrotask"), 0);

Promise.resolve()
  .then(() => console.log("microtask 1"))
  .then(() => console.log("microtask 2"))
  .then(() => console.log("microtask 3"));

// Output:
// microtask 1
// microtask 2
// microtask 3
// macrotask
// Every chained .then() is its own microtask, and the queue is fully
// drained before the event loop moves on to the macrotask queue.
```

## `async`/`await` and the event loop

`await` pauses the `async` function and schedules the rest of it as a microtask once the awaited promise settles — it doesn't block the thread.

```js
async function main() {
  console.log("A");
  await null; // yields to the microtask queue
  console.log("B");
}

console.log("start");
main();
console.log("end");

// Output:
// start
// A
// end
// B
// "B" runs as a microtask after the synchronous code (`main()`'s call
// and "end") finishes, even though `await null` resolves instantly.
```

## Starving the event loop

Because the event loop can only act when the call stack is empty, a long-running synchronous task blocks *everything* — timers, clicks, renders — until it finishes.

```js
setTimeout(() => console.log("this is delayed"), 0);

// A blocking loop starves the event loop; the timeout above
// can't fire until this synchronous work finishes, no matter how
// short its delay was.
const start = Date.now();
while (Date.now() - start < 3000) {
  /* busy-wait for 3 seconds */
}

console.log("done blocking");
// "done blocking" logs first, then "this is delayed" — 3+ seconds late.
```

This is exactly the problem [Web Workers](../multi-threading) solve — moving heavy synchronous work off the main thread entirely.
