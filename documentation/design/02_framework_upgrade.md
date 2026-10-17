# Framework & Dependency Upgrade Plan: Next.js 16.4.1 & React 19.3.1

> **Target Versions**: Next.js 16.4.1 | React 19.3.1 | React DOM 19.3.1  
> **Target Node Runtime**: Node.js >= 20.9.0 (LTS Iron / Jod)  
> **Document Path**: `./documentation/design/framework_upgrade.md`  
> **Standards Reference**: `./documentation/prompts/frontend_coding_standards.md`  
> **Status**: Proposed / Ready for Review  

---

## 1. Executive Summary

The Ubuntu Portfolio simulation web application currently runs on legacy dependencies: **Next.js 14.2.0** and **React 18.3.0** with **Tailwind CSS 3.4.0**, pinned to a Node.js `>= 18.x` runtime specification. Over the past two years, the Next.js and React ecosystems have advanced significantly:
- **React 19.x** introduced the React Compiler, View Transitions (`<ViewTransition>`), native fragment refs, RSC transport protocol optimizations, and the permanent removal of deprecated APIs like `findDOMNode`.
- **Next.js 16.x** brings Turbopack as the default compiler for development and production builds, asynchronous request APIs, Cache Components, enhanced static export efficiency, and enforces modern Node.js runtimes (`>= 20.9.0`).

This document specifies a comprehensive, end-to-end upgrade plan to elevate the project to **Next.js 16.4.1** and **React 19.3.1**, while updating all supporting dependencies, tooling configurations, and runtime engines in accordance with `./documentation/prompts/frontend_coding_standards.md`.

---

## 2. Dependency Audit & Target Matrix

Every direct and development dependency has been audited for security patches, React 19 compatibility, and Next.js 16 interoperability.

### 2.1 Core Frameworks & Runtimes

| Package | Current Version | Target Version | Type | Rationale & Changes |
|---|---|---|---|---|
| `next` | `^14.2.0` | `16.4.1` | Dependency | Active LTS release line. Turbopack bundler by default; optimized static export pipelines; automated agentic upgrade support. |
| `react` | `^18.3.0` | `19.3.1` | Dependency | Stable React 19 release with enhanced RSC transport protocol, View Transition API primitives, and ref cleanup semantics. |
| `react-dom` | `^18.3.0` | `19.3.1` | Dependency | DOM renderer matching React core. Requires DOM ref handling without `findDOMNode`. |
| `node` (engine) | `>=18.x` | `>=20.9.0` | Engine | Next.js 16 strictly deprecates Node 18; requires Node 20.9.0+ or Node 22 LTS. |

### 2.2 UI & Component Libraries

| Package | Current Version | Target Version | Type | Rationale & Changes |
|---|---|---|---|---|
| `react-draggable` | `^4.4.6` | `^4.7.2` | Dependency | Upgraded to latest 4.x release. React 19 removes `findDOMNode`; `react-draggable` requires explicit `nodeRef` usage. (`Window.jsx` already adheres to this pattern). |

### 2.3 Markdown & Build Pipeline

| Package | Current Version | Target Version | Type | Rationale & Changes |
|---|---|---|---|---|
| `gray-matter` | `^4.0.3` | `^4.0.3` | Dependency | Stable YAML frontmatter parser; audit confirmed no breaking issues or deprecations with Node 20+. |
| `remark` | `^15.0.0` | `^15.0.1` | Dependency | Pure ESM markdown parser; patch updates for parsing edge cases. |
| `remark-html` | `^16.0.0` | `^16.0.1` | Dependency | HTML string compiler companion for remark; security and parsing maintenance update. |

### 2.4 Styling & PostCSS Tooling

| Package | Current Version | Target Version | Type | Rationale & Changes |
|---|---|---|---|---|
| `tailwindcss` | `^3.4.0` | `^3.4.17` | Dependency | Latest stable Tailwind CSS v3 LTS. Preserves Ubuntu custom theme tokens, `@tailwind` directives, and custom animation keyframes without requiring breaking configuration rewrites. |
| `postcss` | `^8.4.0` | `^8.4.49` | Dependency | Essential PostCSS runner upgrade ensuring compatibility with modern bundlers and Node 20+. |
| `autoprefixer` | `^10.4.0` | `^10.4.20` | Dependency | Modern CSS vendor prefixer updated for latest browser target definitions. |

### 2.5 Developer & Deployment Tools

| Package | Current Version | Target Version | Type | Rationale & Changes |
|---|---|---|---|---|
| `gh-pages` | `^6.1.0` | `^6.3.0` | DevDependency | Static deployment helper for GitHub Pages hosting (`strider221b.github.io`). |

---

## 3. Breaking Changes & Impact Analysis

### 3.1 Node.js Runtime Deprecation
- **Breaking Change**: Next.js 16 drops support for Node.js 18.x. Attempting to build or run on Node 18 results in immediate build abort.
- **Impact on Project**: `package.json` `"engines"` field must be updated from `">=18.x"` to `">=20.9.0"`. CI/CD workflows (GitHub Actions) deploying to GitHub Pages must specify `node-version: 20` or `22`.

### 3.2 Turbopack Bundler by Default
- **Breaking Change**: Next.js 16 defaults to Turbopack for both `next dev` and `next build`.
- **Impact on Project**: 
  - The project utilizes standard Tailwind CSS, PostCSS, and vanilla CSS (`styles/globals.css`).
  - Next.js 16 Turbopack supports PostCSS natively.
  - If any legacy custom webpack configuration or third-party plugin encounters issues during initial rollout, an emergency fallback flag (`next dev --webpack`, `next build --webpack`) will be defined in npm scripts as an interim backup.

### 3.3 React 19 Removal of `findDOMNode`
- **Breaking Change**: React 19 completely removes `findDOMNode`. Any component library querying DOM nodes without an explicit `React.createRef` or `useRef` will throw runtime errors.
- **Impact on Project**: 
  - `components/base/Window.jsx` wraps application windows in `<Draggable nodeRef={nodeRef}>` and passes `ref={nodeRef}` to the underlying `<div style={windowStyles}>`.
  - The codebase is already proactively compliant with `nodeRef`, guaranteeing zero `findDOMNode` regressions.

### 3.4 Static Export (`output: 'export'`) & Image Optimization
- **Breaking Change**: Next.js 16 has stricter image optimization validation for static exports.
- **Impact on Project**:
  - `next.config.js` already configures:
    ```javascript
    output: 'export',
    trailingSlash: true,
    images: { unoptimized: true },
    ```
  - This configuration remains standard and supported for GitHub Pages static sites in Next.js 16.

### 3.5 Removal of `next lint` Command
- **Breaking Change**: Next.js 16 removes the legacy `next lint` CLI wrapper in favor of direct ESLint execution (`eslint .`).
- **Impact on Project**: Any existing lint scripts or hooks will use direct standard tooling.

---

## 4. Architectural Alignment with Frontend Coding Standards

All changes must strictly respect `./documentation/prompts/frontend_coding_standards.md`:

1. **Component Architecture (§1)**:
   - Functional components with hooks (`useState`, `useRef`, `useCallback`, `useMemo`, `useContext`).
   - One component per file with matching file/component names.
   - Component ordering preserved: Imports → Constants → Component definition → JSDoc → Export.
2. **File and Function Size Limits (§2)**:
   - File length ≤ 500 lines.
   - Component JSX return ≤ 50 lines.
   - Helper functions ≤ 20 lines.
   - Props ≤ 8 per component.
3. **Naming Conventions (§3) & Magic Values (§4)**:
   - No magic strings/numbers; named constants defined at file top or shared in `lib/constants.js`.
4. **Tailwind CSS Rules (§6)**:
   - Ubuntu design tokens (`ub-grey`, `ub-orange`, `ub-cool-grey`, etc.) preserved.
   - No raw hex values in JSX.
5. **Import Order Standard (§7)**:
   - React / Next.js core → Third-party libraries → Contexts & hooks → Project components → Utilities & constants → Styles.

---

## 5. Step-by-Step Implementation Plan

### Phase 1: Environment & Pre-Flight Validation
1. Verify Node.js version is `>= 20.9.0` (recommended: Node 20.18 LTS or Node 22 LTS).
2. Clean existing build cache: remove `.next`, `out`, and `node_modules`.
3. Create a clean git working branch: `chore/upgrade-next16-react19`.

### Phase 2: Manifest & Dependency Updates
1. Edit `package.json`:
   - Set `"next": "16.4.1"`
   - Set `"react": "19.3.1"`
   - Set `"react-dom": "19.3.1"`
   - Set `"react-draggable": "^4.7.2"`
   - Set `"tailwindcss": "^3.4.17"`
   - Set `"postcss": "^8.4.49"`
   - Set `"autoprefixer": "^10.4.20"`
   - Set `"remark": "^15.0.1"`
   - Set `"remark-html": "^16.0.1"`
   - Set `"gh-pages": "^6.3.0"`
   - Update engines: `"node": ">=20.9.0"`
2. Execute dependency resolution:
   ```bash
   npm install
   ```
   *(If peer dependency warnings arise due to third-party packages catching up with React 19 peer ranges, inspect with `npm install --legacy-peer-deps` or define explicit `overrides` in `package.json`)*.

### Phase 3: Configuration & Build Pipeline Adjustments
1. Review `next.config.js`:
   - Ensure compatibility with Next.js 16 Turbopack compiler.
   - Verify static export options (`output: 'export'`, `images: { unoptimized: true }`, `trailingSlash: true`).
2. Verify `postcss.config.js` and `tailwind.config.js`:
   - Validate that content globs (`./pages/**/*.{js,jsx}`, `./components/**/*.{js,jsx}`) and custom color definitions compile cleanly under PostCSS 8.4.49 and Tailwind 3.4.17.
3. Update GitHub Actions CI/CD workflow (in `.github/workflows/`):
   - Ensure the Node.js setup step uses version `20.x` or `22.x`.

### Phase 4: Codebase Compatibility Review
1. **Window Dragging & Resizing (`components/base/Window.jsx`)**:
   - Confirm `nodeRef` attachment to `<Draggable>` and the target container `<div>`.
   - Ensure `isMaximized`, `isMinimized`, and z-index transitions work seamlessly without React 19 synthetic event warnings.
2. **Context & State Management (`context/WindowManagerContext.jsx`)**:
   - Confirm `useReducer` and `useCallback` hook behaviors adhere to React 19 concurrent dispatch patterns.
3. **Markdown Build Pipeline (`lib/markdown.js`)**:
   - Test `gray-matter`, `remark`, and `remark-html` under Node 20+ runtime for static content compilation in `getStaticProps`.
4. **Dynamic Browser-Only Components (`next/dynamic`)**:
   - Verify `Terminal.jsx` and `Settings.jsx` dynamically imported with `{ ssr: false }` execute without SSR hydration mismatches.

### Phase 5: Build, Static Export & Verification Testing
1. Execute Next.js build:
   ```bash
   npm run build
   ```
2. Verify that the static export outputs cleanly to `./out/`.
3. Validate HTML structure, assets, and metadata:
   - Check that `./out/index.html` is generated with pre-rendered blog data.
   - Check `./out/_next/static/` asset chunks.
   - Check `./out/.nojekyll` creation for GitHub Pages.
4. Test local production preview:
   ```bash
   npx serve out
   ```
5. Test development mode with Turbopack:
   ```bash
   npm run dev
   ```

---

## 6. Verification Checklist

| Area | Check Item | Status |
|---|---|---|
| **Runtime** | Node.js version is `>= 20.9.0` | Pending |
| **Dependencies** | `next` installed at `16.4.1` | Pending |
| **Dependencies** | `react` & `react-dom` installed at `19.3.1` | Pending |
| **Dependencies** | Supporting packages updated to latest stable patches | Pending |
| **Window Shell** | Draggable windows drag, maximize, minimize, and restore smoothly | Pending |
| **Start Menu** | Hierarchical navigation and app launch triggers work properly | Pending |
| **Desktop Dock** | Dock icons reflect running state, click focuses window | Pending |
| **Blog System** | Markdown posts compile and render with proper HTML formatting | Pending |
| **Aesthetics** | Ubuntu font, dark mode styling, and color tokens render correctly | Pending |
| **Static Export** | `npm run build` generates `./out/` with zero errors or warnings | Pending |
| **Coding Standards** | Strict adherence to `frontend_coding_standards.md` | Pending |

---

## 7. Rollback & Contingency Plan

If any critical blocker is identified during deployment testing:
1. **Turbopack Build Issues**: If Turbopack produces an unexpected static bundling issue, pass `--webpack` to `next build` scripts as an immediate workaround.
2. **Peer Dependency Issues**: Use npm `overrides` block in `package.json` to force React 19 resolution across transitive dependencies.
3. **Full Rollback**: Revert `package.json` and `package-lock.json` to previous commit (`git checkout main -- package.json package-lock.json && npm install`).
