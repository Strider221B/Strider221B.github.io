---
title: "Building a Neural Network from Scratch"
date: "2024-03-15"
tags: ["python", "deep-learning", "neural-networks"]
excerpt: "A walkthrough of implementing backpropagation, matrix operations, and activation gradients purely in NumPy."
author: "Somesh Chatterjee"
---

# Building a Neural Network from Scratch

Implementing a multi-layer perceptron without high-level frameworks like PyTorch or TensorFlow is one of the most effective exercises for solidifying your understanding of gradient descent and the chain rule.

---

## 1. Network Architecture

We consider a simple 2-layer neural network for binary classification:
- Input layer: $X \in \mathbb{R}^{N \times d}$
- Hidden layer: $Z_1 = X W_1 + b_1$, followed by ReLU activation: $A_1 = \max(0, Z_1)$
- Output layer: $Z_2 = A_1 W_2 + b_2$, followed by Sigmoid activation: $\hat{Y} = \sigma(Z_2)$

---

## 2. Forward Propagation in NumPy

```python
import numpy as np

def relu(z):
    return np.maximum(0, z)

def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-z))

def forward(X, W1, b1, W2, b2):
    Z1 = np.dot(X, W1) + b1
    A1 = relu(Z1)
    Z2 = np.dot(A1, W2) + b2
    A2 = sigmoid(Z2)
    return Z1, A1, Z2, A2
```

---

## 3. Backpropagation and Gradients

Using the chain rule, we compute the partial derivatives of the binary cross-entropy loss:

```python
def backward(X, Y, Z1, A1, A2, W2):
    m = X.shape[0]
    
    # Loss derivative w.r.t Z2
    dZ2 = A2 - Y
    dW2 = (1 / m) * np.dot(A1.T, dZ2)
    db2 = (1 / m) * np.sum(dZ2, axis=0, keepdims=True)
    
    # Hidden layer gradients
    dA1 = np.dot(dZ2, W2.T)
    dZ1 = dA1 * (Z1 > 0)  # Derivative of ReLU
    dW1 = (1 / m) * np.dot(X.T, dZ1)
    db1 = (1 / m) * np.sum(dZ1, axis=0, keepdims=True)
    
    return dW1, db1, dW2, db2
```

---

## Conclusion

Understanding these fundamental computations demystifies automated differentiation systems and enables debugging complex model convergence issues at scale.
