/**
 * @file components/apps/MarkdownViewer.jsx
 * @description Markdown content viewer window component rendering formatted articles and profile text.
 */

// 1. React / Next.js core
import React from 'react';

// 3. Component function definition
/**
 * Renders markdown formatted document or portfolio profile inside an application window.
 *
 * @param {Object} props
 * @param {string} [props.contentPath] - Key to content document
 * @param {Record<string, Array<Object>>} [props.contentMap={}] - Loaded content map
 * @returns {JSX.Element} Markdown document display
 */
export default function MarkdownViewer({ contentPath, contentMap = {} }) {
  return (
    <article className="p-8 max-w-3xl mx-auto text-ubt-grey font-sans select-text">
      <h1 className="text-3xl font-bold text-white mb-4 border-b border-white/20 pb-2">
        About Me
      </h1>
      <p className="text-base leading-relaxed text-white/90 mb-4">
        Welcome to my interactive Ubuntu desktop portfolio!
      </p>
      <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
        <h2 className="text-lg font-semibold text-ub-orange mb-2">
          System Overview
        </h2>
        <p className="text-sm text-white/80">
          This simulation provides a full-fidelity Ubuntu Linux desktop experience inside your web browser.
          You can launch applications, move and resize windows, switch themes, and read technical articles.
        </p>
      </div>
    </article>
  );
}
