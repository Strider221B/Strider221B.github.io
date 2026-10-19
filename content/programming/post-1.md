---
title: "The Hidden Danger of the `new` Keyword"
date: "2019-05-11"
tags: ["CleanCode", "DependencyInjection"]
excerpt: "Think the new keyword is harmless? Here is how a single line of object instantiation silently breaks your unit tests and violates the Open-Closed Principle."
author: "Somesh Chatterjee"
---

# The Hidden Danger of the `new` Keyword 🚨

How do we create an object in most programming languages? We reach for the **`new`** keyword. 

Some languages skip the explicit keyword—like Python, where you instantiate a class using `ClassName()` instead of `new ClassName()`—but make no mistake: **the underlying architectural problem remains exactly the same.**

The `new` keyword introduces a silent killer into your codebase: **Tight Coupling.**

---

### 🔍 A Simple Example

Look at this standard C# implementation:

```csharp
interface IShape
{
    string Name { get; }
}

class Square : IShape
{
    public string Name { get; private set; } = "Square";
}

class Circle : IShape
{
    public string Name { get; private set; } = "Circle";
}

class ShapeHolder
{
    public IShape Shape { get; private set; }

    public ShapeHolder()
    {
        // ⚠️ The trap is sprung right here!
        Shape = new Square(); 
    }
}
```

### ❌ The Core Problem

Even though we designed a beautiful `IShape` interface, `ShapeHolder` is now **hardcoded** to the `Square` class. It can never hold a `Circle`. 

While this might seem harmless in a small example, it triggers two massive architectural headaches in real-world applications:

1. **Untestable Code (Unit Testing Nightmare):** You cannot test `ShapeHolder` independently of `Square`. If a future update forces `Square` to make a database call or a network request, your `ShapeHolder` unit tests will suddenly fail or drag to a crawl because the testing environment lacks that external infrastructure.
2. **Zero Extensibility (Violating the Open-Closed Principle):** This setup completely kills runtime polymorphism. If you introduce a `Triangle` tomorrow, you are forced to rip open and modify the `ShapeHolder` class just to support it. This creates a brittle domino effect across your codebase.

---

### 💡 The Solution: Dependency Inversion

Instead of letting `ShapeHolder` control its own destiny by creating the `Square`, we should **invert the control** and pass the dependency in. This can be done easily via constructor injection or a Factory pattern.

```csharp
class ShapeHolder
{
    public IShape Shape { get; private set; }

    // ✅ Dependency is injected from the outside
    public ShapeHolder(IShape shape) 
    {
        Shape = shape;
    }
}
```

### 🚀 Why This Changes Everything

* **Dynamic Runtime:** Your production app can now cleanly pass a `Square`, a `Circle`, or any future shape into `ShapeHolder` without changing a single line of its code.
* **Flawless Testing:** In your test suite, you can instantly pass a lightweight `MockShape` or `FakeShape`, keeping your unit tests lightning-fast and 100% isolated.

**Stop letting `new` dictate your architecture. Inject your dependencies!**
