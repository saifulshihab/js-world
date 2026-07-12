# Debounce & Throttle

Both are techniques for controlling how often a function runs in response to events that can fire rapidly (scrolling, resizing, typing, mouse movement) — but they solve it differently.

## Debounce

Debounce delays running the function until a pause of silence (no new calls) has passed. Every new call **resets the timer**. Useful when you only care about the final state after activity stops — e.g. search-as-you-type, resize-end handling.

```js
function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId); // cancel the previous pending call
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

const searchInput = document.getElementById("search");

const handleSearch = debounce((event) => {
  console.log("Searching for:", event.target.value);
}, 300);

searchInput.addEventListener("input", handleSearch);
// Typing "hello" fires 5 "input" events, but handleSearch only
// actually runs once — 300ms after the last keystroke.
```

## Throttle

Throttle guarantees the function runs at most once per fixed interval, no matter how many times it's triggered — it doesn't wait for silence, it evenly spaces out executions. Useful for things that should fire regularly during continuous activity — e.g. scroll position tracking, mouse-move handlers.

```js
function throttle(fn, interval) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= interval) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

const handleScroll = throttle(() => {
  console.log("Scroll position:", window.scrollY);
}, 200);

window.addEventListener("scroll", handleScroll);
// Even if "scroll" fires 50 times a second, handleScroll runs
// at most once every 200ms.
```

## Debounce vs Throttle at a glance

```js
// Debounce: waits for a pause, runs ONCE after activity stops
// calls:    | x  x x   x     x |
// runs:                        |------delay------| -> fn()

// Throttle: runs at a steady, capped rate DURING activity
// calls:    | x  x x   x     x |
// runs:     | fn()  fn()  fn() |  (one every `interval`)
```

- Use **debounce** when you want to react only to the *final* event in a burst (search input, form validation, auto-save).
- Use **throttle** when you want to react *periodically* throughout continuous activity (scroll, drag, window resize, mouse move).
