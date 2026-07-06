# Object Oriented Programming

Object-Oriented Programming (OOP) is a software design model that organizes code around "objects" rather than logic. An object combines data (attributes) and behavior (methods) into a single unit. This approach improves code reusability, modularity, and scalability, making it ideal for large, complex, and actively updated applications.

```js
class Human {
  constructor(name) {
    this.name = name;
    this.arms = 2;
    this.legs = 2;
  }
}

class Baby extends Human {
  constructor(name) {
    super(name);
    this.cute = true;
  }

  cry() {
    return `I am crying...`;
  }
}

class Teenager extends Human {
  constructor(name) {
    super(name);
    this.emotinal = true;
  }

  emotional() {
    return `I have a crush...`;
  }
}

const zayaan = new Baby("zayaan");
const jabir = new Teenager("jabir");

console.log(zayaan);
console.log(jabir);
```
