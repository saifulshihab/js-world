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

## The four pillars

- **Encapsulation** — bundling data and the methods that operate on it together, hiding internal details behind a public interface (see private fields below).
- **Abstraction** — exposing only what's necessary to use an object, hiding the complexity of how it works internally.
- **Inheritance** — a class can extend another, reusing its behavior and adding/overriding its own (`Baby extends Human` above).
- **Polymorphism** — different classes can be used through the same interface, each responding to the same method call in its own way.

```js
class Shape {
  area() {
    return 0;
  }
}

class Circle extends Shape {
  constructor(radius) {
    super();
    this.radius = radius;
  }
  area() {
    return Math.PI * this.radius ** 2; // overrides the base implementation
  }
}

class Square extends Shape {
  constructor(side) {
    super();
    this.side = side;
  }
  area() {
    return this.side ** 2; // a different implementation, same method name
  }
}

const shapes = [new Circle(2), new Square(3)];
shapes.forEach((shape) => console.log(shape.area().toFixed(2)));
// 12.57
// 9.00
// Same `.area()` call, different behavior per class — that's polymorphism.
```

## Private fields (`#`)

Prefixing a field with `#` makes it truly private — inaccessible from outside the class, not just "hidden by convention" like the module pattern's closures (see [design-patterns](../design-patterns)).

```js
class BankAccount {
  #balance; // private field, must be declared

  constructor(initialBalance) {
    this.#balance = initialBalance;
  }

  deposit(amount) {
    this.#balance += amount;
  }

  getBalance() {
    return this.#balance;
  }
}

const account = new BankAccount(100);
account.deposit(50);
console.log(account.getBalance()); // 150
console.log(account.#balance); // SyntaxError: Private field '#balance' must be declared in an enclosing class
```

## Static members

`static` properties/methods belong to the **class itself**, not to instances — used for utility methods, factories, or shared counters.

```js
class User {
  static #count = 0; // static + private

  constructor(name) {
    this.name = name;
    User.#count++;
  }

  static getCount() {
    return User.#count;
  }

  static fromJSON(json) {
    const data = JSON.parse(json);
    return new User(data.name); // a common "static factory" use case
  }
}

new User("Ada");
new User("Grace");
console.log(User.getCount()); // 2 — tracked on the class, not on any single instance

const fromJson = User.fromJSON('{"name":"Alan"}');
console.log(fromJson.name); // "Alan"
```

## Getters & setters in classes

```js
class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  get area() {
    return this.width * this.height; // accessed like a property: rect.area
  }

  set area(value) {
    const ratio = Math.sqrt(value / this.area);
    this.width *= ratio;
    this.height *= ratio;
  }
}

const rect = new Rectangle(10, 5);
console.log(rect.area); // 50, no parentheses — it's a getter, not a method call
rect.area = 200;
console.log(rect.width, rect.height); // 20 10
```
