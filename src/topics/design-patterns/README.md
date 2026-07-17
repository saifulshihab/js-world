---
title: "Design Patterns"
---

# Design Patterns

Reusable, named solutions to common problems in code organization. Knowing them gives you a shared vocabulary for structure, not just working code.

## Module Pattern

Uses a closure (see [closure](../closure)) to bundle private state with a public API — the original way to simulate "private" variables before ES modules and class private fields existed.

```js
const counterModule = (function () {
  let count = 0; // private — inaccessible from outside

  return {
    increment() {
      count++;
      return count;
    },
    reset() {
      count = 0;
    },
    getCount() {
      return count;
    }
  };
})();

counterModule.increment();
counterModule.increment();
console.log(counterModule.getCount()); // 2
console.log(counterModule.count); // undefined — truly private
```

## Singleton Pattern

Ensures a class/object has exactly one instance, with a global point of access to it — useful for shared resources like a config store or a connection pool.

```js
class Database {
  static #instance;

  constructor() {
    if (Database.#instance) {
      return Database.#instance; // return the existing instance instead of creating a new one
    }
    this.connection = "connected";
    Database.#instance = this;
  }
}

const db1 = new Database();
const db2 = new Database();
console.log(db1 === db2); // true — same instance
```

## Observer Pattern

Lets objects (subscribers) register interest in another object's (the subject's) events, and get notified automatically when something happens — the foundation of event systems, and libraries like RxJS.

```js
class EventEmitter {
  #listeners = {};

  on(event, callback) {
    (this.#listeners[event] ??= []).push(callback);
  }

  emit(event, data) {
    this.#listeners[event]?.forEach((callback) => callback(data));
  }
}

const emitter = new EventEmitter();

emitter.on("userLoggedIn", (user) => console.log(`Welcome, ${user.name}!`));
emitter.on("userLoggedIn", (user) =>
  console.log(`Logging login for ${user.name}`)
);

emitter.emit("userLoggedIn", { name: "Ada" });
// "Welcome, Ada!"
// "Logging login for Ada"
```

## Factory Pattern

Centralizes object creation behind a function, hiding the decision of exactly which type/shape of object to build — useful when construction logic is complex or varies by input.

```js
function createUser(type, name) {
  switch (type) {
    case "admin":
      return { name, role: "admin", permissions: ["read", "write", "delete"] };
    case "editor":
      return { name, role: "editor", permissions: ["read", "write"] };
    default:
      return { name, role: "viewer", permissions: ["read"] };
  }
}

console.log(createUser("admin", "Ada"));
// { name: "Ada", role: "admin", permissions: ["read", "write", "delete"] }
console.log(createUser("viewer", "Grace"));
// { name: "Grace", role: "viewer", permissions: ["read"] }
```

## Where these show up in real code

- **Module pattern** → every ES module (see [modules](../modules)) is effectively this pattern, built into the language.
- **Singleton** → a shared Redux/Zustand store, a database connection pool, a logging service.
- **Observer** → DOM events (see [event-propagation](../event-propagation)), Node's `EventEmitter`, RxJS Observables, React's state subscriptions.
- **Factory** → `document.createElement`, ORM `.create()` methods, UI libraries that return different components based on a `type` prop.
