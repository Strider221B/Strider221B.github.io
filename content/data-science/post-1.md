---
title: "Scalable Data Pipelines with Apache Arrow and DuckDB"
date: "2025-11-10"
tags: ["data-science", "duckdb", "arrow", "python"]
excerpt: "Exploring in-memory columnar data architectures for ultra-fast analytics processing without database overhead."
author: "Somesh Chatterjee"
---

# Scalable Data Pipelines with Apache Arrow and DuckDB

Modern analytical workloads demand processing millions of rows without the latency of network calls or full database round-trips. In this article, we explore how combining **Apache Arrow**'s zero-copy in-memory format with **DuckDB**'s vectorized query engine creates lightning-fast data pipelines.

---

## The Bottleneck of Traditional ETL

Traditional data pipelines frequently suffer from serialisation costs:
1. Data is retrieved from disk in row-oriented formats (like CSV or JSON).
2. The processing framework converts rows into Python dictionaries or generic objects.
3. Memory fragmentation and Python GIL locking slow down compute.

```python
# The classic slow path
import csv

results = []
with open("massive_dataset.csv") as f:
    reader = csv.DictReader(f)
    for row in reader:
        if float(row["price"]) > 100.0:
            results.append(row)
```

---

## Vectorized Execution with DuckDB

DuckDB executes queries in columnar chunks, matching CPU L1/L2 cache lines and taking advantage of SIMD vector instructions:

```python
import duckdb

# Query directly from Parquet or Arrow tables
conn = duckdb.connect()
df = conn.execute("""
    SELECT 
        region, 
        AVG(price) AS avg_price, 
        COUNT(*) AS total_sales
    FROM 'sales_data.parquet'
    WHERE status = 'COMPLETED'
    GROUP BY region
    ORDER BY avg_price DESC
""").df()

print(df.head())
```

---

## Key Takeaways

- Columnar storage formats like Parquet combined with in-process SQL engines eliminate intermediate serialization.
- Apache Arrow's memory layout enables zero-copy sharing between DuckDB, PyTorch, and Polars.
- For datasets up to 100GB, in-process engines often dramatically outperform distributed frameworks like Spark by avoiding network shuffle overhead.
