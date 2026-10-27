---
title: "Deep Generative Models for Missing Not at Random (MNAR) Data"
date: "2026-10-27"
tags: ["missing-data-imputation", "data-science", "gen-ai", "mnar"]
excerpt: "This post explores why Variational Autoencoders excel at handling MNAR data and how Identifiable Deep Generative Models (iDGMs) introduce mathematical guarantees to eliminate imputation bias."
author: "Somesh Chatterjee"
---

# Deep Generative Models for Missing Not at Random (MNAR) Data

Data **Missing Not At Random (MNAR)** occurs when the probability of a value being missing depends directly on the unobserved value itself. For example, individuals with very high incomes might choose not to disclose them on a survey. This mechanism introduces severe selection bias that traditional, reconstruction-only imputation techniques cannot easily overcome. 

Modern deep generative architectures—specifically **Variational Autoencoders (VAEs)** and **Identifiable Deep Generative Models (iDGMs)**—have emerged as state-of-the-art paradigms for resolving this challenging problem.

---

## 1. Why Variational Autoencoders (VAEs) Excel at MNAR Imputation

VAEs are highly effective because they approximate complex, non-linear data distributions by learning a continuous latent space and can explicitly model the data-generating process alongside the missingness mechanism. Instead of simply predicting a single fixed value, they learn the underlying joint probability distribution of the data.

### Core Strengths:
* **Joint Distribution Modeling:** Advanced VAE frameworks model the data $X$ and the missingness indicator $M$ simultaneously ($P(X, M)$). By feeding the missingness pattern directly into the encoder and decoder, the VAE inherently captures *why* a data point is missing.
* **Continuous, Regularized Latent Space:** Unlike standard Autoencoders, which can overfit or create disjoint representations, VAEs enforce a smooth Gaussian distribution in the latent space. This allows them to generalize smoothly across unseen or highly corrupted feature spaces.
* **Robustness in Severe Scenarios:** In benchmark analyses involving high missingness rates (60% to 80%), deep generative methods significantly outperform classical baselines like MICE or missForest.
* **Downstream Task Supervision:** Recent frameworks integrate task-specific targets into the Evidence Lower Bound (ELBO) optimization (e.g., survival analysis loss). This preserves the critical prognostic structures that reconstruction-focused models fail to recover under severe MNAR conditions.

### Architectural Limitations:
While powerful, standard VAEs suffer from specific flaws when dealing with missing data:
* **Mode Collapse:** VAEs are prone to posterior collapse under complex missingness mechanisms, causing the model to output a single average representation.
* **Sample Size Constraints:** For tabular data with smaller sample sizes (typically $N < 30,000$), deep learning architectures are often less robust than simpler statistical techniques.
* **The Core Theoretical Deficit (Non-Identifiability):** Standard VAEs optimize the ELBO to match the *observed* data. Under MNAR conditions, multiple entirely different distributions of the true data $X$ and the missingness mechanism $M$ can yield the exact same observed data distribution $P(X_{obs}, M)$. Even with infinite data, a standard VAE can converge perfectly on a loss function while generating completely wrong, highly biased imputations.

---

## 2. Going Deeper: Identifiable Deep Generative Models (iDGMs)

An **Identifiable Deep Generative Model (iDGM)** resolves this fundamental ambiguity by imposing mathematical constraints or incorporating specific structural knowledge. **A model is structurally identifiable if there is a unique mapping from the observed data back to the true parameters and latent variables.** If the mapping is unique, the model is mathematically guaranteed to recover the true underlying distribution rather than a biased mirage.

To achieve this under MNAR conditions, state-of-the-art frameworks rely on two key structural dependencies:

graph TD
    U[Auxiliary Variables U] --> Z[Latent Space Z]
    U --> M[Missingness Indicator M]
    Z --> X[True Data X]
    Z --> M
    X --> M


### Key Components of an iDGM Architecture:

#### 1. Conditioning on Auxiliary Variables ($U$)
Instead of assuming a completely unsupervised space, identifiable models leverage **auxiliary variables ($U$)** that are completely observed (never missing) and correlate with the true data distribution or the missingness. Examples include demographic data, time-stamps, or geographic indicators.
* **The Mechanism:** The latent space $Z$ is conditioned on $U$. The model assumes that given $U$, the latent variables possess a specific conditional structure (e.g., a conditionally independent Gaussian distribution). 

#### 2. Structural Assumptions on the Missingness Mechanism
The model splits the generation process into two distinct pipelines (a joint VAE architecture) and applies specific functional limitations to how they interact. 
* **The Data Generator:** $P_\theta(X \mid Z, U)$ models how the true features are created.
* **The Missingness Mask:** $P_\phi(M \mid X, U)$ models why things go missing. 

By constraining the functional classes of these neural networks (e.g., using additive models or requiring that the missingness mechanism is monotonic relative to certain features), researchers prove theorems showing that the mapping from $P(X_{obs}, M \mid U)$ back to the true parameters ($\theta, \phi$) becomes unique.

---

## 3. Comparative Landscape: What Can Be Better Than Standard VAEs?

When dealing with severe MNAR profiles, alternative paradigms and specialized extensions address standard VAE shortcomings:

| Methodology | Why It Outperforms a Standard VAE | Primary Use Case |
| :--- | :--- | :--- |
| **Identifiable Deep Generative Models (iDGMs)** | Couples joint VAE distributions with structural assumptions ($U$). Provides absolute theoretical guarantees that the true data-generating process is recovered. | Causal inference, high-stakes medical/financial analysis where bias is intolerable. |
| **Partial Multiple Imputation VAEs** | Draws multiple posterior samples to better reflect uncertainty rather than generating values based on a single sample (which can be heavily biased). | Quantifying uncertainty in downstream statistical modeling. |
| **Task-Supervised Generative Models** | Adds specialized loss functions (e.g., Cox proportional hazards loss for medical prognosis) directly to the VAE training pipeline, optimizing for practical downstream prediction rather than mere reconstruction. | Predictive analytics where imputation is an intermediate step. |
| **Generative Adversarial Networks (GANs)** | Correctly engineered conditional GAN architectures (like modified GAIN variants) can offer sharper, less blurry reconstructions than standard VAEs in large-scale datasets. | High-dimensional datasets (e.g., computer vision, complex genomics) where sample density is massive. |

### Technical Summary
While a standard VAE offers heuristic success, **iDGMs provide mathematical proof that the imputation will converge toward the ground truth as data increases.** They eliminate arbitrary local optima (where different random seeds yield drastically different imputations) and ensure true causal uncoupling between the underlying data signals and the artifact signals of the missing data pattern itself.

## The Mathematical Reality: Do iDGMs Require an Instrumental Variable Like Heckit?

**Yes, the underlying logic is highly analogous to Heckman's selection model (Heckit), but iDGMs do not strictly require a textbook "instrumental variable" to work.** Instead, they trade that strict requirement for structural or distributional assumptions. 

The comparison between how Heckit and iDGMs tackle the same MNAR selection bias reveals two distinct mathematical approaches:

---

### 1. The Classic Econometric Approach (Heckit)
The **Heckman Selection Model (Heckit)** achieves identifiability primarily through an **Instrumental Variable (IV)**, which introduces an *exclusion restriction*. 
* **The Rule:** You need a variable $Z$ that predicts *whether* data is missing (selection), but has absolutely *no direct effect* on the actual value $X$ once you account for other factors.
* **The Catch:** Finding a true instrument in the real world is notoriously hard. If you don't have one, Heckit forces you to rely purely on a highly fragile assumption that your data follows a perfect joint normal (Gaussian) distribution. Without the IV or the perfect normality, Heckit mathematically collapses.

---

### 2. The Deep Learning Approach (iDGMs)
**Identifiable Deep Generative Models (iDGMs)** achieve identifiability using a different flavor of side information. They utilize **Auxiliary Variables ($U$)**, which look similar to instruments on a causal graph but behave differently:
* **No Exclusion Restriction Needed:** Unlike an instrumental variable, an auxiliary variable $U$ **is allowed** to directly influence *both* the true data $X$ and the missingness indicator $M$. It does not need to be walled off from the true outcome.
* **The Trade-Off:** Instead of a strict exclusion restriction, iDGMs require **functional and architectural assumptions**. They enforce constraints on how the neural networks behave (e.g., using additive conditional structures, enforcing that the latent space distributions change smoothly across different values of $U$, or requiring specific geometric properties in the decoder function).

---

### 3. Direct Structural Comparison: Heckit vs. iDGMs

| Metric | Heckman's Heckit | Identifiable DGMs (iDGMs) |
| :--- | :--- | :--- |
| **Type of Side Clue** | **Instrumental Variable** (Must affect missingness, *cannot* affect the true value directly). | **Auxiliary Variable** (Can affect both the missingness and the true value directly). |
| **Complexity Handled** | Strictly linear relationships and simple continuous distributions. | Highly non-linear, deep neural network relationships across complex data. |
| **How it achieves Identifiability** | Through the exclusion restriction (the IV) or strict joint normality. | Through conditioning the latent space on $U$ combined with architectural network constraints. |

---

### Technical Summary

If your auxiliary variable $U$ happens to be a perfect instrumental variable, an iDGM will happily leverage it, and the math becomes even cleaner. 

However, the true breakthrough of iDGMs is that they allow you to use **imperfect instruments**—general side information like age, geographic location, or timestamps that are heavily related to the actual values—and utilize the flexible power of deep learning to bypass the strict linear rules of classical econometrics.



## ELI5

### 🍰 Explaining Missing Data and Smart AI

Imagine you are looking at a classroom where some kids hid their test scores. If they only hid them because they were embarrassed by low grades, that data is **Missing Not At Random (MNAR)**. The reason the data is missing is tied directly to the secret value itself! This makes it super hard for normal computers to guess what the missing numbers are.

---

#### 1. The Regular AI Guessing Machine (VAEs)
A **Variational Autoencoder (VAE)** is like a very smart detective. 

* **What it does right:** Instead of just guessing a random number to fill in the blank, it tries to understand the *story* behind the data. It looks at the clue of *why* the data went missing in the first place.
* **Where it breaks:** If the secret is too tricky, the detective gets confused. Because it cannot see the hidden numbers, it might find five different "perfect" explanations that all look good but are completely wrong. It ends up guessing the exact same boring, wrong answer over and over again.

---

#### 2. The Superhero AI Guessing Machine (iDGMs)
To fix this, scientists made an **Identifiable Deep Generative Model (iDGM)**. Think of this as a detective with a cheat sheet.

An "identifiable" model means there is mathematically **only one true answer** it can find. It stops the AI from guessing blindly in the dark. It does this using two tricks:

* **Helper Clues (Auxiliary Variables):** The detective looks at things that are *never* hidden. For example, if we don't know a student's test score, but we know how many hours they slept and how many classes they missed, those are helper clues that point to the true score.
* **Separating the Rules:** The AI splits its brain into two teams. Team A figures out how the kids get their scores. Team B figures out why a kid decides to hide their score. 

By keeping these two rules separate and using helper clues, the AI is mathematically guaranteed to find the real, true map of the data.

---

#### 3. The Competition: Which AI is Best?

* **Standard VAE:** Good for regular, everyday guessing, but gets tricked easily by secrets.
* **Identifiable Model (iDGM):** The gold standard when you *absolutely must* be accurate and cannot afford to guess wrong (like in hospital data).
* **Task-Supervised Model:** An AI that doesn't care about making the perfect guess; it only cares about winning a specific game later (like predicting if a patient gets sick).
* **GANs:** A different type of AI that draws very sharp, detailed pictures to fill in the blanks, but needs a mountain of data to work properly.


