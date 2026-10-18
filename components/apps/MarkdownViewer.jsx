/**
 * @file components/apps/MarkdownViewer.jsx
 * @description Markdown content viewer window component rendering formatted articles,
 * technical tutorials, and profile documents inside an Ubuntu window shell.
 */

// 1. React / Next.js core
import React, { useState, useEffect, useMemo, useCallback } from 'react';

// 3. Project contexts and hooks
import { useWindowManager } from '../../hooks/useWindowManager';
import { useTheme } from '../../hooks/useTheme';

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
function ArticleHeader({ title, date, author, readTime, tags, isDayTheme }) {
  return (
    <header className={`pb-4 mb-6 border-b ${isDayTheme ? 'border-black/10' : 'border-white/15'}`}>
      <h1 className={`text-2xl md:text-3xl font-bold mb-3 leading-tight ${isDayTheme ? 'text-[#111111]' : 'text-white'}`}>
        {title}
      </h1>
      <div className={`flex flex-wrap items-center gap-3 text-xs ${isDayTheme ? 'text-black/60' : 'text-white/60'}`}>
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
function ArticleToolbar({ fontSize, onChangeFontSize, copied, onCopy, isDayTheme }) {
  return (
    <div
      className={`flex items-center justify-between pb-3 mb-4 border-b text-xs ${
        isDayTheme ? 'border-black/10 text-black/60' : 'border-white/10 text-white/60'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className={isDayTheme ? 'text-black/40' : 'text-white/40'}>Text Size:</span>
        <button
          type="button"
          onClick={() => onChangeFontSize('NORMAL')}
          className={`px-2 py-0.5 rounded ${
            fontSize === 'NORMAL'
              ? 'bg-ub-orange text-white'
              : isDayTheme
              ? 'hover:bg-black/5 text-black/70'
              : 'hover:bg-white/10'
          }`}
          title="Normal Text"
        >
          A
        </button>
        <button
          type="button"
          onClick={() => onChangeFontSize('LARGE')}
          className={`px-2 py-0.5 rounded ${
            fontSize === 'LARGE'
              ? 'bg-ub-orange text-white'
              : isDayTheme
              ? 'hover:bg-black/5 text-black/70'
              : 'hover:bg-white/10'
          }`}
          title="Large Text"
        >
          A+
        </button>
      </div>
      <button
        type="button"
        onClick={onCopy}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
          isDayTheme
            ? 'bg-black/5 hover:bg-black/10 text-black/80'
            : 'bg-white/5 hover:bg-white/15 text-white/80'
        }`}
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
 * @param {boolean} [props.isDayTheme] - Whether Day theme is active
 */
function ArticleFooter({ author, isDayTheme }) {
  return (
    <footer
      className={`mt-12 pt-6 border-t text-xs flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isDayTheme ? 'border-black/10 text-black/50' : 'border-white/10 text-white/50'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-ub-orange/20 border border-ub-orange/40 flex items-center justify-center text-ub-orange font-bold text-sm">
          {author.charAt(0)}
        </div>
        <div>
          <p className={`font-semibold ${isDayTheme ? 'text-[#111111]' : 'text-white/80'}`}>{author}</p>
          <p className={`text-[11px] ${isDayTheme ? 'text-black/50' : 'text-white/40'}`}>Ubuntu Desktop Portfolio</p>
        </div>
      </div>
      <p className={`text-[11px] ${isDayTheme ? 'text-black/50' : 'text-white/40'}`}>
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
  const { openApp } = useWindowManager();
  const { isDayTheme } = useTheme();
  const [fontSizeKey, setFontSizeKey] = useState('NORMAL');
  const [isCopied, setIsCopied] = useState(false);
  const [asyncHtml, setAsyncHtml] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  // Fetch compiled post content on demand if not present in initial catalog
  useEffect(() => {
    if (directHtml || resolvedPost?.htmlContent) {
      return;
    }

    const cat =
      resolvedPost?.category ||
      (contentPath?.includes('/') ? contentPath.split('/')[0] : contentPath);
    const slug =
      resolvedPost?.slug ||
      (contentPath?.includes('/') ? contentPath.split('/')[1] : 'index');

    if (cat && slug) {
      setIsLoading(true);
      fetch(`/posts/${cat}/${slug}.json`)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((data) => {
          if (data?.htmlContent) {
            setAsyncHtml(data.htmlContent);
          }
        })
        .catch((err) => {
          console.warn('[MarkdownViewer] Failed to load post JSON:', err.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [directHtml, resolvedPost, contentPath]);

  const displayTitle = resolvedPost?.title || directTitle || 'Document';
  const displayHtml = resolvedPost?.htmlContent || directHtml || asyncHtml || '';
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

  const handleContentClick = useCallback((e) => {
    const link = e.target.closest('a');
    if (!link) {
      return;
    }
    const href = link.getAttribute('href');
    if (!href) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    if (href.startsWith('http://') || href.startsWith('https://')) {
      if (typeof window !== 'undefined') {
        window.open(href, '_blank', 'noopener,noreferrer');
      }
    } else if (href.startsWith('mailto:')) {
      if (typeof window !== 'undefined') {
        window.location.href = href;
      }
    } else {
      const cleanHref = href.replace(/^(\/|#)/, '').replace(/\.md$/, '');
      if (cleanHref) {
        openApp(cleanHref);
      }
    }
  }, [openApp]);

  return (
    <article
      className={`h-full overflow-y-auto windowMainScreen p-3.5 sm:p-6 md:p-10 max-w-4xl mx-auto font-sans select-text ${
        isDayTheme ? 'text-[#2e3436]' : 'text-ubt-grey'
      } ${FONT_SIZES[fontSizeKey]}`}
    >
      <ArticleHeader
        title={displayTitle}
        date={displayDate}
        author={displayAuthor}
        readTime={displayReadTime}
        tags={displayTags}
        isDayTheme={isDayTheme}
      />
      <ArticleToolbar
        fontSize={fontSizeKey}
        onChangeFontSize={setFontSizeKey}
        copied={isCopied}
        onCopy={handleCopy}
        isDayTheme={isDayTheme}
      />
      {isLoading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-ub-orange border-t-transparent rounded-full animate-spin" />
          <span className={`text-xs ${isDayTheme ? 'text-black/60' : 'text-white/60'}`}>
            Loading article content...
          </span>
        </div>
      ) : displayHtml ? (
        <div
          className="markdown-content"
          onClick={handleContentClick}
          dangerouslySetInnerHTML={{ __html: displayHtml }}
        />
      ) : (
        <div className={`py-12 text-center ${isDayTheme ? 'text-black/50' : 'text-white/50'}`}>
          <p className="text-base font-medium">No document content found.</p>
          <p className="text-xs mt-1">
            Ensure markdown file is present in content directory.
          </p>
        </div>
      )}
      <ArticleFooter author={displayAuthor} isDayTheme={isDayTheme} />
    </article>
  );
}
