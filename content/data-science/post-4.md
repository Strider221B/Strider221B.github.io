---
title: "Handling Missing Not at Random (MNAR) Data: Proven Techniques"
date: "2026-10-26"
tags: ["missing-data-imputation", "data-science", "statistics"]
excerpt: "A comprehensive guide to handling Missing Not at Random (MNAR) data using advanced imputation, model-based approaches, and weighting techniques. It explains why traditional deletion methods fail and how to preserve data variance using statistically sound workflows."
author: "Somesh Chatterjee"
---

# Proven Techniques to Handle Missing Not at Random (MNAR) Data

When dealing with data that is **Missing Not at Random (MNAR)**, the probability that a value is missing **depends on the unobserved missing value itself**, even after accounting for all available data. For example, individuals with very high incomes may refuse to report their earnings, or patients experiencing severe side effects may drop out of a clinical trial. 

Because the cause of the missingness is hidden within the missing data itself, standard methods like MICE, KNN, or FIML will yield biased results. MNAR requires specialized statistical modeling that explicitly incorporates the missingness mechanism.

---

### 1. Selection Models

* **Heckman’s Two-Stage Model (Heckit):** Breaks the problem into two stages. First, it uses a selection equation to predict the probability that a data point is observed. Second, it includes a correction factor derived from the first stage (the inverse Mills ratio) as an additional explanatory variable in the primary regression model.
  * *Why it works for MNAR:* It mathematically corrects for the selection bias by accounting for the correlation between the unobserved factors affecting both the chance of missingness and the actual value.
* **Diggle and Kenward Model:** A continuous selection model designed for longitudinal (repeated measures) data where dropouts occur. It models the joint distribution of the longitudinal responses and the dropout process simultaneously.
  * *Why it works for MNAR:* It directly models how the probability of dropping out at a specific time point depends on the current (potentially missing) value at that time point.

---

### 2. Pattern-Mixture Models

* **Group-Based Stratification:** Instead of trying to fix the missing values, this approach stratifies the dataset into distinct groups based on the *pattern* of missing data (e.g., individuals who completed all follow-ups vs. those who dropped out early). Separate models are fit for each pattern, and the final parameters are combined by averaging across the patterns, weighted by their sample proportions.
  * *Why it works for MNAR:* It acknowledges that different missingness patterns represent completely different populations, allowing the model parameters to vary naturally by response behavior.

---

### 3. Sensitivity Analysis (The Practical Choice)

* **Tipping-Point Analysis:** A systematic approach where you deliberately impute missing values under a wide range of systematically shifted assumptions (e.g., assuming the missing values are progressively higher or lower than the observed values by a fixed constant δ). You observe at what specific shift value your study's conclusion changes (the "tipping point").
  * *Why it works for MNAR:* Because MNAR cannot be verified from the data alone, this method evaluates how severe the unobserved bias would have to be to invalidate your conclusions, giving researchers a measure of how robust their findings are.

---

### Summary Comparison

| Technique | Primary Approach | Computational Complexity | Main Limitation |
| :--- | :--- | :--- | :--- |
| **Heckman Selection** | Joint modeling via correction factor | Medium | Highly sensitive to model assumptions |
| **Pattern-Mixture** | Stratifying by missingness patterns | High | Requires user to specify unidentifiable parameters |
| **Sensitivity Analysis** | Stress-testing assumptions (δ-adjustment) | Low to Medium | Does not provide a single "correct" answer |
