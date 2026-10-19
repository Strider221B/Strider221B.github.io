/**
 * @file components/apps/Terminal.jsx
 * @description Interactive Ubuntu bash terminal emulator supporting file navigation,
 * system queries, application launching, neofetch, and command history.
 */

// 1. React / Next.js core
import React, { useState, useRef, useEffect, useCallback } from 'react';

// 3. Project contexts and hooks
import { useWindowManager } from '../../hooks/useWindowManager';

// 4. Project components
import TerminalOutput from './terminal/TerminalOutput';
import TerminalWelcomeBanner from './terminal/TerminalWelcomeBanner';

// 5. Project utilities, constants, config
import {
  processCommand,
  USER_HANDLE,
  HOST_NAME,
} from './terminal/terminalCommands';

// 2. Constants
const DEFAULT_CWD = '~';
const AUTOCOMPLETE_COMMANDS = [
  'help', 'ls', 'cd', 'cat', 'pwd', 'whoami',
  'uname', 'neofetch', 'apps', 'open', 'reader', 'echo',
  'date', 'history', 'clear', 'exit', 'sudo',
];

// 3. Component function definition
/**
 * Renders the terminal emulator application window.
 *
 * @param {Object} [props]
 * @param {string} [props.initialCommand] - Initial command to run on boot
 * @param {string} [props.initialContent] - Pre-loaded article body for cat
 * @param {string} [props.initialBootSlug] - Slug of deep-linked article
 * @param {string} [props.initialBootCategory] - Category of deep-linked article
 * @param {string} [props.initialTitle] - Title of deep-linked article
 * @returns {JSX.Element} Interactive bash terminal component
 */
export default function Terminal({
  initialCommand,
  initialContent,
  initialBootSlug,
  initialBootCategory,
  initialTitle,
} = {}) {
  const { openApp, closeApp } = useWindowManager();

  const [cwd, setCwd] = useState(DEFAULT_CWD);
  const [inputCommand, setInputCommand] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const currentArticleRef = useRef(
    initialBootSlug
      ? {
          category: initialBootCategory,
          slug: initialBootSlug,
          title: initialTitle,
        }
      : null
  );

  const handleOpenArticle = useCallback((category, slug) => {
    if (category && slug) {
      openApp(`post-${category}-${slug}`);
    } else if (currentArticleRef.current?.category && currentArticleRef.current?.slug) {
      openApp(`post-${currentArticleRef.current.category}-${currentArticleRef.current.slug}`);
    } else {
      openApp('reader');
    }
  }, [openApp]);

  const bindArticleView = useCallback((result) => {
    if (!result || result.type !== 'article_view') return;
    const { category, slug, title } = result;
    if (category && slug) {
      currentArticleRef.current = { category, slug, title };
    }
    result.onOpenReader = () => handleOpenArticle(category, slug);
  }, [handleOpenArticle]);

  // Initialize terminal entries with pre-executed boot command if deep-linked
  const [entries, setEntries] = useState(() => {
    if (initialContent && initialBootSlug) {
      return [
        {
          id: 'initial-boot-entry',
          command: `cat ~/articles/${initialBootCategory}/${initialBootSlug}.md`,
          cwd: DEFAULT_CWD,
          result: {
            type: 'article_view',
            title: initialTitle || initialBootSlug,
            content: initialContent,
            category: initialBootCategory,
            slug: initialBootSlug,
            onOpenReader: () => handleOpenArticle(initialBootCategory, initialBootSlug),
          },
        },
      ];
    }
    if (initialCommand) {
      const bootResult = processCommand(initialCommand, {
        cwd: DEFAULT_CWD,
        openApp: () => {},
        closeApp: () => {},
        history: [],
        activeSlug: initialBootSlug,
        activeCategory: initialBootCategory,
        initialContent,
        initialTitle,
      });
      return [
        {
          id: 'initial-boot-entry',
          command: initialCommand,
          cwd: DEFAULT_CWD,
          result: bootResult,
        },
      ];
    }
    return [];
  });

  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll to bottom whenever output updates
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [entries]);

  const handleFocusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const handleExecute = useCallback((cmdToRun) => {
    const trimmed = cmdToRun.trim();
    if (!trimmed) {
      return;
    }

    const result = processCommand(trimmed, {
      cwd,
      openApp,
      closeApp,
      history: [...history, trimmed],
      activeSlug: currentArticleRef.current?.slug || initialBootSlug,
      activeCategory: currentArticleRef.current?.category || initialBootCategory,
      initialContent,
      initialTitle,
    });

    bindArticleView(result);

    if (result.type === 'clear') {
      setEntries([]);
    } else {
      if (result.type === 'cd' && result.newCwd) {
        setCwd(result.newCwd);
      }
      setEntries((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          command: trimmed,
          cwd,
          result,
        },
      ]);
    }

    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);
    setInputCommand('');
  }, [cwd, history, openApp, closeApp, initialBootSlug, initialBootCategory, initialContent, initialTitle, bindArticleView]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    handleExecute(inputCommand);
  }, [inputCommand, handleExecute]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputCommand(history[nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= history.length) {
        setHistoryIndex(-1);
        setInputCommand('');
      } else {
        setHistoryIndex(nextIdx);
        setInputCommand(history[nextIdx] || '');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const match = AUTOCOMPLETE_COMMANDS.find((cmd) => cmd.startsWith(inputCommand.trim()));
      if (match) {
        setInputCommand(match);
      }
    } else if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      setEntries([]);
    } else if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      setEntries((prev) => [
        ...prev,
        { id: `${Date.now()}`, command: `${inputCommand}^C`, cwd, result: null },
      ]);
      setInputCommand('');
    }
  }, [history, historyIndex, inputCommand, cwd]);

  return (
    <div
      ref={containerRef}
      onClick={handleFocusInput}
      className="h-full bg-[#300A24] text-white font-mono text-sm p-4 overflow-y-auto select-text flex flex-col cursor-text"
      role="region"
      aria-label="Terminal Screen"
    >
      <TerminalWelcomeBanner />

      <div className="space-y-3">
        {entries.map((entry) => (
          <div key={entry.id} className="space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-ubt-green font-bold">{USER_HANDLE}@{HOST_NAME}:</span>
              <span className="text-ubt-blue font-bold">{entry.cwd}</span>
              <span className="text-white">$</span>
              <span className="text-white font-normal ml-1">{entry.command}</span>
            </div>
            <TerminalOutput result={entry.result} />
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-1.5 mt-2 flex-wrap">
        <span className="text-ubt-green font-bold shrink-0">{USER_HANDLE}@{HOST_NAME}:</span>
        <span className="text-ubt-blue font-bold shrink-0">{cwd}</span>
        <span className="text-white shrink-0">$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputCommand}
          onChange={(e) => setInputCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-white outline-none border-none font-mono min-w-[120px] p-0"
          aria-label="Terminal prompt input"
          autoFocus
          spellCheck="false"
          autoComplete="off"
        />
      </form>
    </div>
  );
}
