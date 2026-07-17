---
title: "Promises"
---

# Promises

A `Promise` is an object representing the eventual completion (or failure) of an asynchronous operation. It exists in one of three states: **pending** (initial), **fulfilled** (succeeded), or **rejected** (failed) — and once settled (fulfilled/rejected), its state never changes again.

```js
const promise = new Promise((resolve, reject) => {
  const success = true;
  setTimeout(() => {
    if (success) {
      resolve("Data loaded");
    } else {
      reject(new Error("Failed to load"));
    }
  }, 1000);
});

promise
  .then((result) => console.log(result)) // runs if resolved
  .catch((error) => console.error(error)) // runs if rejected
  .finally(() => console.log("Done")); // always runs, regardless of outcome
```

## Chaining

Each `.then()` returns a **new** promise, which lets you chain async steps sequentially instead of nesting callbacks ("callback hell").

```js
fetch("/api/user/1")
  .then((res) => res.json())
  .then((user) => fetch(`/api/posts?user=${user.id}`))
  .then((res) => res.json())
  .then((posts) => console.log(posts))
  .catch((err) => console.error("Something in the chain failed:", err));
// a single .catch() at the end handles errors from any step above it
```

## `async`/`await`

Syntactic sugar over promises — lets asynchronous code read like synchronous code. An `async` function always returns a promise, and `await` pauses execution until that promise settles.

```js
async function loadUserPosts(id) {
  try {
    const userRes = await fetch(`/api/user/${id}`);
    const user = await userRes.json();

    const postsRes = await fetch(`/api/posts?user=${user.id}`);
    const posts = await postsRes.json();

    return posts;
  } catch (err) {
    console.error("Something in the chain failed:", err);
  }
}
```

## Combinators

- ### `Promise.all()`

  Runs promises in parallel; resolves when **all** succeed, or rejects as soon as **any one** fails (fail-fast).

  ```js
  Promise.all([fetch("/a"), fetch("/b"), fetch("/c")])
    .then((results) => console.log("All succeeded:", results))
    .catch((err) => console.error("At least one failed:", err));
  ```

- ### `Promise.allSettled()`

  Runs promises in parallel; always resolves once **all** have settled, giving you the outcome of each — never short-circuits on failure.

  ```js
  Promise.allSettled([
    Promise.resolve(1),
    Promise.reject("error"),
    Promise.resolve(3)
  ]).then((results) => console.log(results));
  // [
  //   { status: "fulfilled", value: 1 },
  //   { status: "rejected", reason: "error" },
  //   { status: "fulfilled", value: 3 }
  // ]
  ```

- ### `Promise.race()`

  Settles as soon as the **first** promise settles (whether fulfilled or rejected) — useful for timeouts.

  ```js
  function withTimeout(promise, ms) {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timed out")), ms)
    );
    return Promise.race([promise, timeout]);
  }

  withTimeout(fetch("/slow-endpoint"), 3000).catch((err) =>
    console.error(err.message)
  );
  ```

- ### `Promise.any()`

  Resolves as soon as the **first** promise fulfills; only rejects if **all** of them reject (with an `AggregateError`).

  ```js
  Promise.any([
    Promise.reject("fail 1"),
    Promise.resolve("fail 2, but this one wins"),
    Promise.reject("fail 3")
  ]).then(
    (result) => console.log(result) // "fail 2, but this one wins"
  );
  ```

## Common pitfall — sequential vs parallel

```js
// Sequential (slower) — each await blocks the next one from starting
async function sequential() {
  const a = await fetch("/a"); // waits, then...
  const b = await fetch("/b"); // waits, then...
  return [a, b];
}

// Parallel (faster) — both requests fire immediately, then we wait together
async function parallel() {
  const [a, b] = await Promise.all([fetch("/a"), fetch("/b")]);
  return [a, b];
}
```
