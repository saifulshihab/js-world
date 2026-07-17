---
title: "this Keyword"
---

# `this` Keyword

`this` refers to the object that is currently executing the function. Unlike most languages, `this` in JavaScript is **not** determined by where a function is defined — it's determined by **how the function is called**.

- ### Global context

  Outside of any function, `this` refers to the global object (`window` in browsers, `{}` module-scope object in Node's CommonJS modules).

  ```js
  console.log(this); // window (in a browser, non-strict mode script)
  ```

- ### Object method (implicit binding)

  When a function is called as a method on an object, `this` refers to the object it was called on.

  ```js
  const person = {
    name: "Ada",
    greet() {
      console.log(`Hi, I'm ${this.name}`);
    },
  };

  person.greet(); // "Hi, I'm Ada" — this === person
  ```

  ```js
  const greetFn = person.greet;
  greetFn(); // "Hi, I'm undefined" — this is lost once detached from `person`
  ```

- ### Plain function call

  When called as a standalone function (not as a method), `this` is `undefined` in strict mode, or the global object in non-strict (sloppy) mode.

  ```js
  "use strict";
  function whoAmI() {
    console.log(this);
  }
  whoAmI(); // undefined
  ```

- ### Arrow functions (lexical `this`)

  Arrow functions don't have their own `this` — they inherit it from the enclosing lexical scope at the time they're defined. This makes them useful for callbacks that need to keep the outer `this`.

  ```js
  const counter = {
    count: 0,
    incrementLater() {
      setTimeout(function () {
        this.count++; // `this` here is NOT counter (it's window/undefined)
        console.log(this.count); // NaN or error
      }, 100);
    },
  };

  const counter2 = {
    count: 0,
    incrementLater() {
      setTimeout(() => {
        this.count++; // arrow function inherits `this` from incrementLater
        console.log(this.count); // 1
      }, 100);
    },
  };
  ```

- ### Explicit binding — `call`, `apply`, `bind`

  These let you manually set what `this` refers to when invoking a function.

  ```js
  function introduce(greeting) {
    console.log(`${greeting}, I'm ${this.name}`);
  }

  const user = { name: "Grace" };

  introduce.call(user, "Hello"); // "Hello, I'm Grace" — args passed individually
  introduce.apply(user, ["Hi"]); // "Hi, I'm Grace"    — args passed as an array

  const boundIntroduce = introduce.bind(user);
  boundIntroduce("Hey"); // "Hey, I'm Grace" — returns a new function with `this` permanently bound
  ```

  `bind()` is especially useful for detaching a method while keeping its `this`, e.g. passing it as a callback.

  ```js
  class Button {
    constructor(label) {
      this.label = label;
      this.onClick = this.onClick.bind(this); // without this, `this` would be lost in the event handler
    }
    onClick() {
      console.log(`${this.label} clicked`);
    }
  }

  const btn = new Button("Submit");
  document.querySelector("#submit").addEventListener("click", btn.onClick);
  ```

- ### `new` binding

  When a function is called with `new`, `this` refers to the newly created object.

  ```js
  function Car(model) {
    this.model = model;
  }

  const car = new Car("Tesla");
  console.log(car.model); // "Tesla"
  ```

## Precedence

When multiple rules could apply, the order (highest to lowest priority) is: `new` binding > explicit binding (`call`/`apply`/`bind`) > implicit binding (object method) > default binding (plain call). Arrow functions ignore all of these — they always use the lexical `this` from where they were defined.
