# Generators & Iterators

## Iterators

An iterator is any object that implements the **iterator protocol**: a `next()` method that returns `{ value, done }`. Objects that implement the **iterable protocol** (i.e. have a `Symbol.iterator` method returning an iterator) can be used with `for...of`, spread, and destructuring.

```js
function makeRangeIterator(start, end) {
  let current = start;
  return {
    next() {
      if (current < end) {
        return { value: current++, done: false };
      }
      return { value: undefined, done: true };
    },
  };
}

const it = makeRangeIterator(1, 4);
console.log(it.next()); // { value: 1, done: false }
console.log(it.next()); // { value: 2, done: false }
console.log(it.next()); // { value: 3, done: false }
console.log(it.next()); // { value: undefined, done: true }
```

Arrays, strings, Maps, and Sets are all built-in iterables — that's what powers `for...of`.

```js
for (const char of "abc") {
  console.log(char); // "a", "b", "c"
}
```

## Generators

A generator is a special function (`function*`) that can pause and resume its own execution. Calling a generator function doesn't run its body immediately — it returns a **generator object**, which is both an iterator and an iterable. Each call to `.next()` runs the function until the next `yield`.

```js
function* countUpTo(max) {
  let count = 1;
  while (count <= max) {
    yield count; // pauses here, returns { value: count, done: false }
    count++;
  }
}

const counter = countUpTo(3);
console.log(counter.next()); // { value: 1, done: false }
console.log(counter.next()); // { value: 2, done: false }
console.log(counter.next()); // { value: 3, done: false }
console.log(counter.next()); // { value: undefined, done: true }

// Being iterable, generators work directly with for...of
for (const n of countUpTo(3)) {
  console.log(n); // 1, 2, 3
}
```

## Passing values into a generator

`.next(value)` resumes the generator and becomes the result of the `yield` expression that was paused.

```js
function* conversation() {
  const name = yield "What's your name?";
  const age = yield `Hi ${name}, how old are you?`;
  return `${name} is ${age} years old.`;
}

const convo = conversation();
console.log(convo.next()); // { value: "What's your name?", done: false }
console.log(convo.next("Ada")); // { value: "Hi Ada, how old are you?", done: false }
console.log(convo.next(36)); // { value: "Ada is 36 years old.", done: true }
```

## `yield*` — delegating to another generator

```js
function* inner() {
  yield 1;
  yield 2;
}

function* outer() {
  yield 0;
  yield* inner(); // delegates iteration to `inner`
  yield 3;
}

console.log([...outer()]); // [0, 1, 2, 3]
```

## Why generators are useful

They make it easy to build custom iterables and lazy sequences — values are only computed when requested, which is handy for infinite sequences.

```js
function* naturalNumbers() {
  let n = 1;
  while (true) {
    yield n++;
  }
}

const numbers = naturalNumbers();
console.log(numbers.next().value); // 1
console.log(numbers.next().value); // 2
console.log(numbers.next().value); // 3
// The generator never runs forever in one go — it only computes
// the next value each time `.next()` is called.
```

## Async generators & `for await...of`

An `async function*` combines generators with promises — each `yield` can be awaited, and the caller consumes it with `for await...of`. Useful for streaming data (paginated API results, file reads, websocket messages) one chunk at a time instead of loading everything into memory first.

```js
async function* fetchPages(baseUrl) {
  let page = 1;
  while (true) {
    const res = await fetch(`${baseUrl}?page=${page}`); // see fetch-api
    const data = await res.json();
    if (data.items.length === 0) return; // no more pages, stop iterating
    yield data.items;
    page++;
  }
}

async function processAllPages() {
  for await (const items of fetchPages("/api/users")) {
    console.log("Got a page of", items.length, "items");
  }
}
```

```js
// A simpler async generator, no network involved
async function* delayedNumbers() {
  for (let i = 1; i <= 3; i++) {
    await new Promise((resolve) => setTimeout(resolve, 100)); // simulate async work
    yield i;
  }
}

async function run() {
  for await (const n of delayedNumbers()) {
    console.log(n); // 1, 2, 3 — each ~100ms apart
  }
}
run();
```

`for await...of` also works with regular (non-async) iterables containing promises — it awaits each value before handing it to the loop body.

```js
async function printAll(promises) {
  for await (const value of promises) {
    console.log(value);
  }
}

printAll([Promise.resolve(1), Promise.resolve(2), 3]); // 1, 2, 3 — non-promise values pass through as-is
```
