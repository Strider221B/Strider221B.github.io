# Ubuntu Desktop Portfolio — Somesh Chatterjee

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?style=flat-square&logo=react)](https://react.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)
[![GitHub Pages](https://img.shields.io/badge/Deployed-GitHub_Pages-blue?style=flat-square&logo=github)](https://strider221b.github.io/)

A personal portfolio website simulating an **Ubuntu 26.04.1 LTS** desktop environment built with **Next.js (Pages Router)**, **React**, and **Tailwind CSS**. It showcases projects, technical blog posts, and background information through an interactive window manager and desktop metaphor.

*Inspired by [vivek9patel/vivek9patel.github.io](https://github.com/vivek9patel/vivek9patel.github.io).*

---

## Table of Contents

- [Features](#features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Project Directory Structure](#project-directory-structure)
- [Getting Started (Local Setup)](#getting-started-local-setup)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Development Server](#running-the-development-server)
  - [Building for Production & Static Export](#building-for-production--static-export)
  - [Deployment](#deployment)
- [Application & Menu Configuration](#application--menu-configuration)
  - [Central Registry (`apps.config.js`)](#central-registry-appsconfigjs)
  - [Adding a New Application](#adding-a-new-application)
- [Content Management (Markdown Blog System)](#content-management-markdown-blog-system)
  - [Authoring New Posts](#authoring-new-posts)
  - [Post Metadata Schema](#post-metadata-schema)
- [Window Management & State](#window-management--state)
- [Contributing & Standards](#contributing--standards)
- [License & Attribution](#license--attribution)

---

## Features

- **Ubuntu Desktop Environment**:
  - **Boot & Lock Screens**: Realistic Ubuntu boot animation and interactive lock screen with authentication transitions.
  - **Top Navbar**: Status indicator, real-time clock, quick power / status panel (lock, shut down).
  - **Unity / GNOME Side Dock**: Pinned launcher favorites, active application indicator pips, focus highlights, and non-blocking hover tooltips.
  - **Application Launcher & Start Menu**: Searchable all-applications overlay and hierarchical nested Start Menu (`Technology` subfolders).
  - **Desktop Workspace**: Double-clickable desktop shortcuts, right-click context menu (wallpaper rotation, open terminal, show desktop).
- **Window Management Primitives**:
  - Draggable, resizable, minimizable, and maximizable window frames.
  - Dynamic z-index layering and window focus management.
  - Snap-to-edge and dual-click title bar maximize toggle.
- **Built-in System Applications**:
  - **Terminal**: Interactive CLI emulator with bash prompt.
  - **Settings**: Wallpaper customization and system preferences.
  - **Trash**: Ubuntu trash bin simulation.
  - **MarkdownViewer**: Typography-rich reader supporting font scaling (`A` / `A+`) and direct GitHub source sharing with clipboard integration.
  - **BlogListApp**: Categorized article feeds with instant keyword search and tag filtering.

---

## Architecture & Tech Stack

| Layer | Technology | Details |
|---|---|---|
| **Framework** | [Next.js 14](https://nextjs.org/) | Pages Router with static HTML export (`output: 'export'`) |
| **UI Library** | [React 18](https://reactjs.org/) | Functional components and hooks (`useReducer`, `useMemo`, `useCallback`) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) | Custom Ubuntu color palette (`ub-orange`, `ub-grey`, etc.) |
| **Window Interactions** | [react-draggable](https://github.com/react-grid-layout/react-draggable) | Drag handling for window shells |
| **Content Pipeline** | `gray-matter`, `remark`, `remark-html` | Build-time Markdown parsing and static HTML generation |
| **Deployment** | [GitHub Pages](https://pages.github.com/) | Static hosting via `username.github.io` |

### Key Design Decisions
1. **Pages Router (SSG)**: Entire site compiles to a pure static Single-Page Application (`out/`) served directly by GitHub Pages without requiring a Node.js runtime server.
2. **React Context State**: Light-weight, centralized `WindowManagerContext` backed by `useReducer` to manage window positions, minimize/maximize states, focus stacks, and dock bindings without third-party state libraries.
3. **Pure Data Configuration**: Application metadata and Start Menu hierarchy are isolated in `apps.config.js`, decoupled from React component definitions via `lib/componentRegistry.js`.

---

## Project Directory Structure

```text
Strider221B.github.io/
├── apps.config.js                  # Central app registry & Start Menu tree
├── content/                        # Markdown blog & page content
│   ├── about-me/                   # Profile & bio markdown documents
│   ├── data-science/               # Data Science articles
│   ├── machine-learning/           # Machine Learning articles
│   ├── programming/                # Software engineering articles
│   └── psychology/                 # Psychology & cognitive science articles
├── components/
│   ├── apps/                       # Application windows (Terminal, Settings, MarkdownViewer, etc.)
│   ├── base/                       # Window shells, title bars, and dock icon primitives
│   ├── screen/                     # Full-screen layers (BootScreen, LockScreen, Desktop, SideBar, etc.)
│   ├── seo/                        # Meta tags and OpenGraph headers
│   ├── util/                       # Clocks, status cards, and attribution elements
│   └── Ubuntu.jsx                  # Root system orchestrator component
├── context/
│   └── WindowManagerContext.jsx    # React Context for window state management
├── hooks/
│   ├── useWindowManager.js         # Window manager actions hook
│   └── useMarkdownLoader.js        # Content loader hook
├── lib/
│   ├── constants.js                # System constants, action types, and URLs
│   ├── componentRegistry.js        # Dynamic app component loader registry
│   └── markdown.js                 # Build-time Markdown parsing pipeline
├── pages/
│   ├── _app.js                     # Root layout & global style imports
│   ├── _document.js                # HTML head tags & font imports
│   └── index.js                    # SSG entry point running getStaticProps()
├── public/
│   ├── themes/Yaru/                # Canonical Ubuntu Yaru icon theme assets
│   ├── wallpapers/                 # Desktop wallpaper images
│   └── .nojekyll                   # Prevents Jekyll static processing on GitHub Pages
├── styles/
│   └── globals.css                 # Custom Ubuntu typography and Tailwind directives
├── next.config.js                  # Next.js static export configuration
└── tailwind.config.js              # Ubuntu color tokens and theme extensions
```

---

## Getting Started (Local Setup)

### Prerequisites

- **Node.js**: `v18.x` or higher (Node `v20.x` recommended)
- **npm**: `v9.x` or higher (bundled with Node.js)
- **Git**

Verify your local installation:
```bash
node -v
npm -v
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Strider221B/Strider221B.github.io.git
   cd Strider221B.github.io
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

Start the Next.js local development server:
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

The application will hot-reload whenever you edit files in `components/`, `pages/`, `styles/`, or `content/`.

### Building for Production & Static Export

To create an optimized production static build:
```bash
npm run build
```

This compiles all Markdown files at build time via `getStaticProps`, bundles styles and JavaScript chunks, and generates a pre-rendered static export in the `out/` directory.

### Deployment

Deploying to GitHub Pages (`username.github.io`):
```bash
npm run deploy
```

This runs the static export build, generates `out/.nojekyll`, and publishes the bundle to the repository's `gh-pages` branch.

---

## Application & Menu Configuration

### Central Registry (`apps.config.js`)

All applications, desktop shortcuts, and dock favorites are registered in `apps.config.js`:

```javascript
// apps.config.js
export const APP_TYPES = {
  WINDOW: 'window',
  FOLDER: 'folder',
  EXTERNAL: 'external',
};

const apps = [
  {
    id: 'terminal',
    title: 'Terminal',
    icon: '/themes/Yaru/apps/bash.png',
    type: APP_TYPES.WINDOW,
    component: 'Terminal',
    favourite: true,          // Shows in SideBar dock
    desktop_shortcut: false,  // Shows on Desktop grid
    disabled: false,
  },
  // ...
];
```

### Adding a New Application

To introduce a new application to the desktop:

1. **Create the Component**: Create `components/apps/MyNewApp.jsx`.
2. **Register in Component Registry**: Add dynamic import in `lib/componentRegistry.js`:
   ```javascript
   MyNewApp: dynamic(() => import('../components/apps/MyNewApp'), { ssr: false }),
   ```
3. **Register in `apps.config.js`**: Add an entry into the `apps` array:
   ```javascript
   {
     id: 'my-app',
     title: 'My Application',
     icon: '/themes/Yaru/apps/accessories-calculator.png',
     type: APP_TYPES.WINDOW,
     component: 'MyNewApp',
     favourite: true,
     desktop_shortcut: true,
     disabled: false,
   }
   ```
4. **(Optional) Add to Start Menu**: Include `{ appId: 'my-app' }` in `startMenuTree` in `apps.config.js`.

---

## Content Management (Markdown Blog System)

### Authoring New Posts

Blog posts are authored as Markdown documents inside topic folders under `content/`:
- `content/data-science/`
- `content/machine-learning/`
- `content/programming/`
- `content/psychology/`
- `content/about-me/`

### Post Metadata Schema

Every post contains YAML frontmatter:

```markdown
---
title: "Understanding Transformer Attention Mechanisms"
date: "2026-03-15"
author: "Somesh Chatterjee"
tags: ["machine-learning", "transformers", "nlp"]
excerpt: "A deep dive into self-attention, multi-head projections, and architectural optimizations."
---

# Introduction

Content written here is compiled to static HTML at build time...
```

When opened in `MarkdownViewer`, readers can click **Share** to copy the exact permalink pointing to the Markdown source file on GitHub.

---

## Window Management & State

Window state is managed through `WindowManagerContext.jsx` using the `useWindowManager()` hook:

- `openApp(appId)`: Launches an app window, restores if minimized, and brings to top focus.
- `closeApp(appId)`: Closes and removes the window from the active DOM stack.
- `minimizeApp(appId)`: Conceals the window while preserving state and shifts focus to next topmost window.
- `maximizeApp(appId)` / `restoreApp(appId)`: Toggles viewport expansion.
- `focusApp(appId)`: Elevates window z-index to top of stack.

---

## Contributing & Standards

When submitting changes, ensure adherence to:
- [Architecture & Design Guide](./documentation/design/01_architecture_overview.md)
- [Frontend Coding Standards](./documentation/prompts/frontend_coding_standards.md)
  - Functional components with React hooks.
  - File lengths $\le 500$ lines, component JSX returns $\le 50$ lines.
  - No raw hex colors in JSX; use Ubuntu color tokens (`ub-orange`, `ub-grey`, etc.).
  - Proper JSDoc comments on all exported components.

---

## License & Attribution

- **License**: Released under the [MIT License](./LICENSE).
- **Inspiration**: Design and concept inspired by [Vivek Patel's Ubuntu Web Desktop](https://github.com/vivek9patel/vivek9patel.github.io).
- **Icons**: Canonical Ubuntu [Yaru Icon Theme](https://github.com/ubuntu/yaru).