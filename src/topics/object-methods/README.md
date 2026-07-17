---
title: "Object Methods"
---

# Object Methods

## Reading keys, values, and entries

```js
const user = { name: "Ada", age: 36 };

console.log(Object.keys(user)); // ["name", "age"]
console.log(Object.values(user)); // ["Ada", 36]
console.log(Object.entries(user)); // [["name", "Ada"], ["age", 36]]

// entries() pairs perfectly with for...of and destructuring
for (const [key, value] of Object.entries(user)) {
  console.log(key, value); // "name" "Ada", "age" 36
}
```

## Copying & merging — `Object.assign` and spread

```js
const defaults = { theme: "light", fontSize: 14 };
const overrides = { fontSize: 16 };

const merged = Object.assign({}, defaults, overrides); // later sources overwrite earlier ones
console.log(merged); // { theme: "light", fontSize: 16 }

const merged2 = { ...defaults, ...overrides }; // spread does the same, more common in modern code
console.log(merged2); // { theme: "light", fontSize: 16 }

// Object.assign MUTATES its first argument — pass {} to avoid mutating defaults itself
Object.assign(defaults, overrides);
console.log(defaults); // { theme: "light", fontSize: 16 } — defaults was mutated!
```

## Freezing & sealing

```js
const config = { apiUrl: "https://api.example.com" };

Object.freeze(config); // no adding, removing, or changing properties
config.apiUrl = "https://evil.com"; // silently fails (throws in strict mode)
config.newProp = "nope"; // also silently fails
console.log(config.apiUrl); // "https://api.example.com" — unchanged
console.log(Object.isFrozen(config)); // true

const settings = { volume: 50 };
Object.seal(settings); // no adding/removing properties, but EXISTING ones can still be changed
settings.volume = 80; // works
settings.newProp = "nope"; // silently fails
console.log(settings); // { volume: 80 }
```

> `Object.freeze` is shallow — nested objects inside a frozen object are still mutable unless you freeze them too.

```js
const frozen = Object.freeze({ nested: { count: 0 } });
frozen.nested.count = 100; // works! freeze() didn't reach the nested object
console.log(frozen.nested.count); // 100
```

## Property descriptors

Every property has hidden metadata controlling how it behaves — `writable`, `enumerable`, `configurable` — accessible via `Object.getOwnPropertyDescriptor` and settable via `Object.defineProperty`.

```js
const obj = { visible: "shows up" };
console.log(Object.getOwnPropertyDescriptor(obj, "visible"));
// { value: "shows up", writable: true, enumerable: true, configurable: true }

Object.defineProperty(obj, "hidden", {
  value: "secret",
  enumerable: false, // won't show up in for...in, Object.keys, or JSON.stringify
  writable: false, // can't be reassigned
});

console.log(Object.keys(obj)); // ["visible"] — "hidden" is skipped
console.log(obj.hidden); // "secret" — still directly accessible
obj.hidden = "changed"; // silently fails, writable: false
console.log(obj.hidden); // "secret"
```

## Getters & setters

Define computed properties that read/write like normal properties but run custom logic behind the scenes.

```js
const rectangle = {
  width: 10,
  height: 5,
  get area() {
    return this.width * this.height; // computed on access, no method call needed
  },
  set area(value) {
    // treat area as a way to resize while keeping the aspect ratio;
    // area scales with the SQUARE of the linear ratio, so take the sqrt
    const ratio = Math.sqrt(value / this.area);
    this.width *= ratio;
    this.height *= ratio;
  },
};

console.log(rectangle.area); // 50 — read like a property, not rectangle.area()
rectangle.area = 200;
console.log(rectangle.width, rectangle.height); // 20 10
```

## Creating objects with a specific prototype

```js
const animalMethods = {
  speak() {
    return `${this.name} makes a sound`;
  },
};

const dog = Object.create(animalMethods); // dog's prototype is animalMethods
dog.name = "Rex";
console.log(dog.speak()); // "Rex makes a sound"
console.log(Object.getPrototypeOf(dog) === animalMethods); // true
```

See [prototype](../prototype) for more on how the prototype chain works.
