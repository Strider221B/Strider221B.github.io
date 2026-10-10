/**
 * @file lib/componentRegistry.js
 * @description Maps string component keys from apps.config.js to dynamically imported React components.
 * Prevents circular dependencies and enables client-side code splitting with ssr: false.
 */

import dynamic from 'next/dynamic';

/**
 * Registry mapping string identifier keys to dynamically loaded app components.
 * ssr: false ensures browser-dependent components (DOM, localStorage, canvas) load purely on the client.
 */
const componentRegistry = {
  Terminal: dynamic(() => import('../components/apps/Terminal'), { ssr: false }),
  Settings: dynamic(() => import('../components/apps/Settings'), { ssr: false }),
  Trash: dynamic(() => import('../components/apps/Trash'), { ssr: false }),
  MarkdownViewer: dynamic(() => import('../components/apps/MarkdownViewer'), { ssr: false }),
  BlogListApp: dynamic(() => import('../components/apps/BlogListApp'), { ssr: false }),
};

/**
 * Look up and return a dynamically loaded React component by its registry key name.
 *
 * @param {string} name - Registry key matching an app configuration's `component` field
 * @returns {React.ComponentType|null} The dynamic React component or null if not registered
 */
export function getComponent(name) {
  return componentRegistry[name] || null;
}

export default componentRegistry;
