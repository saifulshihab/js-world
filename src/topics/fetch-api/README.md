---
title: "Fetch API"
---

# Fetch API

`fetch()` is the modern, Promise-based (see [promises](../promises)) API for making HTTP requests, replacing the older `XMLHttpRequest`.

## Basic GET request

```js
fetch("/api/users/1")
  .then((response) => response.json()) // parses the response body as JSON (also returns a promise)
  .then((user) => console.log(user))
  .catch((error) => console.error("Network error:", error));
```

```js
// Same thing with async/await
async function getUser(id) {
  const response = await fetch(`/api/users/${id}`);
  const user = await response.json();
  return user;
}
```

## The critical gotcha: `fetch` doesn't reject on HTTP errors

`fetch()` only rejects on **network failures** (DNS errors, no connection, CORS blocks) — a 404 or 500 response is still a "successful" fetch as far as the promise is concerned. You must check `response.ok` yourself.

```js
async function getUser(id) {
  const response = await fetch(`/api/users/${id}`);

  if (!response.ok) {
    // response.ok is false for any status outside 200-299
    throw new Error(
      `Request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

// Without the .ok check, a 404 response would be silently "successful"
// and you'd try to .json() an error page, or get undefined data.
```

## Response body formats

```js
const response = await fetch("/api/data");

await response.json(); // parsed JSON object
await response.text(); // raw string
await response.blob(); // binary data (files, images)
await response.formData(); // multipart form data
// The body can only be read ONCE — calling two of these on the same response throws
```

## Sending data — POST/PUT/PATCH/DELETE

```js
const response = await fetch("/api/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ name: "Ada", age: 36 })
});

const created = await response.json();
console.log(created); // whatever the server returns, e.g. { id: 1, name: "Ada", age: 36 }
```

## Headers

```js
const response = await fetch("/api/data");
console.log(response.headers.get("content-type")); // "application/json; charset=utf-8"

fetch("/api/protected", {
  headers: {
    Authorization: "Bearer some-token"
  }
});
```

## Cancelling a request with `AbortController`

```js
const controller = new AbortController();

fetch("/api/slow-endpoint", { signal: controller.signal })
  .then((res) => res.json())
  .catch((err) => {
    if (err.name === "AbortError") {
      console.log("Request was cancelled");
    }
  });

setTimeout(() => controller.abort(), 3000); // cancel if it takes longer than 3s
```

## Running requests in parallel

```js
// See promises for a full breakdown of Promise.all/allSettled/race/any
const [users, posts] = await Promise.all([
  fetch("/api/users").then((r) => r.json()),
  fetch("/api/posts").then((r) => r.json())
]);
```
