---
title: "Regular Expressions"
---

# Regular Expressions

A regular expression (regex) describes a pattern for matching text — used for validation, searching, and replacing.

## Creating a regex

```js
const regex1 = /hello/i; // literal syntax — `i` flag = case-insensitive
const regex2 = new RegExp("hello", "i"); // constructor syntax — useful when the pattern is dynamic

console.log(regex1.test("Hello World")); // true — .test() returns a boolean
```

## Common flags

```js
/abc/i; // i = case-insensitive
/abc/g; // g = global — find ALL matches, not just the first
/abc/m; // m = multiline — ^ and $ match the start/end of each line, not just the whole string
```

## Testing and matching

```js
const pattern = /\d+/; // one or more digits

console.log(pattern.test("Order #42")); // true
console.log("Order #42".match(pattern)); // ["42", index: 7, input: "Order #42", groups: undefined]

console.log("a1 b2 c3".match(/\d/g)); // ["1", "2", "3"] — `g` flag returns ALL matches as an array

// matchAll gives full match details (including groups) for every match
for (const match of "a1 b2 c3".matchAll(/[a-z](\d)/g)) {
  console.log(match[0], match[1]); // "a1" "1", "b2" "2", "c3" "3"
}
```

## Replacing

```js
console.log("2026-07-12".replace(/-/g, "/")); // "2026/07/12"

// Capture groups can be referenced in the replacement string with $1, $2, ...
console.log("John Smith".replace(/(\w+) (\w+)/, "$2 $1")); // "Smith John"
```

## Common building blocks

```js
/\d/; // any digit            [0-9]
/\w/; // any word character   [A-Za-z0-9_]
/\s/; // any whitespace
/./; // any character except newline

/^hello/; // must start with "hello"
/world$/; // must end with "world"
/^hello$/; // must be EXACTLY "hello"

/colou?r/; // "u" is optional — matches "color" and "colour"
/ab+c/; // one or more "b"s   — matches "abc", "abbc", not "ac"
/ab*c/; // zero or more "b"s  — matches "ac", "abc", "abbc"
/a{2,4}/; // "a" repeated 2 to 4 times

/cat|dog/; // matches "cat" OR "dog"
/[aeiou]/; // any one vowel
/[^0-9]/; // any character that's NOT a digit (^ inside [] negates)
```

## Practical examples

```js
// Email-ish validation (simplified — real validation is more nuanced)
const emailPattern = /^[\w.-]+@[\w.-]+\.\w+$/;
console.log(emailPattern.test("ada@example.com")); // true
console.log(emailPattern.test("not-an-email")); // false

// Extracting parts with named capture groups
const datePattern = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const match = "2026-07-12".match(datePattern);
console.log(match.groups); // { year: "2026", month: "07", day: "12" }

// Splitting on a pattern instead of a fixed string
console.log("a1b2c3".split(/\d/)); // ["a", "b", "c", ""]
```

## Gotcha: `g` flag and `.test()`/`.exec()` are stateful

```js
const pattern = /a/g;
console.log(pattern.test("banana")); // true  — matched the "a" at index 1, lastIndex now 2
console.log(pattern.test("banana")); // true  — matched the "a" at index 3, lastIndex now 4
console.log(pattern.test("banana")); // true  — matched the "a" at index 5, lastIndex now 6
console.log(pattern.test("banana")); // false — ran out of matches, lastIndex resets to 0
// Reusing a global regex across calls can produce surprising results;
// create a fresh regex (or reset .lastIndex = 0) if this matters.
```
