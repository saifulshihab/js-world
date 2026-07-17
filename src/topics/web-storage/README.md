---
title: "Web Storage"
---

# Web Storage

Browser APIs for storing key-value data on the client, without needing a server round-trip. All stored values are strings — objects must be serialized (see [json](../json)) before storing.

## `localStorage`

Persists data with **no expiration** — it survives page reloads, browser restarts, even the computer restarting. Scoped per origin (protocol + domain + port).

```js
localStorage.setItem("theme", "dark");
console.log(localStorage.getItem("theme")); // "dark"

localStorage.removeItem("theme");
console.log(localStorage.getItem("theme")); // null — key no longer exists

localStorage.setItem("lastVisit", "count"); // overwritten by the next line
localStorage.clear(); // wipes everything for this origin
```

```js
// Storing objects requires JSON serialization
const user = { name: "Ada", theme: "dark" };
localStorage.setItem("user", JSON.stringify(user));

const stored = JSON.parse(localStorage.getItem("user"));
console.log(stored.name); // "Ada"

localStorage.getItem("nonexistent"); // null, NOT undefined — check for this explicitly
```

## `sessionStorage`

Same API as `localStorage`, but scoped to a single **tab's session** — cleared when that tab is closed. Not shared across tabs, even for the same site.

```js
sessionStorage.setItem("formDraft", "unsaved changes");
console.log(sessionStorage.getItem("formDraft")); // "unsaved changes"
// Closing this tab (or the browser) clears it; opening the same site in
// a NEW tab starts with an empty sessionStorage.
```

## `localStorage` vs `sessionStorage` vs Cookies

```js
// localStorage:   ~5-10MB, persists indefinitely, JS-only, never sent to the server
// sessionStorage: ~5-10MB, persists per-tab until closed, JS-only, never sent to the server
// cookies:        ~4KB,    configurable expiry, sent with EVERY matching HTTP request
```

Cookies are set/read differently — via `document.cookie` (a single string you parse manually) or, more commonly, by the server via the `Set-Cookie` response header.

```js
document.cookie = "theme=dark; max-age=3600; path=/"; // expires in 1 hour
console.log(document.cookie); // "theme=dark" (plus any other cookies, semicolon-separated)

// Deleting a cookie: set it with a past expiration
document.cookie = "theme=; max-age=0; path=/";
```

## Listening for changes across tabs

`localStorage` fires a `storage` event in **other** tabs/windows (not the one that made the change) — useful for syncing state across open tabs.

```js
window.addEventListener("storage", (event) => {
  console.log(
    `"${event.key}" changed from "${event.oldValue}" to "${event.newValue}"`
  );
});
// Only fires in OTHER tabs on the same origin when localStorage changes here —
// the tab that made the change does not receive its own event.
```

## When to use which

- **`localStorage`** — user preferences (theme, language), auth tokens for non-sensitive use cases, caching data between visits.
- **`sessionStorage`** — per-tab temporary state (multi-step form drafts, wizard progress).
- **Cookies** — anything the _server_ needs to read on each request (session IDs, CSRF tokens), or when you need fine-grained expiration/security flags (`HttpOnly`, `Secure`, `SameSite`).
