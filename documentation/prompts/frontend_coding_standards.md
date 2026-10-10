# Frontend Coding Standards — Next.js / React / Tailwind CSS

> **This document extends the project's core coding standards for the frontend codebase.**
> All rules below are mandatory for the Ubuntu Portfolio simulation project.
> Where a rule conflicts with the Python-focused parent standards, this document takes precedence for `.js`/`.jsx` files.

---

## 1. Component Architecture

### One Component Per File
- Each file exports **exactly one** React component (default export).
- The filename must match the component name: `WindowControls.jsx` → `export default function WindowControls`.
- Co-located styled sub-components (e.g., `WindowTopBar` inside `Window.jsx`) are permitted **only** if they are fewer than 30 lines and tightly coupled. Otherwise, extract to a separate file.

### Functional Components Only
- Use **functional components** with hooks. No class components in new code.
- State: `useState`, `useReducer`
- Side effects: `useEffect`, `useCallback`, `useMemo`
- Context: `useContext`

### Component Ordering (Within a File)
```
1. Imports
2. Constants (non-exported, file-scoped)
3. Component function definition
   a. Hooks (useState, useEffect, useContext, custom hooks)
   b. Event handlers and helper functions
   c. Return statement (JSX)
4. PropTypes / JSDoc (below the component)
5. Default export
```

---

## 2. File & Function Size Limits

| Metric | Limit |
|---|---|
| File length | ≤ **500 lines** (including imports, JSX, comments) |
| Component JSX return | ≤ **50 JSX lines** in the return block. Extract sub-components if exceeding. |
| Helper functions | ≤ **20 lines** of logic (same as Python standard) |
| Props | ≤ **8 props** per component. If more are needed, use a context or compose objects. |

---

## 3. Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Components | PascalCase | `WindowControls.jsx` |
| Hooks | camelCase with `use` prefix | `useWindowManager.js` |
| Event handlers | camelCase with `handle` prefix | `handleMinimize` |
| Constants | UPPER_SNAKE_CASE | `Z_INDEX_BASE` |
| Config keys | camelCase | `desktop_shortcut` (exception: snake_case from config) |
| CSS classes | kebab-case | `window-shadow` |
| Directories | kebab-case or lowercase | `components/base/` |

---

## 4. No Magic Strings or Numbers

- All literal values used in logic must be defined as named constants.
- Constants specific to one file: define at the top of that file.
- Constants shared across files: define in `lib/constants.js`.

```javascript
// ✅ GOOD
const ANIMATION_DURATION_MS = 200;
const BOOT_SCREEN_DELAY_MS = 2000;

// ❌ BAD
setTimeout(() => { ... }, 2000);
```

---

## 5. State Management Rules

- **UI state** (window positions, open/closed, z-index): Use `WindowManagerContext` with `useReducer`.
- **Local component state** (form inputs, hover states, toggles): Use `useState`.
- **Derived state**: Compute in render. Do not store derived values in state.
- **No prop drilling** beyond 2 levels. Use Context instead.

---

## 6. Tailwind CSS Rules

- Prefer Tailwind utility classes over custom CSS.
- Custom CSS is permitted **only** for:
  - Animations / keyframes
  - Pseudo-element styles not covered by Tailwind
  - Scrollbar customization
  - Complex selectors
- Never use inline `style={{ }}` unless computing dynamic values (e.g., z-index, window dimensions).
- Use the project's Ubuntu color tokens (`ub-grey`, `ub-orange`, etc.) — never raw hex in JSX.

---

## 7. Import Order

Enforce this import grouping (separated by blank lines):

```javascript
// 1. React / Next.js core
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// 2. Third-party libraries
import Draggable from 'react-draggable';

// 3. Project contexts and hooks
import { useWindowManager } from '@/hooks/useWindowManager';

// 4. Project components
import Window from '@/components/base/Window';

// 5. Project utilities, constants, config
import { Z_INDEX_BASE } from '@/lib/constants';
import apps from '@/apps.config';

// 6. Styles (CSS imports)
import styles from './Desktop.module.css';
```

---

## 8. Documentation

### JSDoc for Component Props
Every component must have a JSDoc comment describing its purpose and props:

```javascript
/**
 * Renders a draggable, resizable application window.
 *
 * @param {Object} props
 * @param {string} props.appId - Unique identifier for the application
 * @param {string} props.title - Window title bar text
 * @param {boolean} props.isFocused - Whether this window has input focus
 * @param {Function} props.onClose - Callback when close button is clicked
 */
export default function Window({ appId, title, isFocused, onClose }) {
```

### Inline Comments
- Comment the **why**, not the **what**.
- Complex state transitions, z-index calculations, and animation triggers should have brief explanatory comments.

---

## 9. Error Handling

- Wrap dynamic imports and async operations in try/catch.
- Use React Error Boundaries for component-level error isolation.
- Never silently swallow errors. Log to console at minimum.

---

## 10. Performance Guidelines

- Use `React.memo` for components that receive stable props but re-render frequently (e.g., `SideBarApp`).
- Use `useCallback` for event handlers passed as props to memoized children.
- Use `useMemo` for expensive computations (e.g., filtering/sorting app lists).
- Use `next/dynamic` with `{ ssr: false }` for components that access browser APIs (Terminal, Settings).

---

## 11. Accessibility Baseline

- All interactive elements must be keyboard-accessible (`tabIndex`, `onKeyDown`).
- Images must have `alt` text.
- Window close/minimize/maximize buttons must have `aria-label`.
- Use semantic HTML (`<nav>`, `<main>`, `<button>`) where appropriate.

---

## 12. Verification Checklist (Frontend)

Before submitting any frontend code, verify:

| Check | Status |
|---|---|
| One component per file | YES/NO |
| File name matches component name | YES/NO |
| Functional component (no class) | YES/NO |
| JSX return ≤ 50 lines | YES/NO |
| Helper functions ≤ 20 lines | YES/NO |
| File ≤ 500 lines | YES/NO (actual: ___) |
| JSDoc on component | YES/NO |
| No magic strings/numbers | YES/NO |
| Tailwind tokens used (no raw hex) | YES/NO |
| Props ≤ 8 per component | YES/NO |
| No prop drilling > 2 levels | YES/NO |
| DRY compliance | YES/NO |
| YAGNI compliance | YES/NO |
