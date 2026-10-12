---
title: "Async Rust Patterns: Building Concurrent Systems"
date: "2025-04-12"
tags: ["rust", "concurrency", "systems", "tokio"]
excerpt: "Deep dive into Tokio runtime, async cancellation safety, and thread communication via mpsc channels."
author: "Somesh Chatterjee"
---

# Async Rust Patterns: Building Concurrent Systems

Rust provides memory safety guarantees without a garbage collector. When combined with modern async runtimes like Tokio, it provides a resilient foundation for concurrent network services.

---

## 1. Futures in Rust are Lazy

Unlike JavaScript Promises which begin execution upon creation, Rust Futures do nothing until explicitly polled by an executor.

```rust
use tokio::time::{sleep, Duration};

async fn fetch_resource(id: u32) -> Result<String, String> {
    sleep(Duration::from_millis(50)).await;
    Ok(format!("Resource {}", id))
}
```

---

## 2. Cancellation Safety

Because futures can be dropped at any `.await` point, ensuring cancellation safety is paramount. When using `tokio::select!`, if one branch completes, all other pending branches are immediately dropped.

```rust
use tokio::sync::mpsc;

#[tokio::main]
async fn main() {
    let (tx, mut rx) = mpsc::channel(32);
    
    tokio::spawn(async move {
        tx.send("Task dispatched").await.unwrap();
    });
    
    while let Some(message) = rx.recv().await {
        println!("Received: {}", message);
    }
}
```

---

## Takeaways

- Rely on message passing (`mpsc`, `broadcast`) over shared mutable locks where possible.
- Design async routines with drop/cancellation boundaries in mind.
