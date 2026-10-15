/**
 * @file components/seo/Meta.jsx
 * @description Comprehensive SEO metadata and Social Card (OpenGraph, Twitter, JSON-LD)
 * component for Next.js static portfolio pages.
 */

// 1. React / Next.js core
import React from 'react';
import Head from 'next/head';

// 2. Constants (File-scoped defaults)
const DEFAULT_TITLE = 'Somesh Chatterjee | Ubuntu 26.04.1 LTS Desktop Portfolio & Tech Blog';
const DEFAULT_DESCRIPTION =
  'Interactive Ubuntu 26.04.1 LTS desktop portfolio and technical blog of Somesh Chatterjee. Exploring Machine Learning, Data Science, and Systems Engineering.';
const DEFAULT_CANONICAL = 'https://strider221b.github.io/';
const DEFAULT_OG_IMAGE = 'https://strider221b.github.io/wallpapers/ubuntu-default.webp';
const DEFAULT_KEYWORDS =
  'Somesh Chatterjee, Portfolio, Ubuntu, Linux, Data Science, Machine Learning, Deep Learning, Python, Next.js, Developer';
const DEFAULT_AUTHOR = 'Somesh Chatterjee';
const THEME_COLOR = '#E95420';
const SITE_NAME = 'Somesh Chatterjee Portfolio';
const TWITTER_CARD_TYPE = 'summary_large_image';
const TWITTER_CREATOR = '@Strider221B';

/**
 * Generates JSON-LD structured schema for search engines (Person and WebSite).
 *
 * @param {string} canonical - Current canonical URL
 * @returns {Object} JSON-LD structured schema object
 */
function getStructuredSchema(canonical) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${canonical}#website`,
        url: canonical,
        name: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
      },
      {
        '@type': 'Person',
        '@id': `${canonical}#person`,
        name: DEFAULT_AUTHOR,
        url: canonical,
        jobTitle: 'Data Scientist & Machine Learning Engineer',
        sameAs: [
          'https://github.com/Strider221B',
          'https://linkedin.com/in/somesh-chatterjee',
        ],
      },
    ],
  };
}

// 3. Component function definition
/**
 * Renders document head SEO tags, social graph tags, and JSON-LD schema.
 *
 * @param {Object} props
 * @param {string} [props.title] - Page title tag
 * @param {string} [props.description] - Meta description text
 * @param {string} [props.canonicalUrl] - Canonical URL for current page
 * @param {string} [props.ogImage] - Social share preview image URL
 * @param {string} [props.keywords] - Comma-delimited SEO keywords
 * @param {string} [props.author] - Content author name
 * @returns {JSX.Element} Next.js Head element with injected meta tags
 */
export default function Meta({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  canonicalUrl = DEFAULT_CANONICAL,
  ogImage = DEFAULT_OG_IMAGE,
  keywords = DEFAULT_KEYWORDS,
  author = DEFAULT_AUTHOR,
}) {
  const schema = getStructuredSchema(canonicalUrl);

  return (
    <Head>
      {/* Primary HTML Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="theme-color" content={THEME_COLOR} />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content="Ubuntu 26.04.1 LTS Desktop Simulation" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content={TWITTER_CARD_TYPE} />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:creator" content={TWITTER_CREATOR} />

      {/* Apple & Mobile Web App Meta */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Ubuntu Desktop" />

      {/* Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
}
