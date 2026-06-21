# Scope

- ### Global scope
  - Any variables defined in the root or global level can be accessed from any other inner scope, including functions.

  ```js
  var x = 10;
  console.log(x);
  ```

- ### Function Scope
  - Any variables declared inside a function can only be accessed within that specific function.
    - JS throws an Reference error while accessing a variables outside a function

- ### Block Scope
  - Variable declared using let/const are block scoped within the curly braces (like if statement, loop) are limited to that block.

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
