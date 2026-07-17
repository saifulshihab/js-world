---
title: "Hoisting"
---

# Hoisting

Declaring variable to the top.

```js
console.log(x);
var x = 20;
// undefined

// bts JS rewrote the code like this, this is hoisting, it only effects declaration,
var x;
console.log(x);
x = 20;
```

`let` and `const` are also hoisted, but they are kept in temporal zone.

```js
greet();

function greet() {
  console.log("Hello world");
}
// works, functions are also hoisted

greet();
const greet = () => {
  console.log("Hello world");
};
// not works, because function declared with `const`, which kept it in dead zone
```
