/**
 * @file pages/_app.js
 * @description Custom Next.js App component providing global layout, CSS imports,
 * and page lifecycle management.
 */

// 1. React / Next.js core
import React from 'react';

// 6. Styles (CSS imports)
import 'katex/dist/katex.min.css';
import '../styles/globals.css';

/**
 * Root Next.js App wrapper component.
 *
 * @param {Object} props
 * @param {React.ComponentType} props.Component - Active page component to render
 * @param {Object} props.pageProps - Initial props passed to the active page
 * @returns {JSX.Element} The rendered application page
 */
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
