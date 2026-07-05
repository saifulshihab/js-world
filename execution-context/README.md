# Execution Context

A small and isolated environment where a specific piece of code is interpreted and converted into machine language.

JavaScript is an interpreted language. To understand this better, let's look at interpreters, compilers, and JIT (Just-In-Time) compilers:

1. Interpreter: An interpreter runs instructions directly from the programming language without changing them into machine code first.

   > `Easy debug, Slow Execution`

2. Compiler: A compiler changes the entire program into object code (or binary code) and saves it. This code can then be run by the machine.

   > Faster Execution, System Crashes

3. JIT Compiler: A JIT compiler converts code into byte code first. Then, at runtime, it changes the byte code into machine-readable code, which makes the program run faster.

> Interpretation + Compilation = JIT Compiler

> JavaScript is mainly interpreted, but modern JavaScript engines, like V8 in Google Chrome, use JIT (Just-In-Time) compilation to boost performance. They convert JavaScript code into optimized machine code right before it runs. This mix of interpretation and JIT compilation makes JavaScript fast and versatile for web applications.

There are two types of execution context

1. Global execution context:

   When this created, it contains four main components — window, this, variable object, scope chain. It has two phase loading/creation phase (variables & functions are only recognized but not yet executed)

2. Function execution context:
