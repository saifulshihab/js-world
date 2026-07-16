# Strings

## Common string methods

```js
const text = "  Hello, World!  ";

console.log(text.trim()); // "Hello, World!" — removes leading/trailing whitespace
console.log(text.toUpperCase()); // "  HELLO, WORLD!  "
console.log(text.toLowerCase()); // "  hello, world!  "

console.log("Hello".includes("ell")); // true
console.log("Hello".startsWith("He")); // true
console.log("Hello".endsWith("lo")); // true

console.log("Hello".slice(1, 4)); // "ell" — same start/end semantics as Array.slice
console.log("Hello".slice(-3)); // "llo" — negative index counts from the end

console.log("5".padStart(3, "0")); // "005" — pad to a minimum length
console.log("5".padEnd(3, "0")); // "500"

console.log("a,b,,c".split(",")); // ["a", "b", "", "c"] — string to array
console.log(["a", "b", "c"].join("-")); // "a-b-c" — array to string

console.log("Hello".replace("l", "L")); // "HeLlo" — replaces only the FIRST match
console.log("Hello".replaceAll("l", "L")); // "HeLLo" — replaces every match

console.log("Hello".repeat(3)); // "HelloHelloHello"
console.log("Hello".charAt(1)); // "e"
console.log("Hello".at(-1)); // "o" — at() supports negative indices, charAt() doesn't
console.log("Hello".indexOf("l")); // 2
```

## Strings are immutable

Every method above returns a **new** string — the original is never modified.

```js
const original = "hello";
const upper = original.toUpperCase();
console.log(original); // "hello" — unchanged
console.log(upper); // "HELLO"
```

## Strings are iterable (and array-like)

```js
console.log("Hello".length); // 5
console.log("Hello"[0]); // "H" — bracket access works, but returns undefined for out-of-range, no error

for (const char of "abc") {
  console.log(char); // "a", "b", "c"
}

console.log([..."Hello"]); // ["H", "e", "l", "l", "o"] — spread converts to a real array
```

## Template literals

Backtick strings support embedded expressions and multi-line text without concatenation.

```js
const name = "Ada";
const age = 36;

console.log(`Hi, I'm ${name} and I'm ${age} years old.`);
// "Hi, I'm Ada and I'm 36 years old."

console.log(`2 + 2 = ${2 + 2}`); // "2 + 2 = 4" — any expression is allowed inside ${}

const multiLine = `Line one
Line two`;
console.log(multiLine);
// "Line one
// Line two"
```

```js
// Before template literals, this required manual concatenation
const greeting = "Hi, I'm " + name + " and I'm " + age + " years old.";
```

## Tagged templates

A function placed right before a template literal receives the string parts and interpolated values separately, letting you customize how they're combined — used by libraries like `styled-components` and safe-HTML utilities.

```js
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = values[i] !== undefined ? `**${values[i]}**` : "";
    return result + str + value;
  }, "");
}

const name = "Ada";
const role = "engineer";

console.log(highlight`${name} is a senior ${role}.`);
// "**Ada** is a senior **engineer**."
```

```js
// strings = ["", " is a senior ", "."]
// values  = ["Ada", "engineer"]
// The tag function decides exactly how to stitch them back together —
// e.g. escaping HTML, applying styles, or (as above) adding emphasis.
```
