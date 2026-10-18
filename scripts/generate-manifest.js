/**
 * @file scripts/generate-manifest.js
 * @description Pre-build script to scan content/ directory and generate:
 * 1. public/posts-manifest.json (lightweight metadata catalog)
 * 2. public/sitemap.xml (SEO sitemap for search crawlers)
 * 3. public/posts/[category]/[slug].json (pre-rendered full post payloads for on-demand GUI reader)
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// ─── CONSTANTS ──────────────────────────────────────────────────────
const CONTENT_DIR = path.join(process.cwd(), 'content');
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const POSTS_OUT_DIR = path.join(PUBLIC_DIR, 'posts');
const SITE_URL = 'https://someshchatterjee.com';
const WORDS_PER_MINUTE = 200;
const DEFAULT_AUTHOR = 'Somesh Chatterjee';

/**
 * Estimate reading duration in minutes from text content.
 *
 * @param {string} text - Raw markdown body
 * @returns {string} Human-readable reading time string
 */
function calculateReadTime(text) {
  if (!text || typeof text !== 'string') {
    return '1 min read';
  }
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
  return `${minutes} min read`;
}

/**
 * Compiles markdown body into static HTML string with KaTeX math rendering.
 *
 * @param {string} markdown - Raw markdown text
 * @returns {Promise<string>} Compiled HTML string
 */
async function compileMarkdownToHtml(markdown) {
  if (!markdown) {
    return '';
  }
  try {
    const { remark } = await import('remark');
    const { default: remarkMath } = await import('remark-math');
    const { default: remarkRehype } = await import('remark-rehype');
    const { default: rehypeKatex } = await import('rehype-katex');
    const { default: rehypeStringify } = await import('rehype-stringify');

    const processed = await remark()
      .use(remarkMath)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeKatex, { output: 'htmlAndMathml', strict: false, throwOnError: false })
      .use(rehypeStringify, { allowDangerousHtml: true })
      .process(markdown);

    return processed.toString();
  } catch (error) {
    console.warn('[generate-manifest] Fallback rendering used:', error.message);
    return `<pre>${markdown.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`;
  }
}

/**
 * Generates XML sitemap string from categories and posts.
 *
 * @param {string[]} categories - List of category keys
 * @param {Array<Object>} posts - List of post metadata objects
 * @returns {string} Formatted sitemap.xml content
 */
function generateSitemapXml(categories, posts) {
  const currentDate = new Date().toISOString().split('T')[0];

  const rootUrl = `  <url>\n    <loc>${SITE_URL}/</loc>\n    <lastmod>${currentDate}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>`;

  const categoryUrls = categories.map((cat) => {
    return `  <url>\n    <loc>${SITE_URL}/${cat}/</loc>\n    <lastmod>${currentDate}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`;
  });

  const postUrls = posts
    .filter((post) => post.slug !== 'index')
    .map((post) => {
      const postDate = post.date || currentDate;
      return `  <url>\n    <loc>${SITE_URL}${post.urlPath}</loc>\n    <lastmod>${postDate}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`;
    });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    rootUrl,
    ...categoryUrls,
    ...postUrls,
    '</urlset>',
  ].join('\n');
}

/**
 * Main execution function scanning content/ and generating output files.
 */
async function main() {
  console.log('[generate-manifest] Scanning content directory:', CONTENT_DIR);

  if (!fs.existsSync(CONTENT_DIR)) {
    console.error('[generate-manifest] Content directory does not exist!');
    process.exit(1);
  }

  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  const categoryEntries = fs.readdirSync(CONTENT_DIR, { withFileTypes: true });
  const categories = categoryEntries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  const postsManifest = [];

  for (const category of categories) {
    const categoryDir = path.join(CONTENT_DIR, category);
    const fileEntries = fs.readdirSync(categoryDir, { withFileTypes: true });
    const mdFiles = fileEntries.filter((f) => f.isFile() && f.name.endsWith('.md'));

    const categoryOutDir = path.join(POSTS_OUT_DIR, category);
    if (!fs.existsSync(categoryOutDir)) {
      fs.mkdirSync(categoryOutDir, { recursive: true });
    }

    for (const file of mdFiles) {
      const filePath = path.join(categoryDir, file.name);
      const slug = file.name.replace(/\.md$/, '');
      const rawContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(rawContent);

      const title = data.title || slug.replace(/-/g, ' ');
      const excerpt = data.excerpt || '';
      const date = data.date ? String(data.date) : '';
      const author = data.author || DEFAULT_AUTHOR;
      const tags = Array.isArray(data.tags) ? data.tags : [];
      const readTime = calculateReadTime(content);
      const urlPath = slug === 'index' ? `/${category}/` : `/${category}/${slug}/`;

      const postMetadata = {
        category,
        slug,
        title,
        excerpt,
        date,
        author,
        tags,
        readTime,
        urlPath,
      };

      postsManifest.push(postMetadata);

      // Pre-compile post HTML and save standalone JSON for client-side loading
      const htmlContent = await compileMarkdownToHtml(content);
      const postPayload = {
        ...postMetadata,
        rawContent: content,
        htmlContent,
      };

      const postJsonPath = path.join(categoryOutDir, `${slug}.json`);
      fs.writeFileSync(postJsonPath, JSON.stringify(postPayload, null, 2), 'utf8');
    }
  }

  // Sort manifest by date descending (secondary sort by title)
  postsManifest.sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    if (dateB !== dateA) return dateB - dateA;
    return a.title.localeCompare(b.title);
  });

  // Write public/posts-manifest.json
  const manifestPath = path.join(PUBLIC_DIR, 'posts-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(postsManifest, null, 2), 'utf8');
  console.log(`[generate-manifest] Generated ${postsManifest.length} posts in ${manifestPath}`);

  // Write public/sitemap.xml
  const sitemapXml = generateSitemapXml(categories, postsManifest);
  const sitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapXml, 'utf8');
  console.log(`[generate-manifest] Generated sitemap in ${sitemapPath}`);
}

main().catch((err) => {
  console.error('[generate-manifest] Error generating manifest:', err);
  process.exit(1);
});
