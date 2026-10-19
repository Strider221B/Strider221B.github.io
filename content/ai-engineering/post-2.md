---
title: "Attention Mechanisms & Transformer Architecture Explained"
date: "2025-06-18"
tags: ["transformers", "attention", "nlp", "llm", "deep-learning"]
excerpt: "A mathematical and conceptual deep dive into Scaled Dot-Product Attention, Multi-Head projections, and positional embeddings."
author: "Somesh Chatterjee"
---

# Attention Mechanisms & Transformer Architecture Explained

The Transformer architecture introduced in *"Attention Is All You Need"* revolutionized natural language processing and computer vision by replacing sequential recurrent connections with parallelizable attention mechanisms.

---

## 1. Scaled Dot-Product Attention

Given query matrix $Q$, key matrix $K$, and value matrix $V$:

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{Q K^T}{\sqrt{d_k}}\right) V$$

The scaling factor $\frac{1}{\sqrt{d_k}}$ is essential: without it, for large projection dimensions, the dot products grow large in magnitude, pushing the softmax function into regions with vanishing gradients.

```python
import torch
import torch.nn.functional as F

def scaled_dot_product_attention(query, key, value, mask=None):
    d_k = query.size(-1)
    scores = torch.matmul(query, key.transpose(-2, -1)) / (d_k ** 0.5)
    
    if mask is not None:
        scores = scores.masked_fill(mask == 0, -1e9)
        
    weights = F.softmax(scores, dim=-1)
    return torch.matmul(weights, value), weights
```

---

## 2. Multi-Head Attention

Rather than computing a single attention function, multi-head attention projects Queries, Keys, and Values $h$ times with learned linear projections. This enables the model to simultaneously attend to information from different representation subspaces at different positions.

---

## 3. Practical Implications

By eliminating recurrent dependencies across time steps, Transformers allow full sequence parallelization during training, drastically decreasing wall-clock training time on modern GPU/TPU clusters.
