/**
 * @file pages/[category]/[slug].jsx
 * @description Semantic static shell entry point providing full-text SEO indexation
 * and automated Ubuntu terminal launching for discrete article deep-links.
 */

// 1. React / Next.js core
import React from 'react';
import fs from 'fs';
import path from 'path';

// 2. Third-party libraries
import matter from 'gray-matter';

// 4. Project components
import Meta from '../../components/seo/Meta';
import Ubuntu from '../../components/Ubuntu';

// 5. Project utilities, constants, config
import { SITE_URL } from '../../lib/constants';
import { markdownToHtml } from '../../lib/markdown';
import postsManifest from '../../public/posts-manifest.json';

// 2. Constants (File-scoped)
const CONTENT_DIR_NAME = 'content';

/**
 * Generates static paths using the pre-compiled in-memory manifest.
 * Filters out index.md entries to avoid routing conflicts with category landing routes.
 *
 * @returns {Promise<{ paths: Array<{ params: { category: string, slug: string } }>, fallback: boolean }>}
 */
export async function getStaticPaths() {
  const paths = postsManifest
    .filter((post) => post.slug !== 'index')
    .map((post) => ({
      params: {
        category: post.category,
        slug: post.slug,
      },
    }));

  return { paths, fallback: false };
}

/**
 * Loads and converts ONLY this specific article's markdown at build time.
 * Bypasses heavy multi-page serialization bottlenecks.
 *
 * @param {Object} context
 * @param {Object} context.params
 * @param {string} context.params.category - Target category directory
 * @param {string} context.params.slug - Target post slug identifier
 * @returns {Promise<Object>} Next.js static page props
 */
export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), CONTENT_DIR_NAME, params.category, `${params.slug}.md`);

  if (!fs.existsSync(filePath)) {
    return { notFound: true };
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  // Compile markdown to static HTML string with KaTeX math rendering
  const articleHtml = await markdownToHtml(content);

  return {
    props: {
      postData: {
        title: data.title || params.slug.replace(/-/g, ' '),
        excerpt: data.excerpt || '',
        date: data.date ? String(data.date) : '',
        author: data.author || 'Somesh Chatterjee',
        tags: Array.isArray(data.tags) ? data.tags : [],
        category: params.category,
        slug: params.slug,
        rawContent: content,
        articleHtml,
      },
    },
  };
}

/**
 * ArticleBootPage component rendering pre-rendered full semantic HTML for bots
 * and launching the interactive Ubuntu desktop with the Terminal window for users.
 *
 * @param {Object} props
 * @param {Object} props.postData - Structured article payload from getStaticProps
 * @returns {JSX.Element} Page view
 */
export default function ArticleBootPage({ postData }) {
  const canonicalUrl = `${SITE_URL}/${postData.category}/${postData.slug}/`;

  return (
    <>
      <Meta
        title={`${postData.title} | Somesh Chatterjee`}
        description={postData.excerpt}
        canonicalUrl={canonicalUrl}
      />

      {/* Semantic Full-Text Fallback: Indexed by Googlebot, Bingbot, and Screen Readers */}
      <section className="sr-only" aria-label="Article content for search crawlers and screen readers">
        <article>
          <h1>{postData.title}</h1>
          <p>{postData.excerpt}</p>
          <time dateTime={postData.date}>{postData.date}</time>
          <span>Author: {postData.author}</span>
          {Array.isArray(postData.tags) && postData.tags.length > 0 && (
            <div>Tags: {postData.tags.join(', ')}</div>
          )}
          {/* Complete article body HTML rendered statically in initial response */}
          <div dangerouslySetInnerHTML={{ __html: postData.articleHtml }} />
        </article>
      </section>

      {/* Interactive Ubuntu Desktop Simulation */}
      <Ubuntu
        initialBootApp="terminal"
        initialBootSlug={postData.slug}
        initialBootCategory={postData.category}
        initialContent={postData.rawContent}
        initialTitle={postData.title}
      />
    </>
  );
}
