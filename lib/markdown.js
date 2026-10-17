/**
 * @file lib/markdown.js
 * @description Build-time Markdown parsing pipeline for the Ubuntu desktop portfolio blog system.
 * Reads Markdown documents, extracts YAML frontmatter via gray-matter, and compiles Markdown
 * bodies to static HTML strings via remark, rehype, and KaTeX.
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';

import { DEFAULT_USER_NAME } from './constants.js';

// ─── CONSTANTS ──────────────────────────────────────────────────────

const CONTENT_DIR_NAME = 'content';
const WORDS_PER_MINUTE = 200;
const MARKDOWN_FILE_EXT = '.md';

const DEFAULT_CATEGORIES = [
  'about-me',
  'data-science',
  'machine-learning',
  'programming',
  'psychology',
];

const KATEX_OPTIONS = {
  output: 'htmlAndMathml',
  strict: false,
  throwOnError: false,
};

const REHYPE_OPTIONS = {
  allowDangerousHtml: true,
};

// ─── HELPER FUNCTIONS ───────────────────────────────────────────────

/**
 * Resolve absolute directory path to the root content directory.
 *
 * @returns {string} Absolute path to the content directory
 */
export function getContentDirectory() {
  return path.join(process.cwd(), CONTENT_DIR_NAME);
}

/**
 * Estimate reading duration in minutes from text content.
 *
 * @param {string} text - Raw markdown body
 * @returns {string} Human-readable reading time string
 */
export function calculateReadTime(text) {
  if (!text || typeof text !== 'string') {
    return '1 min read';
  }
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
  return `${minutes} min read`;
}

/**
 * Compile raw Markdown string into sanitized static HTML string with KaTeX math rendering.
 *
 * @param {string} markdown - Markdown text
 * @returns {Promise<string>} Compiled HTML markup with pre-rendered KaTeX symbols
 */
export async function markdownToHtml(markdown) {
  if (!markdown) {
    return '';
  }
  const processed = await remark()
    .use(remarkMath)
    .use(remarkRehype, REHYPE_OPTIONS)
    .use(rehypeKatex, KATEX_OPTIONS)
    .use(rehypeStringify, REHYPE_OPTIONS)
    .process(markdown);

  return processed.toString();
}

/**
 * Parse an individual Markdown file into a structured post object.
 *
 * @param {string} filePath - Absolute file path to markdown document
 * @param {string} slug - URL-safe post slug identifier
 * @param {string} category - Category directory identifier
 * @returns {Promise<Object>} Structured post data object
 */
export async function parseMarkdownFile(filePath, slug, category) {
  try {
    const fileContents = await fs.promises.readFile(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    const htmlContent = await markdownToHtml(content);
    const readTime = calculateReadTime(content);
    const relativePath = path.relative(process.cwd(), filePath).split(path.sep).join('/');

    return {
      slug,
      category,
      filePath: relativePath,
      title: data.title || slug.replace(/-/g, ' '),
      date: data.date ? String(data.date) : '',
      excerpt: data.excerpt || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      author: data.author || DEFAULT_USER_NAME,
      readTime,
      htmlContent,
      rawContent: content,
    };
  } catch (error) {
    console.error(`[lib/markdown] Failed to parse Markdown file at "${filePath}":`, error.message);
    throw error;
  }
}

/**
 * Retrieve all blog post objects for a specific category directory, sorted descending by date.
 *
 * @param {string} category - Category directory name
 * @returns {Promise<Array<Object>>} List of sorted blog post objects
 */
export async function getPostsByCategory(category) {
  const categoryDir = path.join(getContentDirectory(), category);

  if (!fs.existsSync(categoryDir)) {
    return [];
  }

  const entries = await fs.promises.readdir(categoryDir, { withFileTypes: true });
  const postFiles = entries.filter(
    (entry) => entry.isFile() && entry.name.endsWith(MARKDOWN_FILE_EXT)
  );

  const posts = await Promise.all(
    postFiles.map(async (file) => {
      const slug = file.name.replace(new RegExp(`\\${MARKDOWN_FILE_EXT}$`), '');
      const filePath = path.join(categoryDir, file.name);
      return parseMarkdownFile(filePath, slug, category);
    })
  );

  return posts.sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA;
  });
}

/**
 * Retrieve a specific single blog post by its category and slug.
 *
 * @param {string} category - Category directory name
 * @param {string} slug - Post slug name
 * @returns {Promise<Object|null>} Post object or null if not found
 */
export async function getPostBySlug(category, slug) {
  const filePath = path.join(getContentDirectory(), category, `${slug}${MARKDOWN_FILE_EXT}`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return parseMarkdownFile(filePath, slug, category);
}

/**
 * Traverse content directory and construct complete contentMap keyed by category.
 * Used at build time inside Next.js getStaticProps.
 *
 * @returns {Promise<Record<string, Array<Object>>>} Map of category keys to array of posts
 */
export async function getAllContentMap() {
  const contentDir = getContentDirectory();
  const contentMap = {};

  // Ensure default categories are represented
  DEFAULT_CATEGORIES.forEach((cat) => {
    contentMap[cat] = [];
  });

  if (!fs.existsSync(contentDir)) {
    return contentMap;
  }

  const entries = await fs.promises.readdir(contentDir, { withFileTypes: true });
  const categoryDirs = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  // Load posts for all discovered subdirectories
  await Promise.all(
    categoryDirs.map(async (category) => {
      const posts = await getPostsByCategory(category);
      contentMap[category] = posts;
    })
  );

  return contentMap;
}
