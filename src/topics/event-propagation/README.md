---
title: "Event Propagation"
---

# Event Propagation

Event propagation dictates how events travel through the Document Object Model (DOM) tree when an interaction occurs

Event propagation has three phases

1. **Capturing Phase (Trickling)**: The event moves downward from the top-level `window` object through ancestors to reach the target element.

2. **Target Phase**: The event arrives explicitly at `event.target`, where listeners registered directly on that element execute.

3. **Bubbling Phase**: The event reverses direction, traveling upward from the target back to the `window`. This is the default behavior for almost all events in JavaScript.

By default, `addEventListener` listens during the bubbling phase. Pass `true` (or `{ capture: true }`) as the third argument to listen during the capturing phase instead.

```js
document.getElementById("outer").addEventListener(
  "click",
  () => console.log("outer - capturing"),
  true // capture: true
);

document
  .getElementById("inner")
  .addEventListener("click", () => console.log("inner - bubbling"));

document
  .getElementById("outer")
  .addEventListener("click", () => console.log("outer - bubbling"));

// Clicking #inner logs:
// "outer - capturing"  (capturing phase, top-down)
// "inner - bubbling"   (target phase)
// "outer - bubbling"   (bubbling phase, bottom-up)
```

> **Event delegation** (see [event-delegation](../event-delegation)) is a _pattern_ built on top of the bubbling phase — it isn't a propagation phase itself.

## Controlling Event Flow

JavaScript gives you explicit control over event behaviors using standard event methods:

```js
event.stopPropagation();
```

This halts the event's movement up or down the DOM tree entirely. If called during bubbling, parent handlers will not see the event.Note: Any other event listeners attached to the same element will still fire.

```js
event.stopImmediatePropagation();
```

This achieves two things at once: it stops the event from moving up or down to parents, and it instantly blocks any remaining handlers attached to that same exact element from executing.

```js
event.preventDefault();
```

This does not stop event propagation. Instead, it tells the browser to skip its built-in default behavior for that action (e.g., stopping a link from navigating or a form from submitting).
