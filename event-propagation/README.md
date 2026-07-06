# Event Propagation

Event propagation dictates how events travel through the Document Object Model (DOM) tree when an interaction occurs

Event propagation has three phases

1. Event Bubbling
2. Event Capturing
3. Event Delegation

4. Capturing Phase (Trickling): The event moves downward from the top-level window object through ancestors to reach the target element.

5. Target Phase: The event arrives explicitly at the event.target, where listeners registered directly on that element execute.

6. Bubbling Phase: The event reverses direction, traveling upward from the target back to the window. This is the default behavior for almost all events in JavaScript.

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
