# Asynchronous JavaScript

Asynchronous JavaScript is a programming technique that allows your code to start long-running tasks and continue executing other code concurrently without freezing the application. Because JavaScript is naturally single-threaded, it can only execute one line of code at a time. Asynchronous execution prevents time-consuming tasks (like fetching server data or reading files) from blocking the main thread, keeping the user interface entirely responsive.

Inside the browser there are two main components.

1. Runtime Environment (window, document, setTimeout etc)
2. Browser Engine (call stack)
