---
title: "Multi Threading"
---

# Multi Threading

JavaScript itself is single-threaded — only one line of code runs at a time on the main thread. But long-running, CPU-heavy work (like a huge loop or heavy computation) run on the main thread will freeze the UI, since rendering, click handlers, and scrolling all share that same single thread. **Web Workers** solve this by giving you a genuinely separate background thread.

## Web Worker

Web Workers are a simple means for web content to run scripts in background threads. The worker thread can perform tasks without interfering with the user interface. Workers can make network requests using `fetch()` or `XMLHttpRequest`. Once created, a worker communicates with the script that created it by posting messages back and forth — they do **not** share memory, so data passed between them is copied (or transferred), not referenced.

`worker.js` — runs on the background thread:

```js
self.onmessage = function (e) {
  console.log("Worker started calculating");
  let count = 0;
  for (let i = 0; i <= 10000000000; i++) {
    count += i;
  }
  console.log("Worker finished calculating");
  self.postMessage(count);
};
```

`script.js` — runs on the main thread:

```js
const worker = new Worker("worker.js");

const calculate = document.getElementById("cal");

calculate.addEventListener("click", () => {
  worker.postMessage("hello worker"); // triggers the worker's onmessage
});

worker.onmessage = function (e) {
  console.log("Main thread received message from worker:", e.data);
};
```

Because the heavy loop runs inside `worker.js` on its own thread, clicking other buttons (like the background-color toggle in [index.html](../index.html)) keeps working instantly instead of freezing while the calculation runs.

## Key characteristics

- **No DOM access**: Workers can't touch `document`, `window`, or the DOM directly — they only communicate via `postMessage`.
- **No shared memory**: Data sent with `postMessage` is copied (structured clone algorithm), not shared by reference, unless you explicitly use a `Transferable` (like an `ArrayBuffer`) or `SharedArrayBuffer`.
- **Termination**: `worker.terminate()` (from the main thread) or `self.close()` (from inside the worker) stops it immediately.

```js
worker.terminate(); // main thread kills the worker
```

## Error handling

An uncaught error inside the worker doesn't crash the main thread — it fires an `error` event on the `Worker` object instead, which you should always listen for.

```js
const worker = new Worker("worker.js");

worker.onerror = function (event) {
  console.error(
    `Worker error: ${event.message} (${event.filename}:${event.lineno})`
  );
  event.preventDefault(); // stops it from also bubbling up as an unhandled error
};
```

## Transferable objects — avoiding the copy cost

By default, `postMessage` deep-copies its data (structured clone), which gets expensive for large payloads like big `ArrayBuffer`s. Passing an object as a **transferable** hands over ownership instead of copying — it moves to the receiving side at near-zero cost, but becomes unusable on the sending side afterward.

```js
const buffer = new ArrayBuffer(1024 * 1024 * 32); // 32MB

// Copied (slow for large data): the main thread still has its own copy afterward
worker.postMessage(buffer);

// Transferred (fast, zero-copy): ownership moves to the worker
worker.postMessage(buffer, [buffer]);
console.log(buffer.byteLength); // 0 — the main thread's buffer is now detached/unusable
```

## Dedicated Worker vs SharedWorker vs Service Worker

These are easy to conflate, but solve different problems:

```js
// Dedicated Worker (covered above): one-to-one with the page that created it,
// dies when that page/tab closes. Good for offloading a single heavy computation.
new Worker("worker.js");

// SharedWorker: can be connected to from multiple tabs/windows of the SAME
// origin simultaneously, communicating over a `port` instead of directly.
// Good for coordinating state across tabs (e.g. a shared cache or socket connection).
const shared = new SharedWorker("shared-worker.js");
shared.port.start();
shared.port.postMessage("hello");

// Service Worker: NOT primarily about multi-threading — it's a proxy that sits
// between the page and the network, enabling offline support, caching, and
// push notifications. Outlives the page (persists in the background) and can
// intercept fetch() requests, which regular/shared workers cannot do.
navigator.serviceWorker.register("service-worker.js");
```
