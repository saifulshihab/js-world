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
