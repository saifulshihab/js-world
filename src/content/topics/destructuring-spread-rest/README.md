---
title: "Destructuring, Spread & Rest"
---

# Destructuring, Spread & Rest

## Destructuring

Destructuring unpacks values from arrays or properties from objects into distinct variables using a matching syntax.

- ### Array destructuring

  Position determines which value is assigned — order matters.

  ```js
  const [first, second] = ["Ada", "Grace"];
  console.log(first, second); // "Ada" "Grace"

  const [, , third] = ["a", "b", "c"]; // skip elements with empty slots
  console.log(third); // "c"

  const [x = 10, y = 20] = [undefined, 5];
  console.log(x, y); // 10 5 — default only applies when the value is `undefined`

  let a = 1,
    b = 2;
  [a, b] = [b, a]; // swap without a temp variable
  console.log(a, b); // 2 1
  ```

- ### Object destructuring

  Property name determines which value is assigned — order doesn't matter.

  ```js
  const user = { name: "Ada", age: 36, country: "UK" };

  const { name, age } = user;
  console.log(name, age); // "Ada" 36

  const { name: userName } = user; // rename while destructuring
  console.log(userName); // "Ada"

  const { role = "guest" } = user; // default when property is missing
  console.log(role); // "guest"

  function printUser({ name, age }) {
    // destructure directly in a parameter
    console.log(`${name} is ${age}`);
  }
  printUser(user); // "Ada is 36"
  ```

- ### Nested destructuring

  ```js
  const response = {
    data: { id: 1, profile: { city: "London" } }
  };

  const {
    data: {
      id,
      profile: { city }
    }
  } = response;
  console.log(id, city); // 1 "London"
  ```

## Spread (`...`)

Spread **expands** an iterable (array, string) or an object's own enumerable properties into individual elements/properties.

```js
const nums = [1, 2, 3];
const moreNums = [...nums, 4, 5];
console.log(moreNums); // [1, 2, 3, 4, 5]

const combined = [...nums, ...[4, 5]];
console.log(combined); // [1, 2, 3, 4, 5]

function sum(a, b, c) {
  return a + b + c;
}
console.log(sum(...nums)); // 6, array elements spread as individual args
```

```js
const base = { name: "Ada", age: 36 };
const updated = { ...base, age: 37 }; // shallow copy + override
console.log(updated); // { name: "Ada", age: 37 }

const clone = [...nums]; // shallow copy of an array
```

## Rest (`...`)

Rest looks identical to spread but does the opposite — it **collects** multiple elements into a single array or object. It's always used on the receiving side (function parameters or destructuring targets), and must come last.

```js
function sum(...numbers) {
  // collects all args into an array
  return numbers.reduce((total, n) => total + n, 0);
}
console.log(sum(1, 2, 3, 4)); // 10
```

```js
const [firstItem, ...rest] = [1, 2, 3, 4];
console.log(firstItem, rest); // 1 [2, 3, 4]

const { id, ...otherFields } = { id: 1, name: "Ada", age: 36 };
console.log(id, otherFields); // 1 { name: "Ada", age: 36 }
```
