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

## 1. Network Architecture & Mathematical Formulation

We consider a simple 2-layer neural network for binary classification. The input features are represented as a matrix $\mathbf{X} \in \mathbb{R}^{m \times d}$, with parameter weight matrices defined as:

$$
\mathbf{W}^{[1]} = \begin{pmatrix} 
w_{11} & w_{12} & \cdots & w_{1d} \\ 
w_{21} & w_{22} & \cdots & w_{2d} \\ 
\vdots & \vdots & \ddots & \vdots \\ 
w_{h1} & w_{h2} & \cdots & w_{hd} 
\end{pmatrix} \in \mathbb{R}^{h \times d}
$$

The layer transformations and activation functions are formulated as:
- **Hidden layer pre-activation**: $\mathbf{Z}^{[1]} = \mathbf{X} \mathbf{W}^{[1]T} + \mathbf{b}^{[1]}$
- **Piecewise ReLU activation**:
$$
\text{ReLU}(z) = \begin{cases} 
z & \text{if } z > 0 \\ 
0 & \text{if } z \le 0 
\end{cases}, \quad 
\frac{d}{dz}\text{ReLU}(z) = \begin{cases} 
1 & \text{if } z > 0 \\ 
0 & \text{if } z \le 0 
\end{cases}
$$
- **Output layer and hypothesis**: $\mathbf{Z}^{[2]} = \mathbf{A}^{[1]} \mathbf{W}^{[2]T} + \mathbf{b}^{[2]}$, followed by $\hat{\mathbf{y}} = \sigma(\mathbf{Z}^{[2]})$

### Objective Function & Expected Risk
In statistical learning theory, empirical risk minimization estimates the expected risk $\mathcal{R}_{\text{exp}} = \int_{-\infty}^{\infty} \int_{-\infty}^{\infty} L(f(x), y) \, p(x, y) \, dx \, dy$ via the regularized binary cross-entropy loss:

$$
\mathcal{L}(\mathbf{W}, \mathbf{b}) = -\frac{1}{m} \sum_{i=1}^m \left[ y^{(i)} \log(\hat{y}^{(i)}) + (1 - y^{(i)}) \log(1 - \hat{y}^{(i)}) \right] + \frac{\lambda}{2m} \sqrt{\sum_{j=1}^h \sum_{k=1}^d (w_{jk}^{[1]})^2}
$$

The continuous gradient flow for parameter updates satisfies the partial derivative relation $\frac{\partial \mathcal{L}}{\partial \mathbf{W}} = \lim_{\Delta t \to 0} \frac{\mathbf{W}(t + \Delta t) - \mathbf{W}(t)}{\Delta t}$.

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
