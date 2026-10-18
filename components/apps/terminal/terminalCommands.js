/**
 * @file components/apps/terminal/terminalCommands.js
 * @description Virtual filesystem and command execution engine for the Ubuntu terminal emulator.
 * Synchronizes virtual filesystem with content articles and supports deep-linked GUI launching.
 */

import { DEFAULT_USER_NAME } from '../../../lib/constants';
import apps from '../../../apps.config';
import postsManifest from '../../../public/posts-manifest.json';

// ─── CONSTANTS ──────────────────────────────────────────────────────
export const USER_HANDLE = 'somesh';
export const HOST_NAME = 'ubuntu';

/**
 * Builds the articles virtual directory hierarchy from postsManifest.
 *
 * @returns {Record<string, Object>} Dynamic articles virtual directory tree
 */
const buildArticlesVirtualTree = () => {
  const tree = {};

  postsManifest.forEach((post) => {
    if (!tree[post.category]) {
      tree[post.category] = {
        type: 'dir',
        children: {},
      };
    }
    const fileName = post.slug === 'index' ? 'index.md' : `${post.slug}.md`;
    tree[post.category].children[fileName] = {
      type: 'file',
      title: post.title,
      category: post.category,
      slug: post.slug,
      content: `# ${post.title}\nDate: ${post.date}\nAuthor: ${post.author}\nTags: ${post.tags.join(', ')}\n\n${post.excerpt}`,
    };
  });

  return tree;
};

export const VIRTUAL_FS = {
  '~': {
    type: 'dir',
    children: {
      'bio.txt': {
        type: 'file',
        content: `${DEFAULT_USER_NAME} - AI & Full Stack Systems Engineer.\nPassionate about building performant applications, intelligent agents, and intuitive web interfaces.`,
      },
      'contact.txt': {
        type: 'file',
        content: 'Email: somesh@example.com\nGitHub: https://github.com/Strider221B\nLinkedIn: https://linkedin.com/in/someshchatterjee',
      },
      'skills.txt': {
        type: 'file',
        content: 'Languages: Python, JavaScript, TypeScript, C++, SQL, Bash\nFrontend: React, Next.js, Tailwind CSS, Redux\nBackend: FastAPI, Node.js, Express, PostgreSQL, Docker\nAI/ML: PyTorch, Transformers, Agentic Workflows, LangChain',
      },
      projects: {
        type: 'dir',
        children: {
          'ubuntu-web-portfolio': {
            type: 'file',
            content: 'Ubuntu 26.04.1 LTS web desktop simulation built with Next.js, Tailwind CSS, and React.',
          },
          'autonomous-agents': {
            type: 'file',
            content: 'Deep agentic workflows and tool-calling systems for developer automation.',
          },
        },
      },
      articles: {
        type: 'dir',
        children: buildArticlesVirtualTree(),
      },
    },
  },
};

const NEOFETCH_ART = [
  '            .-/+oossssoo+/-.               ',
  '        `:+ssssssssssssssssss+:`           ',
  '      -+ssssssssssssssssssyyssss+-         ',
  '    .ossssssssssssssssssdMMMNysssso.       ',
  '   /ssssssssssshdmmNNmmyNMMMMhssssss/      ',
  '  +ssssssssshmydMMMMMMMNddddyssssssss+     ',
  ' /sssssssshNMMMyhhyyyyhmNMMMNhssssssss/    ',
  '.ssssssssdMMMNhsssssssssshNMMMdssssssss.   ',
  '+sssshhhyNMMNyssssssssssssyNMMMysssssss+   ',
  'ossyNMMMNyMMhsssssssssssssshmmmhssssssso   ',
  'ossyNMMMNyMMhsssssssssssssshmmmhssssssso   ',
  '+sssshhhyNMMNyssssssssssssyNMMMysssssss+   ',
  '.ssssssssdMMMNhsssssssssshNMMMdssssssss.   ',
  ' /sssssssshNMMMyhhyyyyhdNMMMNhssssssss/    ',
  '  +sssssssssdmydMMMMMMMMddddyssssssss+     ',
  '   /ssssssssssshdmNNNNmyNMMMMhssssss/      ',
  '    .ossssssssssssssssssdMMMNysssso.       ',
  '      -+sssssssssssssssssyyyssss+-         ',
  '        `:+ssssssssssssssssss+:`           ',
  '            .-/+oossssoo+/-.               ',
];

/**
 * Resolve target path within the virtual file system.
 *
 * @param {string} currentPath - Current working directory path
 * @param {string} targetPath - Relative or absolute destination
 * @returns {string|null} Canonical path or null if invalid
 */
export const resolvePath = (currentPath, targetPath) => {
  if (!targetPath || targetPath === '~' || targetPath === '/home/somesh') {
    return '~';
  }
  if (targetPath === '..' || targetPath === '../') {
    if (currentPath === '~') return '~';
    const parts = currentPath.split('/');
    parts.pop();
    return parts.join('/') || '~';
  }

  const cleanTarget = targetPath.replace(/^\.\//, '').replace(/\/$/, '');
  const candidate = cleanTarget.startsWith('~/')
    ? cleanTarget
    : currentPath === '~'
    ? `~/${cleanTarget}`
    : `${currentPath}/${cleanTarget}`;

  if (candidate === '~/projects') return '~/projects';
  if (candidate === '~/articles') return '~/articles';

  const categoryMatch = candidate.match(/^~\/articles\/([^/]+)$/);
  if (categoryMatch) {
    const categoryName = categoryMatch[1];
    if (VIRTUAL_FS['~'].children.articles.children[categoryName]) {
      return `~/articles/${categoryName}`;
    }
  }

  return null;
};

/**
 * Helper to retrieve article content for cat command.
 *
 * @param {string} filePath - Target file path
 * @param {string} cwd - Current working directory
 * @param {Object} context - Execution context
 * @returns {Object|null} Article result or null if not found
 */
const resolveArticleContent = (filePath, cwd, context) => {
  const cleanPath = filePath.replace(/^~\//, '');
  const parts = cleanPath.split('/');

  let category = '';
  let filename = '';

  if (parts.length === 3 && parts[0] === 'articles') {
    category = parts[1];
    filename = parts[2];
  } else if (parts.length === 2 && parts[0] === 'articles') {
    category = parts[1];
  } else if (cwd.startsWith('~/articles/')) {
    category = cwd.replace('~/articles/', '');
    filename = filePath;
  }

  const slug = filename.replace(/\.md$/, '');

  // Deep-linked active article content
  if (
    context.initialContent &&
    ((category === context.activeCategory && slug === context.activeSlug) ||
      filePath.includes(context.activeSlug || '___not_matched___'))
  ) {
    return {
      type: 'article_view',
      title: context.initialTitle || slug.replace(/-/g, ' '),
      content: context.initialContent,
    };
  }

  // Look up in articles virtual filesystem
  const categoryTree = VIRTUAL_FS['~'].children.articles.children[category];
  if (categoryTree?.children[filename]) {
    const fileNode = categoryTree.children[filename];
    return {
      type: 'article_view',
      title: fileNode.title || filename,
      content: fileNode.content,
    };
  }

  return null;
};

/**
 * Handle ls command against current working directory or arguments.
 *
 * @param {string[]} args - Command arguments
 * @param {Object} context - Execution context
 * @returns {Object} Directory listing result
 */
const handleLsCommand = (args, context) => {
  const targetArg = args.find((arg) => !arg.startsWith('-'));
  const targetCwd = targetArg ? resolvePath(context.cwd, targetArg) || targetArg : context.cwd;

  if (targetCwd === '~') {
    return {
      type: 'ls',
      dirs: ['projects', 'articles'],
      files: ['bio.txt', 'contact.txt', 'skills.txt'],
    };
  }

  if (targetCwd === '~/projects') {
    return {
      type: 'ls',
      dirs: [],
      files: ['ubuntu-web-portfolio', 'autonomous-agents'],
    };
  }

  if (targetCwd === '~/articles') {
    const categories = Object.keys(VIRTUAL_FS['~'].children.articles.children);
    return {
      type: 'ls',
      dirs: categories,
      files: [],
    };
  }

  const categoryMatch = targetCwd.match(/^~\/articles\/([^/]+)$/);
  if (categoryMatch) {
    const category = categoryMatch[1];
    const categoryTree = VIRTUAL_FS['~'].children.articles.children[category];
    if (categoryTree) {
      const files = Object.keys(categoryTree.children).map((name) => ({
        name,
        size: '2.5K',
      }));
      return {
        type: 'category_ls',
        category,
        files,
      };
    }
  }

  return { type: 'text', content: '' };
};

/**
 * Handle open and reader commands to launch GUI apps.
 *
 * @param {string} appId - Application identifier
 * @param {Object} context - Execution context
 * @returns {Object} Launch result
 */
const handleOpenCommand = (appId, context) => {
  if (!appId) {
    return { type: 'error', content: "Usage: open <app_id> (type 'apps' to view available IDs)" };
  }

  const lower = appId.toLowerCase();

  if (lower === 'reader' || lower === 'markdownviewer') {
    if (context.openApp) {
      context.openApp('reader');
    }
    return { type: 'success', content: 'Launching GUI Markdown Reader...' };
  }

  const targetApp = apps.find((a) => a.id.toLowerCase() === lower || a.title.toLowerCase() === lower);
  if (targetApp && context.openApp) {
    context.openApp(targetApp.id);
    return { type: 'success', content: `Launching ${targetApp.title}...` };
  }

  return {
    type: 'error',
    content: `open: app '${appId}' not found. Run 'apps' to see available applications.`,
  };
};

/**
 * Execute command against virtual bash environment.
 *
 * @param {string} rawInput - Full raw command string
 * @param {Object} context - Execution context including cwd and WM actions
 * @returns {Object} Execution output object
 */
export const processCommand = (rawInput, context) => {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return { type: 'empty' };
  }

  const parts = trimmed.split(/\s+/);
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  switch (command) {
    case 'help':
      return {
        type: 'help',
        content: [
          { cmd: 'help', desc: 'Display this help manual' },
          { cmd: 'ls [dir]', desc: 'List files and directories' },
          { cmd: 'cd <dir>', desc: 'Change working directory (~, projects, articles, ..)' },
          { cmd: 'cat <file>', desc: 'Display file contents (e.g. cat bio.txt)' },
          { cmd: 'open <app>', desc: 'Launch desktop app (e.g. open reader, open settings)' },
          { cmd: 'reader', desc: 'Launch GUI Markdown Reader for current article' },
          { cmd: 'pwd', desc: 'Print working directory' },
          { cmd: 'whoami', desc: 'Print current username' },
          { cmd: 'uname -a', desc: 'Print operating system details' },
          { cmd: 'neofetch', desc: 'Show system specifications & ASCII logo' },
          { cmd: 'apps', desc: 'List all installable applications' },
          { cmd: 'echo <text>', desc: 'Print input text to console' },
          { cmd: 'date', desc: 'Print current date and time' },
          { cmd: 'history', desc: 'Show command history' },
          { cmd: 'clear', desc: 'Clear the terminal screen' },
          { cmd: 'exit', desc: 'Close terminal window' },
        ],
      };

    case 'clear':
      return { type: 'clear' };

    case 'pwd':
      return {
        type: 'text',
        content: context.cwd === '~' ? '/home/somesh' : `/home/somesh/${context.cwd.replace('~/', '')}`,
      };

    case 'whoami':
      return { type: 'text', content: USER_HANDLE };

    case 'uname':
      return {
        type: 'text',
        content: 'Linux ubuntu 5.15.0-89-generic #99-Ubuntu SMP x86_64 GNU/Linux',
      };

    case 'date':
      return { type: 'text', content: new Date().toUTCString() };

    case 'echo':
      return { type: 'text', content: args.join(' ') };

    case 'ls':
      return handleLsCommand(args, context);

    case 'cd': {
      const target = args[0] || '~';
      const resolved = resolvePath(context.cwd, target);
      if (resolved) {
        return { type: 'cd', newCwd: resolved };
      }
      return {
        type: 'error',
        content: `bash: cd: ${target}: No such file or directory`,
      };
    }

    case 'cat': {
      if (!args[0]) {
        return { type: 'error', content: 'cat: missing file operand' };
      }
      const filename = args[0];

      // Check article filesystem resolution first
      const articleResult = resolveArticleContent(filename, context.cwd, context);
      if (articleResult) {
        return articleResult;
      }

      // Root files
      const rootFiles = VIRTUAL_FS['~'].children;
      if (context.cwd === '~' && rootFiles[filename]?.content) {
        return { type: 'text', content: rootFiles[filename].content };
      }
      if (context.cwd === '~/projects' && rootFiles.projects.children[filename]?.content) {
        return { type: 'text', content: rootFiles.projects.children[filename].content };
      }

      return {
        type: 'error',
        content: `cat: ${filename}: No such file or directory`,
      };
    }

    case 'apps':
      return {
        type: 'apps',
        apps: apps.map((a) => ({ id: a.id, title: a.title })),
      };

    case 'reader':
      return handleOpenCommand('reader', context);

    case 'open':
      return handleOpenCommand(args[0], context);

    case 'exit':
      if (context.closeApp) {
        context.closeApp('terminal');
      }
      return { type: 'text', content: 'exit' };

    case 'history':
      return {
        type: 'history',
        history: context.history || [],
      };

    case 'neofetch':
      return {
        type: 'neofetch',
        art: NEOFETCH_ART,
        info: [
          { label: 'OS', value: 'Ubuntu 26.04.1 LTS x86_64' },
          { label: 'Host', value: 'Browser Virtual Machine' },
          { label: 'Kernel', value: '5.15.0-89-generic' },
          { label: 'Uptime', value: 'Active Portfolio Session' },
          { label: 'Packages', value: `${apps.length} (installed desktop apps)` },
          { label: 'Shell', value: 'bash 5.1.16' },
          { label: 'DE', value: 'GNOME 42.0 (Yaru)' },
          { label: 'WM', value: 'Mutter (Next.js DOM)' },
          { label: 'Theme', value: 'Yaru-dark [GTK2/3]' },
          { label: 'Terminal', value: 'gnome-terminal' },
          { label: 'CPU', value: 'Virtual JS Engine Core' },
          { label: 'Memory', value: '1024MiB / 4096MiB' },
        ],
      };

    case 'sudo':
      return {
        type: 'error',
        content: `[sudo] password for ${USER_HANDLE}: \n${USER_HANDLE} is not in the sudoers file. This incident will be reported.`,
      };

    default:
      return {
        type: 'error',
        content: `bash: ${command}: command not found. Type 'help' for a list of available commands.`,
      };
  }
};
