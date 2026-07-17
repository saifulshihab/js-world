---
title: "Prototype"
---

# Prototype

Prototype is a property of any function in JavaScript that points to an object.

```js
function Person(name, age) {
  let person = Object.create(Person.prototype);

  person.name = name;
  person.age = age;

  return person;
}

Person.prototype = {
  eat(name) {
    console.log(`${name} is eating`);
  },
  sleep(name) {
    console.log(`${name} is sleeping`);
  },
};

const person = Person("John", 38);
person.eat("John");
```

using the `new` keyword javascript creates the object using the `this` keyword, thus we don't need to explicitly write `Object.create()`

```js
function Pet(name) {
  this.name = name;
}

Pet.prototype = {
  call() {
    console.log("Pet is calling");
  },
};

const cat = new Pet();
cat.call();
```
