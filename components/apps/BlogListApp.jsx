/**
 * @file components/apps/BlogListApp.jsx
 * @description Lists technical blog posts for a selected category with search, tag filters,
 * date previews, excerpts, and window launch integration.
 */

// 1. React / Next.js core
import React, { useState, useMemo, useCallback } from 'react';

// 3. Project contexts and hooks
import { useWindowManager } from '../../hooks/useWindowManager';
import { useTheme } from '../../hooks/useTheme';

// ─── CONSTANTS ──────────────────────────────────────────────────────

const ALL_TAGS_LABEL = 'All';

// ─── HELPER SUB-COMPONENTS ──────────────────────────────────────────

/**
 * Category header with article counter and subtitle.
 *
 * @param {Object} props
 * @param {string} props.category - Category key
 * @param {number} props.totalPosts - Total count of posts in category
 */
function BlogHeader({ category, totalPosts, isDayTheme }) {
  const formattedTitle = category ? category.replace(/-/g, ' ') : 'Articles';

  return (
    <div className={`pb-4 mb-5 border-b ${isDayTheme ? 'border-black/10' : 'border-white/10'}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold capitalize text-ub-orange">
          {formattedTitle}
        </h2>
        <span className={`text-xs px-2.5 py-1 rounded-full ${isDayTheme ? 'bg-black/5 text-black/70' : 'bg-white/10 text-white/70'}`}>
          {totalPosts} {totalPosts === 1 ? 'Article' : 'Articles'}
        </span>
      </div>
      <p className={`text-xs mt-1 ${isDayTheme ? 'text-black/50' : 'text-white/50'}`}>
        Explore technical articles, deep dives, and system architecture guides.
      </p>
    </div>
  );
}

/**
 * Filter bar with search text input and tag selector buttons.
 *
 * @param {Object} props
 * @param {string} props.searchTerm - Current text search query
 * @param {Function} props.onSearchChange - Search text update callback
 * @param {string[]} props.tags - List of unique tags
 * @param {string[]} props.selectedTags - Currently selected tags array
 * @param {Function} props.onSelectTag - Tag selection callback
 * @param {boolean} [props.isDayTheme] - Whether Day theme is active
 */
function BlogFilters({
  searchTerm,
  onSearchChange,
  tags,
  selectedTags = [],
  onSelectTag,
  isDayTheme,
}) {
  const isAllSelected = selectedTags.length === 0;

  return (
    <div className="space-y-3 mb-6">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search articles by title, keyword, or excerpt..."
          className={`w-full rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-ub-orange transition-colors ${
            isDayTheme
              ? 'bg-black/5 border border-black/15 text-black placeholder-black/40'
              : 'bg-white/5 border border-white/15 text-white placeholder-white/40'
          }`}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange({ target: { value: '' } })}
            className={`absolute right-3 top-2.5 text-xs hover:text-white ${isDayTheme ? 'text-black/50' : 'text-white/50'}`}
          >
            Clear
          </button>
        )}
      </div>
      {tags.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className={`mr-1 font-medium ${isDayTheme ? 'text-black/60' : 'text-white/60'}`}>Tags:</span>
            <button
              type="button"
              onClick={() => onSelectTag(ALL_TAGS_LABEL)}
              className={`px-2.5 py-0.5 rounded-full transition-colors ${
                isAllSelected
                  ? 'bg-ub-orange text-white font-medium'
                  : isDayTheme
                  ? 'bg-black/5 text-black/60 hover:bg-black/10'
                  : 'bg-white/5 text-white/60 hover:bg-white/15'
              }`}
            >
              {ALL_TAGS_LABEL}
            </button>
            {tags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={(e) => onSelectTag(tag, e)}
                  title={isSelected ? `Click or Ctrl+Click to deselect #${tag}` : `Click to select, Ctrl+Click to multi-select #${tag}`}
                  className={`px-2.5 py-0.5 rounded-full transition-colors ${
                    isSelected
                      ? 'bg-ub-orange text-white font-medium'
                      : isDayTheme
                      ? 'bg-black/5 text-black/60 hover:bg-black/10'
                      : 'bg-white/5 text-white/60 hover:bg-white/15'
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
          <div className={`flex flex-wrap items-center justify-between gap-1 text-[11px] ${isDayTheme ? 'text-black/50' : 'text-white/40'}`}>
            <span>Ctrl + Click (or ⌘ + Click) to select or deselect multiple tags. Click an active tag to deselect it.</span>
            {selectedTags.length > 0 && (
              <button
                type="button"
                onClick={() => onSelectTag(ALL_TAGS_LABEL)}
                className="text-ub-orange hover:underline shrink-0 font-medium"
              >
                Reset tags
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Individual post preview card with metadata, tags, and launch button.
 *
 * @param {Object} props
 * @param {Object} props.post - Article data object
 * @param {Function} props.onOpen - Launch article callback
 * @param {string[]} [props.selectedTags=[]] - Currently selected tags array
 * @param {Function} props.onSelectTag - Tag filtering callback
 * @param {boolean} [props.isDayTheme] - Whether Day theme is active
 */
function BlogPostCard({ post, onOpen, selectedTags = [], onSelectTag, isDayTheme }) {
  const handleLaunch = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onOpen?.();
  };

  return (
    <article
      className={`group p-4 sm:p-5 rounded-lg border transition-all ${
        isDayTheme
          ? 'bg-[#FAFAFA] hover:bg-white border-black/10 hover:border-ub-orange/40 shadow-sm'
          : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-ub-orange/40'
      }`}
    >
      <div className={`flex flex-wrap items-center justify-between gap-2 text-xs mb-2 ${isDayTheme ? 'text-black/50' : 'text-white/50'}`}>
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          {post.date}
        </span>
        {post.readTime && (
          <span className={`px-2 py-0.5 rounded text-[11px] ${isDayTheme ? 'bg-black/5 text-black/70' : 'bg-white/10 text-white/70'}`}>
            {post.readTime}
          </span>
        )}
      </div>
      <h3
        onClick={handleLaunch}
        className={`font-bold text-lg group-hover:text-ub-orange transition-colors cursor-pointer ${
          isDayTheme ? 'text-[#111111]' : 'text-white'
        }`}
      >
        {post.title}
      </h3>
      <p className={`text-sm mt-2 line-clamp-2 leading-relaxed ${isDayTheme ? 'text-black/75' : 'text-white/75'}`}>
        {post.excerpt}
      </p>
      <div className={`flex items-center justify-between mt-4 pt-3 border-t flex-wrap gap-2 ${isDayTheme ? 'border-black/10' : 'border-white/10'}`}>
        <div className="flex flex-wrap gap-1.5">
          {post.tags?.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTag(tag, e);
                }}
                title={isSelected ? `Click or Ctrl+Click to deselect #${tag}` : `Click to select, Ctrl+Click to multi-select #${tag}`}
                className={`text-[11px] px-2 py-0.5 rounded-full transition-colors ${
                  isSelected
                    ? 'bg-ub-orange text-white'
                    : isDayTheme
                    ? 'bg-black/5 hover:bg-ub-orange/20 text-black/60 hover:text-ub-orange'
                    : 'bg-white/5 hover:bg-ub-orange/20 text-white/60 hover:text-ub-orange'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={handleLaunch}
          className="flex items-center gap-1.5 text-xs font-medium text-ub-orange hover:text-white px-3 py-1 rounded bg-ub-orange/10 hover:bg-ub-orange transition-colors"
        >
          Read Article
          <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </article>
  );
}

// ─── COMPONENT DEFINITION ───────────────────────────────────────────

/**
 * Renders the category article feed window with search and launch actions.
 *
 * @param {Object} props
 * @param {string} [props.category] - Topic category key
 * @param {Record<string, Array<Object>>} [props.contentMap={}] - Markdown content map
 * @returns {JSX.Element} Category blog post listing
 */
export default function BlogListApp({ category, contentMap = {} }) {
  const { openApp } = useWindowManager();
  const { isDayTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const rawPosts = contentMap[category] || [];

  // Extract all unique tags present across articles in this category
  const availableTags = useMemo(() => {
    const tagSet = new Set();
    rawPosts.forEach((post) => {
      post.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [rawPosts]);

  // Filter posts by search query and tag
  const filteredPosts = useMemo(() => {
    return rawPosts.filter((post) => {
      const matchesTag =
        selectedTags.length === 0 ||
        selectedTags.some((selected) => post.tags?.includes(selected));

      if (!matchesTag) {
        return false;
      }

      if (!searchTerm.trim()) {
        return true;
      }

      const query = searchTerm.toLowerCase();
      const matchTitle = post.title?.toLowerCase().includes(query);
      const matchExcerpt = post.excerpt?.toLowerCase().includes(query);
      const matchTags = post.tags?.some((tag) => tag.toLowerCase().includes(query));

      return matchTitle || matchExcerpt || matchTags;
    });
  }, [rawPosts, selectedTags, searchTerm]);

  const handleSelectTag = useCallback((tag, event) => {
    if (tag === ALL_TAGS_LABEL) {
      setSelectedTags([]);
      return;
    }

    const isMultiSelect = Boolean(event?.ctrlKey || event?.metaKey);

    setSelectedTags((prevSelected) => {
      const isAlreadySelected = prevSelected.includes(tag);

      if (isAlreadySelected) {
        return prevSelected.filter((t) => t !== tag);
      }

      if (isMultiSelect) {
        return [...prevSelected, tag];
      }

      return [tag];
    });
  }, []);

  const handleOpenPost = useCallback((post) => {
    const dynamicAppId = `post-${category}-${post.slug}`;
    openApp(dynamicAppId);
  }, [category, openApp]);

  return (
    <div
      className={`h-full overflow-y-auto windowMainScreen p-3.5 sm:p-6 md:p-8 max-w-4xl mx-auto select-text ${
        isDayTheme ? 'text-[#2e3436]' : 'text-white'
      }`}
    >
      <BlogHeader
        category={category}
        totalPosts={rawPosts.length}
        isDayTheme={isDayTheme}
      />
      <BlogFilters
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        tags={availableTags}
        selectedTags={selectedTags}
        onSelectTag={handleSelectTag}
        isDayTheme={isDayTheme}
      />
      {filteredPosts.length === 0 ? (
        <div
          className={`py-12 text-center rounded-lg border ${
            isDayTheme
              ? 'text-black/50 border-black/10 bg-black/5'
              : 'text-white/50 border-white/5 bg-white/5'
          }`}
        >
          <p className="text-base font-medium">No matching articles found.</p>
          <p className="text-xs mt-1">Try clearing your search query or adjusting your tag filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <BlogPostCard
              key={post.slug}
              post={post}
              onOpen={() => handleOpenPost(post)}
              selectedTags={selectedTags}
              onSelectTag={handleSelectTag}
              isDayTheme={isDayTheme}
            />
          ))}
        </div>
      )}
    </div>
  );
}
