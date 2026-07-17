---
title: "Event Delegation"
---

# Event Delegation

Event delegation is a highly efficient design pattern in JavaScript where you attach a single event listener to a parent element to manage events for all of its current—and future—child elements. It works because of **event bubbling**: an event fired on a child element bubbles up through its ancestors, so a listener on the parent can catch it.

```html
<ul id="fruit-list">
  <li>Apple</li>
  <li>Banana</li>
  <li>Cherry</li>
</ul>
```

```js
// Without delegation: one listener per <li>, and new <li>s added later won't have a listener at all
document.querySelectorAll("#fruit-list li").forEach((li) => {
  li.addEventListener("click", () => console.log(li.textContent));
});

// With delegation: a single listener on the parent handles all children
document.getElementById("fruit-list").addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    console.log(event.target.textContent);
  }
});
```

## Why it's useful

1. **Performance**: One listener instead of hundreds/thousands — less memory, faster setup.
2. **Works with dynamically added elements**: New children added after the listener was attached are still handled, since the listener lives on the parent, not the child.

```js
const list = document.getElementById("fruit-list");

list.addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    console.log("Clicked:", event.target.textContent);
  }
});

// This new <li>, added after the listener was set up, still works
const newFruit = document.createElement("li");
newFruit.textContent = "Dragonfruit";
list.appendChild(newFruit);
```

## Targeting the right element

`event.target` is the actual element that was clicked, which may be a descendant of the element you meant to match (e.g. an `<img>` inside a `<button>`). Use `closest()` to find the intended element reliably.

```js
document.getElementById("toolbar").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return; // click didn't happen inside a button
  console.log("Button clicked:", button.dataset.action);
});
```
