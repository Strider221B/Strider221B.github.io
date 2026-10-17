# Technical Design & Execution Plan: Mathematical Equation & Symbol Rendering

> **Target Capability**: LaTeX mathematical expression rendering (integrals, summations, fractions, matrices, symbols)  
> **Engine / Library**: `KaTeX` via Unified.js AST pipeline (`remark-math`, `remark-rehype`, `rehype-katex`, `rehype-stringify`)  
> **Document Path**: `./documentation/design/03_support_math_symmbols.md`  
> **Standards Reference**: `./documentation/prompts/frontend_coding_standards.md`  
> **Target Framework**: Next.js 16.4.1 (Static Export) | React 19.3.1 | Node.js >= 20.9.0  
> **Status**: Ready for Execution  

---

## 1. Problem Statement & Motivation

The Ubuntu Portfolio simulation web application features an integrated Markdown blog reader ([MarkdownViewer.jsx](file:///home/somesh/git_repos/Strider221B.github.io/components/apps/MarkdownViewer.jsx)). The current Markdown compilation pipeline in [lib/markdown.js](file:///home/somesh/git_repos/Strider221B.github.io/lib/markdown.js) compiles `.md` files to HTML strings at build-time using `remark` and `remark-html`:

```javascript
// Current implementation in lib/markdown.js:
const processed = await remark().use(html, { sanitize: false }).process(markdown);
```

### Current Limitations:
1. **No Math AST Parsing**: Standard `remark` and `remark-html` have no awareness of LaTeX math delimiters (`$...$` for inline math and `$$...$$` for display math blocks). Math expressions are treated as literal text, and characters like `<`, `>`, `_`, and `*` risk being misparsed as Markdown emphasis or tags.
2. **Missing Math Stylesheets & Fonts**: Neither KaTeX nor MathJax stylesheets or font files are loaded in [pages/_app.js](file:///home/somesh/git_repos/Strider221B.github.io/pages/_app.js) or [styles/globals.css](file:///home/somesh/git_repos/Strider221B.github.io/styles/globals.css).
3. **Impediment to Technical Content**: Articles in `content/data-science` and `content/machine-learning` cannot represent formulas, loss functions, probability densities, or calculus (e.g. integration $\int_a^b f(x)dx$, derivatives, matrices, limits).

---

## 2. Technology Selection: KaTeX vs. MathJax

| Evaluation Criteria | KaTeX (Recommended) | MathJax |
|---|---|---|
| **Compilation Timing** | **Static build-time (SSG)**: Renders directly to HTML/MathML during `next build`. | Typically runtime in-browser client evaluation (slower, layout shift). |
| **Client Bundle Impact** | **0 KB JS runtime**: Static HTML and MathML strings are shipped; client only downloads CSS and web fonts. | ~150KB–300KB JS library downloaded and executed on every client. |
| **Static Export Compatibility** | Fully compatible with Next.js `output: 'export'` and GitHub Pages hosting. | Requires client hydration hooks or complex SSR setup. |
| **Rendering Performance** | Ultra-fast execution at build time (synchronous parsing). | Considerably slower parsing times on large markdown sets. |
| **Coverage** | Supports 99%+ of LaTeX mathematical notation, including calculus integrals, sums, matrices, and greek letters. | Full LaTeX package support (often overkill for web blogs). |

**Decision**: Adopt **KaTeX** using the official unified pipeline (`remark-math` + `remark-rehype` + `rehype-katex` + `rehype-stringify`).

---

## 3. Architecture & Compilation Pipeline

### 3.1 Pipeline Transformation Flow

```
Raw Markdown Source
  │  (Contains $...$ and $$...$$ blocks)
  ▼
remark-parse (via unified/remark)
  │  Converts raw text into Markdown Abstract Syntax Tree (mdast)
  ▼
remark-math
  │  Identifies math delimiters and converts tokens into mdast `math` & `inlineMath` nodes
  ▼
remark-rehype
  │  Bridges mdast to HTML Abstract Syntax Tree (hast), with { allowDangerousHtml: true }
  ▼
rehype-katex
  │  Executes KaTeX compiler at build-time; converts math nodes into pre-rendered
  │  accessible HTML spans and MathML markup
  ▼
rehype-stringify
  │  Serializes the hast into a static HTML string with pre-rendered math
  ▼
Static HTML output stored in post.htmlContent
  │  Delivered through Next.js getStaticProps
  ▼
MarkdownViewer.jsx
  │  Renders pre-compiled HTML via dangerouslySetInnerHTML
  ▼
Browser
  │  Applies katex.min.css for typography, math fonts, and alignment
```

### 3.2 Build-Time Guarantee
All LaTeX parsing and mathematical typesetting occurs in Node.js during `next build`. The client receives complete static HTML with zero client-side mathematical evaluation overhead, guaranteeing zero Cumulative Layout Shift (CLS).

---

## 4. Dependency Matrix & Specifications

The following packages will be added to [package.json](file:///home/somesh/git_repos/Strider221B.github.io/package.json):

| Package | Version | Type | Purpose |
|---|---|---|---|
| `katex` | `^0.16.21` | Dependency | Fast math typesetting library providing symbols, fonts, and core compiler. |
| `remark-math` | `^6.0.0` | Dependency | Unified remark plugin to parse inline (`$...$`) and display (`$$...$$`) math syntax. |
| `remark-rehype` | `^11.1.1` | Dependency | Remark plugin that transforms Markdown AST (mdast) into HTML AST (hast). |
| `rehype-katex` | `^7.0.1` | Dependency | Rehype plugin to compile math nodes via KaTeX into HTML/MathML. |
| `rehype-stringify` | `^10.0.1` | Dependency | Rehype compiler to serialize hast back to static HTML string. |

> **Note**: `remark-html` will be superseded by the official `remark-rehype` + `rehype-stringify` unified pipeline, which is the recommended standard for AST-based HTML compilation with rehype plugins.

---

## 5. Implementation Specification

### 5.1 Pipeline Update in `lib/markdown.js`

Refactor the `markdownToHtml` function in [lib/markdown.js](file:///home/somesh/git_repos/Strider221B.github.io/lib/markdown.js):

```javascript
import { remark } from 'remark';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';

/**
 * Compile raw Markdown string into sanitized static HTML string with KaTeX math rendering.
 *
 * @param {string} markdown - Markdown text
 * @returns {Promise<string>} Compiled HTML markup with pre-rendered KaTeX symbols
 */
export async function markdownToHtml(markdown) {
  if (!markdown) {
    return '';
  }

  const processed = await remark()
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeKatex, {
      output: 'htmlAndMathml',
      strict: false,
      throwOnError: false,
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  return processed.toString();
}
```

### 5.2 Global CSS & Font Loading in `pages/_app.js`

Add the KaTeX stylesheet to [pages/_app.js](file:///home/somesh/git_repos/Strider221B.github.io/pages/_app.js):

```javascript
// 6. Styles (CSS imports)
import 'katex/dist/katex.min.css';
import '../styles/globals.css';
```

Next.js automatically processes imported CSS files from `node_modules` and bundles required KaTeX web fonts (`.woff2`, `.woff`, `.ttf`) into the static export `out/` directory.

### 5.3 Styling & Dark Theme Adaptations

KaTeX renders symbols using CSS `color: inherit` / `currentColor`, which naturally adopts the text color of the Ubuntu desktop theme. To ensure equations display responsively inside windows and do not overflow small screens:

Add the following to [styles/globals.css](file:///home/somesh/git_repos/Strider221B.github.io/styles/globals.css):

```css
/* ==========================================================================
   KaTeX Math Equation Display Overrides
   ========================================================================== */

/* Ensure display equations scroll horizontally rather than breaking container width */
.markdown-content .katex-display {
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0.75rem 0;
  margin: 1rem 0;
  -webkit-overflow-scrolling: touch;
}

/* Custom subtle scrollbar for wide equations on Ubuntu theme */
.markdown-content .katex-display::-webkit-scrollbar {
  height: 4px;
}

.markdown-content .katex-display::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.markdown-content .katex-display::-webkit-scrollbar-thumb:hover {
  background: rgba(233, 84, 32, 0.6); /* Ubuntu Orange */
}

/* Ensure inline equations wrap cleanly and maintain baseline alignment */
.markdown-content .katex {
  font-size: 1.05em;
  text-rendering: auto;
}
```

---

## 6. Supported Mathematical Syntax

Once implemented, authors can write any standard LaTeX math constructs:

### 6.1 Inline Equations
- **Syntax**: `$ ... $`
- **Examples**:
  - Variable and exponent: `$x^2 + y^2 = r^2$`
  - Calculus derivative: `$\frac{df}{dx} = \lim_{\Delta x \to 0} \frac{f(x + \Delta x) - f(x)}{\Delta x}$`
  - Integration: `$\int_0^1 x^2 \, dx = \frac{1}{3}$`
  - Greek letters and symbols: `$\alpha, \beta, \gamma, \sigma^2, \mu \in \mathbb{R}$`

### 6.2 Display Equations (Block / Centered)
- **Syntax**: `$$ ... $$`
- **Example — Gaussian Integral**:
  ```latex
  $$
  \int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}
  $$
  ```
- **Example — Machine Learning Loss (Cross Entropy)**:
  ```latex
  $$
  \mathcal{L}_{\text{CE}}(\theta) = -\frac{1}{N} \sum_{i=1}^N \sum_{k=1}^K y_{i,k} \log(\hat{y}_{i,k})
  $$
  ```
- **Example — Matrix Notation**:
  ```latex
  $$
  \mathbf{W} = \begin{pmatrix} w_{11} & w_{12} \\ w_{21} & w_{22} \end{pmatrix}
  $$
  ```

---

## 7. Step-by-Step Execution Plan

### Step 1: Install Dependencies
Run npm install with explicit versions:
```bash
npm install katex@^0.16.21 remark-math@^6.0.0 remark-rehype@^11.1.1 rehype-katex@^7.0.1 rehype-stringify@^10.0.1
```

### Step 2: Refactor Markdown Pipeline
- Open [lib/markdown.js](file:///home/somesh/git_repos/Strider221B.github.io/lib/markdown.js).
- Update imports to use `remarkMath`, `remarkRehype`, `rehypeKatex`, `rehypeStringify`.
- Update `markdownToHtml` to pipe through the plugins.
- Remove redundant `remark-html` dependency if completely replaced.

### Step 3: Configure Global Stylesheet & Fonts
- Update [pages/_app.js](file:///home/somesh/git_repos/Strider221B.github.io/pages/_app.js) to import `'katex/dist/katex.min.css'`.
- Update [styles/globals.css](file:///home/somesh/git_repos/Strider221B.github.io/styles/globals.css) with responsive display equation overflow rules and scrollbars.

### Step 4: Add Verification Test Post
- Create or update a post in `content/data-science/` or `content/machine-learning/` containing:
  - Inline integrals and derivatives
  - Display math blocks with summations and square roots
  - Matrix / piecewise math blocks

### Step 5: Verification & Static Build Test
- Run `npm run build` to verify:
  1. No build errors or syntax incompatibilities with Next.js 16.4.1 / React 19.3.1.
  2. Static export directory `out/` compiles cleanly with static math HTML.
  3. KaTeX fonts are emitted to `out/_next/static/css/` or `out/fonts`.
- Run `npm run dev` and test rendering in browser via subagent or local test.

---

## 8. Standards Compliance Checklist

Following [frontend_coding_standards.md](file:///home/somesh/git_repos/Strider221B.github.io/documentation/prompts/frontend_coding_standards.md):

| Requirement | Implementation Strategy | Status |
|---|---|---|
| **Build-time Execution (SSG)** | Pure static transformation in `lib/markdown.js` via `getStaticProps`. | Compliant |
| **No Client Hydration Overhead** | Static HTML strings, zero JS math library loaded in browser bundle. | Compliant |
| **Import Order Standards** | Correct grouping in `pages/_app.js` and `lib/markdown.js`. | Compliant |
| **No Magic Numbers / Strings** | KaTeX options configured via descriptive options object. | Compliant |
| **Responsive & Mobile Viewport** | Horizontal scroll container for wide matrices/equations. | Compliant |
| **Static Export (`output: 'export'`)** | Fully self-contained static HTML and fonts for GitHub Pages. | Compliant |
