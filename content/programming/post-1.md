---
title: "Modern React Architecture: Context, Reducers & Custom Hooks"
date: "2025-09-05"
tags: ["react", "javascript", "architecture", "state-management"]
excerpt: "Structuring maintainable React applications with deterministic state management patterns and zero external overhead."
author: "Somesh Chatterjee"
---

# Modern React Architecture: Context, Reducers & Custom Hooks

When building complex interactive web applications—such as browser-based desktop simulations—managing UI state cleanly without external state bloat is essential.

---

## The Power of `useReducer` + `useContext`

For window managers or complex multi-step interfaces, treating state transitions as discrete, dispatched action objects guarantees predictability.

```javascript
// Action types as clear constants
const ACTIONS = {
  OPEN_APP: 'OPEN_APP',
  CLOSE_APP: 'CLOSE_APP',
  FOCUS_APP: 'FOCUS_APP',
};

function windowReducer(state, action) {
  switch (action.type) {
    case ACTIONS.OPEN_APP:
      return {
        ...state,
        openWindows: { ...state.openWindows, [action.payload]: true },
        focusedApp: action.payload,
      };
    case ACTIONS.CLOSE_APP:
      return {
        ...state,
        openWindows: { ...state.openWindows, [action.payload]: false },
      };
    default:
      return state;
  }
}
```

---

## Encapsulating Logic in Custom Hooks

Consumers of the context should never need to know the internal action shapes. Providing semantic, ergonomic helper methods via custom hooks encapsulates details cleanly:

```javascript
export function useWindowManager() {
  const context = useContext(WindowManagerContext);
  if (!context) {
    throw new Error("useWindowManager must be used within WindowManagerProvider");
  }
  return context;
}
```

---

## Architectural Rules for Long-Term Health

1. **One Component per File**: Keeps modules focused and testable.
2. **Strict File Size Limits**: Break components that exceed 500 lines into sub-components.
3. **No Magic Strings**: Store actions, storage keys, and constants in dedicated configuration registries.
