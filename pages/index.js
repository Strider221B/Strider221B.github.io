/**
 * @file pages/index.js
 * @description Main entry point for the Ubuntu desktop web portfolio.
 * Statically loads markdown content at build time and renders the Ubuntu root component.
 */

// 1. React / Next.js core
import React from 'react';

// 4. Project components
import Meta from '../components/seo/Meta';
import Ubuntu from '../components/Ubuntu';

// 5. Project utilities, constants, config
import { getAllContentMap } from '../lib/markdown';

/**
 * Build-time static prop generation for markdown portfolio content.
 * Returns initial contentMap mapping categories to blog posts.
 *
 * @returns {Promise<{ props: { contentMap: Record<string, Array<Object>> } }>} Static page props
 */
export async function getStaticProps() {
  const contentMap = await getAllContentMap();

  return {
    props: {
      contentMap,
    },
  };
}

/**
 * HomePage root page rendering the Ubuntu desktop simulation.
 *
 * @param {Object} props
 * @param {Record<string, Array<Object>>} [props.contentMap={}] - Markdown content map keyed by category
 * @returns {JSX.Element} The rendered Ubuntu desktop interface
 */
export default function Index({ contentMap = {} }) {
  return (
    <>
      <Meta />
      <Ubuntu contentMap={contentMap} />
    </>
  );
}
