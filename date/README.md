# Date

`Date` represents a single moment in time, internally stored as milliseconds since the Unix epoch (January 1, 1970 UTC).

## Creating dates

```js
const now = new Date(); // current date & time
console.log(now instanceof Date); // true

const specific = new Date("2026-07-12"); // ISO 8601 string
console.log(specific.toISOString()); // "2026-07-12T00:00:00.000Z"

// year, month, day — month is ZERO-INDEXED (0 = January, 11 = December)
const july = new Date(2026, 6, 12);
console.log(july.getFullYear(), july.getMonth(), july.getDate()); // 2026 6 12

const january = new Date(2026, 0, 12);
console.log(january.getMonth()); // 0 — this is the classic "off by one month" gotcha

console.log(Date.now()); // milliseconds since epoch, e.g. 1783870087069 — a plain number, not a Date
```

## Reading parts of a date

```js
const date = new Date("2026-07-12T10:30:00");

console.log(date.getFullYear()); // 2026
console.log(date.getMonth()); // 6      — remember: 0-indexed, so 6 = July
console.log(date.getDate()); // 12     — day of the MONTH (1-31)
console.log(date.getHours()); // 10
console.log(date.getMinutes()); // 30
console.log(date.getDay()); // 0-6    — day of the WEEK (0 = Sunday), NOT the same as getDate()
```

> `getDate()` (day of month) and `getDay()` (day of week) are easy to confuse — the names don't make the distinction obvious.

## Date arithmetic

Subtracting two `Date` objects coerces them to their millisecond timestamps, giving you the difference directly.

```js
const start = new Date("2026-01-01");
const end = new Date("2026-07-12");

const diffMs = end - start; // 16588800000 — plain number of milliseconds
const diffDays = diffMs / (1000 * 60 * 60 * 24);
console.log(diffDays); // 192
```

```js
// There's no addDays()/addWeeks() built in — mutate via the setters instead
const future = new Date();
future.setDate(future.getDate() + 7); // "day 7 days from now" — setDate handles month/year rollover automatically
console.log(future > new Date()); // true
```

```js
// Rollover example: setDate() automatically carries into the next month
const endOfMonth = new Date(2026, 0, 31); // Jan 31, 2026
endOfMonth.setDate(endOfMonth.getDate() + 1);
console.log(endOfMonth.getMonth(), endOfMonth.getDate()); // 1 1 — rolled into February 1st
```

## Invalid dates

```js
const invalid = new Date("not a date");
console.log(invalid.toString()); // "Invalid Date"
console.log(isNaN(invalid)); // true    — global isNaN coerces Date to a number first
console.log(isNaN(invalid.getTime())); // true    — more explicit, same result
```

## Formatting

```js
const date = new Date(2026, 0, 1);

console.log(date.toISOString()); // "2026-01-01T00:00:00.000Z" — always UTC, machine-friendly
console.log(date.toLocaleDateString("en-US")); // "1/1/2026" — locale/format-aware, human-friendly

console.log(
  date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
); // "Thursday, January 1, 2026"
```

> For anything beyond simple formatting/arithmetic (timezones, recurring dates, relative time like "3 days ago"), reach for a library like `date-fns` or `Temporal` (the upcoming built-in successor to `Date`) rather than hand-rolling it — `Date`'s API has plenty of historical rough edges.
