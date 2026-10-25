# Technical Design & Execution Plan: GitHub Flavored Markdown (GFM) Table Support

> **Target Capability**: GitHub Flavored Markdown (GFM) table parsing and responsive rendering  
> **Engine / Library**: `remark-gfm` via Unified.js AST pipeline (`remark-gfm`, `remark-math`, `remark-rehype`, `rehype-katex`, `rehype-stringify`)  
> **Document Path**: `./documentation/design/06_support_tables_gfm.md`  
> **Standards Reference**: `./documentation/prompts/frontend_coding_standards.md`  
> **Target Framework**: Next.js 16.4.1 (Static Export) | React 19.3.1 | Node.js >= 20.9.0  
> **Status**: Completed  

---

## 1. Problem Statement & Motivation

Articles in the portfolio blog system containing comparison tables (such as [content/data-science/post-1.md](file:///home/somesh/git_repos/Strider221B.github.io/content/data-science/post-1.md)) were failing to render as HTML `<table>` elements in the final website. Instead, the raw markdown table pipe syntax (`| Feature | MCAR | MAR | MNAR |`) was output as plain text paragraph strings.

### Root Cause Analysis:
1. **Missing GFM Extension in Remark**: The base `remark` parser adheres to standard CommonMark specifications, which do not include table syntax. GitHub Flavored Markdown (GFM) table syntax requires the `remark-gfm` extension in the remark processor chain.
2. **Dual Markdown Compilation Pipeline**:
   - Runtime / SSG compilation in [lib/markdown.js](file:///home/somesh/git_repos/Strider221B.github.io/lib/markdown.js) (`markdownToHtml`).
   - Pre-build catalog generation in [scripts/generate-manifest.js](file:///home/somesh/git_repos/Strider221B.github.io/scripts/generate-manifest.js) (`compileMarkdownToHtml`).
   Both pipelines previously lacked `remark-gfm`.
3. **Responsive Table Display & Ubuntu Theming**: Tables with multiple columns containing descriptive sentences can overflow fixed-width desktop windows unless horizontal scrolling and theme-consistent scrollbar styles are applied.

---

## 2. Technology Selection

| Solution | Evaluation | Decision |
|---|---|---|
| **`remark-gfm`** | Official unified plugin supporting GFM tables, strikethrough, autolinks, and tasklists. Seamlessly integrates into unified AST before `remark-rehype`. Zero client-side runtime JS overhead. | **Selected** (v4.0.1) |
| **Custom regex parsing** | Fragile, error-prone with escaped pipes and inline formatting. | Rejected |
| **Client-side Markdown parser** | Increases client bundle size, introduces layout shift (CLS), incompatible with static SEO pre-rendering. | Rejected |

---

## 3. Architecture & Compilation Pipeline

### 3.1 Pipeline Transformation Flow

```
Raw Markdown Source
  │  (Contains GFM tables | Header | ... | and LaTeX $...$)
  ▼
remark-parse (via unified/remark)
  ▼
remark-gfm
  │  Transforms markdown table tokens into mdast `table`, `tableRow`, and `tableCell` nodes
  ▼
remark-math
  │  Transforms LaTeX math syntax into mdast `math` & `inlineMath` nodes
  ▼
remark-rehype
  │  Bridges mdast into hast (HTML AST), converting table nodes to <table>, <thead>, <tbody>, <tr>, <th>, <td>
  ▼
rehype-katex
  │  Typesets math formulas inside and outside tables at build time
  ▼
rehype-stringify
  │  Serializes the hast into static HTML strings
  ▼
Static HTML output in post.htmlContent & public/posts/[category]/[slug].json
```

---

## 4. Implementation Specification

### 4.1 Dependency Addition
Added `remark-gfm@^4.0.1` to [package.json](file:///home/somesh/git_repos/Strider221B.github.io/package.json):
```json
"dependencies": {
  "remark": "^15.0.1",
  "remark-gfm": "^4.0.1",
  "remark-math": "^6.0.0",
  "remark-rehype": "^11.1.2",
  ...
}
```

### 4.2 AST Pipeline Integration
Updated [lib/markdown.js](file:///home/somesh/git_repos/Strider221B.github.io/lib/markdown.js) and [scripts/generate-manifest.js](file:///home/somesh/git_repos/Strider221B.github.io/scripts/generate-manifest.js):
```javascript
const processed = await remark()
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkRehype, REHYPE_OPTIONS)
  .use(rehypeKatex, KATEX_OPTIONS)
  .use(rehypeStringify, REHYPE_OPTIONS)
  .process(markdown);
```

### 4.3 Responsive & Themed Typography in `styles/globals.css`
Implemented responsive table styling adhering to the Ubuntu desktop aesthetic:
- **Responsive Scroll Container**: `table { display: block; overflow-x: auto; max-width: 100%; -webkit-overflow-scrolling: touch; }`
- **Ubuntu Themed Scrollbar**: 4px subtle scrollbar with Ubuntu Orange hover accent (`rgba(233, 84, 32, 0.6)`).
- **Zebra Striping & Hover States**: Subtle alternating rows (`tbody tr:nth-child(even)`) and row hover highlights.
- **Alignment Preservation**: Support for `:---:`, `---:`, and `:---` column alignment (`th[align="center"]`, `th[align="right"]`).
- **Day / Dark Theme Integration**: Dedicated color tokens for border borders, header backgrounds, and typography contrast in both themes.

---

## 5. Verification Checklist

| Requirement | Result |
|---|---|
| `./content/data-science/post-1.md` table renders as HTML `<table>` | Verified |
| Both SSG (`next build`) and on-demand JSON reader (`public/posts/`) generate valid tables | Verified |
| Table headers (`<th>`) and cells (`<td>`) styled for both dark and day themes | Verified |
| Table scrolls horizontally within window without breaking container bounds | Verified |
| Static export (`out/`) builds cleanly with zero errors | Verified (22/22 pages) |
