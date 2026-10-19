/**
 * @file pages/index.js
 * @description Main entry point for the Ubuntu desktop web portfolio.
 * Loads lightweight metadata catalog from posts-manifest.json to avoid homepage payload bloat
 * while pre-rendering the initial "about-me" profile window.
 */

// 1. React / Next.js core
import React from 'react';

// 4. Project components
import Meta from '../components/seo/Meta';
import Ubuntu from '../components/Ubuntu';

// 5. Project utilities, constants, config
import { getPostBySlug, buildContentMapFromManifest } from '../lib/markdown';
import postsManifest from '../public/posts-manifest.json';

/**
 * Build-time static prop generation for markdown portfolio content.
 * Groups posts from posts-manifest.json into lightweight category arrays
 * and loads full content only for the default initial "about-me" window.
 *
 * @returns {Promise<{ props: { contentMap: Record<string, Array<Object>> } }>} Static page props
 */
export async function getStaticProps() {
  // Load full content ONLY for default open "about-me" window to keep homepage payload minimal (< 10 kB)
  const aboutMePost = await getPostBySlug('about-me', 'index');
  const contentMap = buildContentMapFromManifest(postsManifest, aboutMePost);

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
 * @param {Record<string, Array<Object>>} [props.contentMap={}] - Lightweight content map keyed by category
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
