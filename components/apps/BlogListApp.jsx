/**
 * @file components/apps/BlogListApp.jsx
 * @description Lists technical blog posts for a selected category with excerpt and date previews.
 */

// 1. React / Next.js core
import React from 'react';

// 3. Component function definition
/**
 * Renders the category article feed window.
 *
 * @param {Object} props
 * @param {string} [props.category] - Topic category key
 * @param {Record<string, Array<Object>>} [props.contentMap={}] - Markdown content map
 * @returns {JSX.Element} Category blog post listing
 */
export default function BlogListApp({ category, contentMap = {} }) {
  const posts = contentMap[category] || [];

  return (
    <div className="p-6 text-white max-w-2xl mx-auto">
      <h2 className="text-xl font-bold capitalize mb-4 text-ub-orange border-b border-white/10 pb-2">
        {category ? category.replace('-', ' ') : 'Articles'}
      </h2>
      {posts.length === 0 ? (
        <p className="text-sm text-white/60">
          No articles published in this category yet.
        </p>
      ) : (
        <div className="space-y-4">
          {posts.map((post, idx) => (
            <article key={idx} className="p-4 rounded-lg bg-white/5 border border-white/10">
              <h3 className="font-semibold text-base text-white">{post.title}</h3>
              <p className="text-xs text-white/50 mt-1">{post.date}</p>
              <p className="text-sm text-white/80 mt-2">{post.excerpt}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
