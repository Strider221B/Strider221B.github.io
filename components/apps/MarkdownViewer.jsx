/**
 * @file components/apps/MarkdownViewer.jsx
 * @description Markdown content viewer window component rendering formatted articles,
 * technical tutorials, and profile documents inside an Ubuntu window shell.
 */

// 1. React / Next.js core
import React, { useState, useMemo, useCallback } from 'react';

// 5. Project utilities, constants, config
import { DEFAULT_USER_NAME, REPO_URL, GITHUB_BLOB_BASE_URL } from '../../lib/constants';

// ─── CONSTANTS ──────────────────────────────────────────────────────

const FONT_SIZES = {
  NORMAL: 'text-base',
  LARGE: 'text-lg',
  XLARGE: 'text-xl',
};

const COPIED_TIMEOUT_MS = 2000;

// ─── HELPER SUB-COMPONENTS ──────────────────────────────────────────

/**
 * Article header rendering post title, author, date, and category tags.
 *
 * @param {Object} props
 * @param {string} props.title - Document or article title
 * @param {string} [props.date] - Publication date string
 * @param {string} [props.author] - Author name
 * @param {string} [props.readTime] - Reading duration estimate
 * @param {string[]} [props.tags] - Category tags array
 */
function ArticleHeader({ title, date, author, readTime, tags }) {
  return (
    <header className="border-b border-white/15 pb-4 mb-6">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
        {title}
      </h1>
      <div className="flex flex-wrap items-center gap-3 text-xs text-white/60">
        {author && (
          <span className="flex items-center gap-1.5 text-white/80">
            <svg className="w-3.5 h-3.5 text-ub-orange fill-current" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
            {author}
          </span>
        )}
        {date && (
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-white/40 fill-current" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            {date}
          </span>
        )}
        {readTime && (
          <span className="px-2 py-0.5 rounded bg-white/10 text-white/70">
            {readTime}
          </span>
        )}
      </div>
      {Array.isArray(tags) && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2 py-0.5 rounded-full bg-ub-orange/20 text-ub-orange border border-ub-orange/30 font-mono"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}

/**
 * Reading toolbar providing font scaling and share links.
 *
 * @param {Object} props
 * @param {string} props.fontSize - Current active font size key
 * @param {Function} props.onChangeFontSize - Font size changer callback
 * @param {boolean} props.copied - Whether share link was copied
 * @param {Function} props.onCopy - Share link copy callback
 */
function ArticleToolbar({ fontSize, onChangeFontSize, copied, onCopy }) {
  return (
    <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-xs text-white/60">
      <div className="flex items-center gap-2">
        <span className="text-white/40">Text Size:</span>
        <button
          type="button"
          onClick={() => onChangeFontSize('NORMAL')}
          className={`px-2 py-0.5 rounded ${fontSize === 'NORMAL' ? 'bg-ub-orange text-white' : 'hover:bg-white/10'}`}
          title="Normal Text"
        >
          A
        </button>
        <button
          type="button"
          onClick={() => onChangeFontSize('LARGE')}
          className={`px-2 py-0.5 rounded ${fontSize === 'LARGE' ? 'bg-ub-orange text-white' : 'hover:bg-white/10'}`}
          title="Large Text"
        >
          A+
        </button>
      </div>
      <button
        type="button"
        onClick={onCopy}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-white/15 text-white/80 transition-colors"
        title="Copy GitHub Document Link"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
        </svg>
        {copied ? 'Copied!' : 'Share'}
      </button>
    </div>
  );
}

/**
 * Author sign-off card displayed at the bottom of the article.
 *
 * @param {Object} props
 * @param {string} props.author - Author display name
 */
function ArticleFooter({ author }) {
  return (
    <footer className="mt-12 pt-6 border-t border-white/10 text-xs text-white/50 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-ub-orange/20 border border-ub-orange/40 flex items-center justify-center text-ub-orange font-bold text-sm">
          {author.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-white/80">{author}</p>
          <p className="text-[11px] text-white/40">Ubuntu Desktop Portfolio</p>
        </div>
      </div>
      <p className="text-[11px] text-white/40">
        Published via static Markdown engine
      </p>
    </footer>
  );
}

// ─── COMPONENT DEFINITION ───────────────────────────────────────────

/**
 * Renders Markdown formatted documents or portfolio articles inside an interactive window.
 *
 * @param {Object} props
 * @param {string} [props.contentPath] - Category or file path key
 * @param {Object} [props.post] - Directly passed post object
 * @param {string} [props.htmlContent] - Directly passed HTML markup string
 * @param {string} [props.title] - Window title fallback
 * @param {Record<string, Array<Object>>} [props.contentMap={}] - Statically built content map
 * @returns {JSX.Element} Rendered Markdown viewer document
 */
export default function MarkdownViewer({
  contentPath,
  post: directPost,
  htmlContent: directHtml,
  title: directTitle,
  contentMap = {},
}) {
  const [fontSizeKey, setFontSizeKey] = useState('NORMAL');
  const [isCopied, setIsCopied] = useState(false);

  // Resolve matching post data from props or contentMap
  const resolvedPost = useMemo(() => {
    if (directPost) {
      return directPost;
    }

    if (!contentPath) {
      return null;
    }

    // Direct category match (e.g., 'about-me')
    if (contentMap[contentPath] && contentMap[contentPath].length > 0) {
      return contentMap[contentPath][0];
    }

    // Category/slug path match (e.g., 'data-science/post-1')
    if (contentPath.includes('/')) {
      const [category, slug] = contentPath.split('/');
      const found = contentMap[category]?.find((item) => item.slug === slug);
      if (found) {
        return found;
      }
    }

    return null;
  }, [directPost, contentPath, contentMap]);

  const displayTitle = resolvedPost?.title || directTitle || 'Document';
  const displayHtml = resolvedPost?.htmlContent || directHtml || '';
  const displayDate = resolvedPost?.date;
  const displayAuthor = resolvedPost?.author || DEFAULT_USER_NAME;
  const displayReadTime = resolvedPost?.readTime;
  const displayTags = resolvedPost?.tags || [];

  // Compute the underlying document file URL in the GitHub repository
  const gitHubPageUrl = useMemo(() => {
    if (resolvedPost?.filePath) {
      return `${GITHUB_BLOB_BASE_URL}/${resolvedPost.filePath}`;
    }
    if (resolvedPost?.category && resolvedPost?.slug) {
      return `${GITHUB_BLOB_BASE_URL}/content/${resolvedPost.category}/${resolvedPost.slug}.md`;
    }
    if (contentPath) {
      if (contentPath === 'about-me') {
        return `${GITHUB_BLOB_BASE_URL}/content/about-me/index.md`;
      }
      const formattedPath = contentPath.endsWith('.md') ? contentPath : `${contentPath}.md`;
      return `${GITHUB_BLOB_BASE_URL}/content/${formattedPath}`;
    }
    return REPO_URL;
  }, [resolvedPost, contentPath]);

  const handleCopy = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(gitHubPageUrl);
        } else {
          const textArea = document.createElement('textarea');
          textArea.value = gitHubPageUrl;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), COPIED_TIMEOUT_MS);
      }
    } catch {
      // Clipboard access may fail in sandboxed iframes
    }
  }, [gitHubPageUrl]);

  return (
    <article
      className={`h-full overflow-y-auto windowMainScreen p-6 md:p-10 max-w-4xl mx-auto text-ubt-grey font-sans select-text ${FONT_SIZES[fontSizeKey]}`}
    >
      <ArticleHeader
        title={displayTitle}
        date={displayDate}
        author={displayAuthor}
        readTime={displayReadTime}
        tags={displayTags}
      />
      <ArticleToolbar
        fontSize={fontSizeKey}
        onChangeFontSize={setFontSizeKey}
        copied={isCopied}
        onCopy={handleCopy}
      />
      {displayHtml ? (
        <div
          className="markdown-content"
          dangerouslySetInnerHTML={{ __html: displayHtml }}
        />
      ) : (
        <div className="py-12 text-center text-white/50">
          <p className="text-base font-medium">No document content found.</p>
          <p className="text-xs mt-1">
            Ensure markdown file is present in content directory.
          </p>
        </div>
      )}
      <ArticleFooter author={displayAuthor} />
    </article>
  );
}
