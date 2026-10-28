# Design Specification: Next.js 16 Desktop Simulation — Client-Side Mermaid Diagrams, Default Maximized Window Management, & Standalone Profile Routing

> **Document Version:** 1.0.0  
> **Target Environment:** Next.js 16.4+ (Turbopack SSG) on GitHub Pages with Custom Apex Domain (`https://someshchatterjee.com`)  
> **Standards Reference:** [`documentation/prompts/frontend_coding_standards.md`](file:///home/somesh/git_repos/Strider221B.github.io/documentation/prompts/frontend_coding_standards.md)  
> **Status:** Completed & Verified  

---

## 1. Executive Summary & Problem Definition

To deliver a polished desktop simulation and technical publishing experience, three user-facing workflow challenges were identified and addressed:

1. **Standalone Profile Route Anomaly (`/about-me/`):**
   * *Problem:* Navigating to `https://someshchatterjee.com/about-me/` resolved to the generic category landing template in [`pages/[category]/index.jsx`](file:///home/somesh/git_repos/Strider221B.github.io/pages/[category]/index.jsx). It executed an `ls -la ~/articles/about-me` command in the terminal emulator, listing an `index.md` file rather than rendering the profile content.
   * *Solution:* Transformed [`pages/[category]/index.jsx`](file:///home/somesh/git_repos/Strider221B.github.io/pages/[category]/index.jsx) into a dual-mode route. When a category contains a root `index.md` (e.g., `about-me`), it loads the full article via [`getPostBySlug`](file:///home/somesh/git_repos/Strider221B.github.io/lib/markdown.js), outputs semantic fallback HTML for search engine crawlers, and boots the terminal directly into article preview mode (`cat ~/articles/about-me/index.md`) with a one-click action to launch the GUI reader.

2. **Window Viewport Ergonomics & Default State:**
   * *Problem:* Applications previously launched in a centered floating "restored" window size, requiring users on smaller or standard laptop viewports to manually click the maximize button to comfortably read long technical articles.
   * *Solution:* Enforced default maximization across all open events in [`WindowManagerContext.jsx`](file:///home/somesh/git_repos/Strider221B.github.io/context/WindowManagerContext.jsx) and initial boot environments in [`Ubuntu.jsx`](file:///home/somesh/git_repos/Strider221B.github.io/components/Ubuntu.jsx). Users retain full ability to restore, reposition, resize, and minimize windows via standard Ubuntu window controls.

3. **Mermaid Architectural Diagram Support:**
   * *Problem:* Technical posts (such as [`content/data-science/post-9.md`](file:///home/somesh/git_repos/Strider221B.github.io/content/data-science/post-9.md)) containing Mermaid diagram blocks (` ```mermaid ... ``` `) were rendered as inert code snippets (`<pre><code class="language-mermaid">`) rather than visual diagrams.
   * *Solution:* Integrated a self-contained Mermaid engine ([`public/js/mermaid.min.js`](file:///home/somesh/git_repos/Strider221B.github.io/public/js/mermaid.min.js)) loaded asynchronously via [`pages/_document.js`](file:///home/somesh/git_repos/Strider221B.github.io/pages/_document.js), paired with a reactive lifecycle renderer in [`MarkdownViewer.jsx`](file:///home/somesh/git_repos/Strider221B.github.io/components/apps/MarkdownViewer.jsx) that automatically detects diagram blocks, compiles them to clean SVG markup, and dynamically adapts between Ubuntu Dark and Light (Day) themes.

---

## 2. System Architecture & Data Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                        User URL or In-App Launch                       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
          ┌─────────────────────────┴─────────────────────────┐
          ▼                                                   ▼
  [/about-me/ Landing Route]                        [Application Windows]
  • Detects 'index.md' in category                  • WindowManagerContext:
  • Full-text SEO fallback emitted                   maximizedWindows[appId] = true
  • Terminal boots with:                            • Opens maximized by default
    cat ~/articles/about-me/index.md                • Full restore/resize toggle
          │                                                   │
          └─────────────────────────┬─────────────────────────┘
                                    │
                                    ▼
                      [MarkdownViewer (GUI Reader)]
                                    │
        ┌───────────────────────────┴───────────────────────────┐
        ▼                                                       ▼
 [KaTeX Math Pipeline]                                 [Mermaid Diagram Engine]
• MathML & HTML pre-rendered at build time            • Scripts preloaded asynchronously
• Integrals, formulas, Greek symbols                  • Scans pre > code.language-mermaid
                                                      • Renders reactive SVG with theme
                                                        adaptation (dark / day-theme)
```

---

## 3. Technical Implementation Details

### 3.1 Standalone Profile & Single-Article Route Resolution

In [`pages/[category]/index.jsx`](file:///home/somesh/git_repos/Strider221B.github.io/pages/[category]/index.jsx), `getStaticProps` now differentiates between multi-article category hubs (e.g. `data-science`) and discrete profile articles:

```javascript
// Standalone profile or discrete single-article category (e.g., 'about-me' has 'index.md')
let postData = null;
const indexPost = posts.find((p) => p.slug === 'index');
if (indexPost) {
  postData = await getPostBySlug(category, 'index');
}

const contentMap = buildContentMapFromManifest(postsManifest, postData);
```

When `postData` is populated:
1. **SEO Shell:** Generates canonical tags and a screen-reader/search crawler semantic fallback:
   ```jsx
   <section className="sr-only" aria-label="Article content for search crawlers and screen readers">
     <article>
       <h1>{postData.title}</h1>
       <div dangerouslySetInnerHTML={{ __html: postData.htmlContent }} />
     </article>
   </section>
   ```
2. **Terminal Execution:** Configures [`Ubuntu.jsx`](file:///home/somesh/git_repos/Strider221B.github.io/components/Ubuntu.jsx) with `initialBootApp="terminal"`, `initialBootSlug="index"`, `initialBootCategory="about-me"`, and the compiled `rawContent`.
3. **GUI Reader Binding:** In [`Terminal.jsx`](file:///home/somesh/git_repos/Strider221B.github.io/components/apps/Terminal.jsx), `handleOpenArticle` detects `category === 'about-me'` and targets the designated `'about-me'` desktop app ID directly.

### 3.2 Default Maximized Window Management

Window state initialization and launch handlers in [`WindowManagerContext.jsx`](file:///home/somesh/git_repos/Strider221B.github.io/context/WindowManagerContext.jsx) were updated to guarantee that all windows open maximized:

```javascript
// 1. Initial State (Homepage boot)
export const INITIAL_STATE = {
  openWindows: { 'about-me': true },
  minimizedWindows: {},
  maximizedWindows: { 'about-me': true }, // Maximized on load
  focusedWindows: { 'about-me': true },
  windowStack: ['about-me'],
  dockApps: getDefaultDockApps(),
};

// 2. Open App Action Handler
const handleOpenApp = (state, appId) => {
  if (!appId) return state;
  return {
    ...state,
    openWindows: { ...state.openWindows, [appId]: true },
    minimizedWindows: { ...state.minimizedWindows, [appId]: false },
    maximizedWindows: { ...state.maximizedWindows, [appId]: true }, // Open maximized
    windowStack: bringToTop(state.windowStack, appId),
    focusedWindows: createFocusedMap(appId),
    dockApps: { ...state.dockApps, [appId]: true },
  };
};
```

In [`components/Ubuntu.jsx`](file:///home/somesh/git_repos/Strider221B.github.io/components/Ubuntu.jsx), deep-linked boots set `maximizedWindows: { [initialBootApp]: true }`, providing a maximized terminal viewport upon entry.

### 3.3 Client-Side Theme-Aware Mermaid Engine

1. **Self-Contained Library Distribution:** [`public/js/mermaid.min.js`](file:///home/somesh/git_repos/Strider221B.github.io/public/js/mermaid.min.js) (Mermaid v12.2.0) is bundled directly into the project repository, removing runtime CDN network dependencies.
2. **Asynchronous Script Injection:** Loaded via [`pages/_document.js`](file:///home/somesh/git_repos/Strider221B.github.io/pages/_document.js):
   ```jsx
   <script src="/js/mermaid.min.js" defer />
   ```
3. **Reactive Rendering Hook in [`MarkdownViewer.jsx`](file:///home/somesh/git_repos/Strider221B.github.io/components/apps/MarkdownViewer.jsx):**
   * Finds all `pre > code.language-mermaid` or existing `div.mermaid-container[data-mermaid-code]` elements.
   * Caches raw diagram source in `data-mermaid-code` to support seamless re-rendering when the user switches between Day and Dark desktop themes.
   * Generates unique rendering IDs (`mermaid-render-${timestamp}-${index}`) and injects the resulting SVG.
4. **Styles & Responsive Overflow in [`styles/globals.css`](file:///home/somesh/git_repos/Strider221B.github.io/styles/globals.css):**
   ```css
   .mermaid-container {
     display: flex;
     justify-content: center;
     align-items: center;
     margin: 1.5rem 0;
     padding: 1.25rem;
     overflow-x: auto;
     border-radius: 0.5rem;
     -webkit-overflow-scrolling: touch;
   }

   .mermaid-container svg {
     max-width: 100%;
     height: auto;
     display: block;
   }
   ```

---

## 4. Verification & Testing

| Test Case | Method | Expected Result | Actual Result |
|---|---|---|---|
| **`/about-me/` URL Deep-Link** | `npm run build` & inspection of `out/about-me/index.html` | Full semantic `<article>` HTML rendered for SEO; boots terminal running `cat ~/articles/about-me/index.md` | Verified (28/28 static pages compiled) |
| **Maximized Window Launch** | `npm run build` & state analysis | All apps open with `isMaximized: true` | Verified |
| **Restore/Resize Toggle** | Interactive UI click | Title bar button un-maximizes window to draggable/resizable mode | Verified |
| **Post 9 Mermaid Diagram** | Build & payload check | `language-mermaid` code blocks compiled to SVG via client Mermaid engine | Verified |
| **Theme Switching** | Desktop Day/Dark switch | Diagram re-renders with matching theme styling without page reload | Verified |

---

## 5. Coding Standards Compliance Table

| Rule | Metric Limit | Implementation Status |
|---|---|---|
| **One Component Per File** | Exactly 1 default export | Compliant |
| **File Length Limit** | $\le 500$ lines | `pages/[category]/index.jsx`: 180 lines<br>`MarkdownViewer.jsx`: 496 lines<br>`WindowManagerContext.jsx`: 370 lines |
| **Function Length Limit** | $\le 20$ lines per helper | Compliant |
| **Component JSX Return** | $\le 50$ lines per return block | Compliant |
| **Component Props Limit** | $\le 8$ props | `MarkdownViewer`: 6 props |
| **No Magic Numbers / Strings** | Named constants | Compliant |
| **Tailwind Tokens Only** | No raw hex in JSX | Compliant |

