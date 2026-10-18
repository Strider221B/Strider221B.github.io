/**
 * @file pages/[category]/index.jsx
 * @description Category landing route providing category-level SEO indexation
 * and automated Ubuntu terminal directory listing for topics.
 */

// 1. React / Next.js core
import React from 'react';

// 4. Project components
import Meta from '../../components/seo/Meta';
import Ubuntu from '../../components/Ubuntu';

// 5. Project utilities, constants, config
import { SITE_URL } from '../../lib/constants';
import postsManifest from '../../public/posts-manifest.json';

// 2. Constants (File-scoped)
const CATEGORY_TITLES = {
  'about-me': 'About Me & Professional Profile',
  'data-science': 'Data Science & Analytics Architecture',
  'machine-learning': 'Machine Learning & Deep Learning',
  'programming': 'Software Engineering & Systems Programming',
  'psychology': 'Behavioral Psychology & Cognitive Science',
};

const CATEGORY_DESCRIPTIONS = {
  'about-me': 'Professional background, leadership experience, and technical portfolio of Somesh Chatterjee.',
  'data-science': 'Technical articles and deep dives into scalable columnar architectures, Arrow, DuckDB, and time-series forecasting.',
  'machine-learning': 'Exploring neural network implementations, transformer architectures, and attention mechanisms from first principles.',
  'programming': 'Modern React patterns, deterministic state management, async Rust concurrency, and systems architecture.',
  'psychology': 'Essays on cognitive bias, the primacy effect, rapid habit formation, and strategic workplace innovation.',
};

/**
 * Generates static paths for all content category directories.
 *
 * @returns {Promise<{ paths: Array<{ params: { category: string } }>, fallback: boolean }>}
 */
export async function getStaticPaths() {
  const categorySet = new Set(postsManifest.map((p) => p.category));
  const paths = Array.from(categorySet).map((category) => ({
    params: { category },
  }));

  return { paths, fallback: false };
}

/**
 * Retrieves category metadata and list of published articles for this hub.
 *
 * @param {Object} context
 * @param {Object} context.params
 * @param {string} context.params.category - Category identifier
 * @returns {Promise<Object>} Static page props
 */
export async function getStaticProps({ params }) {
  const category = params.category;
  const posts = postsManifest.filter((p) => p.category === category);
  const formattedCategory = category.replace(/-/g, ' ');
  const title = CATEGORY_TITLES[category] || `${formattedCategory} Articles`;
  const description =
    CATEGORY_DESCRIPTIONS[category] ||
    `Browse technical articles and publications in ${formattedCategory} by Somesh Chatterjee.`;

  return {
    props: {
      categoryData: {
        category,
        title,
        description,
        posts,
      },
    },
  };
}

/**
 * CategoryBootPage component rendering pre-rendered category hub indexation
 * and launching the Ubuntu terminal with directory listing command.
 *
 * @param {Object} props
 * @param {Object} props.categoryData - Category metadata and articles list
 * @returns {JSX.Element} Page view
 */
export default function CategoryBootPage({ categoryData }) {
  const canonicalUrl = `${SITE_URL}/${categoryData.category}/`;
  const initialCommand = `ls -la ~/articles/${categoryData.category}`;

  return (
    <>
      <Meta
        title={`${categoryData.title} | Somesh Chatterjee`}
        description={categoryData.description}
        canonicalUrl={canonicalUrl}
      />

      {/* Semantic Fallback for Category Indexation */}
      <section className="sr-only" aria-label={`Category overview for ${categoryData.category}`}>
        <h1>{categoryData.title}</h1>
        <p>{categoryData.description}</p>
        <nav aria-label="Category articles list">
          <ul>
            {categoryData.posts.map((post) => (
              <li key={post.slug}>
                <a href={post.urlPath}>
                  <h2>{post.title}</h2>
                </a>
                <p>{post.excerpt}</p>
                <time dateTime={post.date}>{post.date}</time>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      {/* Interactive Ubuntu Desktop Simulation */}
      <Ubuntu
        initialBootApp="terminal"
        initialBootCategory={categoryData.category}
        initialCommand={initialCommand}
        initialTitle={categoryData.title}
      />
    </>
  );
}
