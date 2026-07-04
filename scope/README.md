# Scope

- ### Global scope

  Any variables defined in the root or global level can be accessed from any other inner scope, including functions.

  ```js
  var x = 10;
  console.log(x);
  // 10
  // x is accessible to anywhere since it is global scoped
  ```

  ```js
  var x = 200;
  console.log(window.x);
  // 200
  // x is added as a property to the window object, since declared with `var`
  ```

  ```js
  const x = 200;
  console.log(window.x);
  // undefined
  // since x is declared using `const`
  ```

- ### Function Scope

  Any variables declared inside a function can only be accessed within that specific function. - JS throws an Reference error while accessing a variables outside a function.

  ```js
  function doSome() {
    if (true) {
      var x = 1;
    } else {
      var x = 2;
    }
  }
  console.log(x);
  // ReferenceError: x is not defined
  // Since x is function scoped whether it is declared witt `var` or `let/const`
  ```

- ### Block Scope

  Variable declared using let/const are block scoped within the curly braces (like if statement, loop) are limited to that block.

  ```js
  function doSome() {
    if (true) {
      var x = 10;
      let a = 20;
    }
    console.log(x); // is accessible since declared with `var`
    console.log(a); // not accessible since declared with `let`
  }
  ```

  ```js
  if (true) {
    var x = 1;
  } else {
    var x = 2;
  }
  console.log(x);
  // 1, accessible since x declared using `var`
  ```

  ```js
  if (true) {
    const x = 1;
  } else {
    var x = 2;
  }
  console.log(x);
  // undefined, since x is declared using `const`
  ```
