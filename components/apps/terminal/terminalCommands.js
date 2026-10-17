/**
 * @file components/apps/terminal/terminalCommands.js
 * @description Virtual filesystem and command execution engine for the Ubuntu terminal emulator.
 */

import { DEFAULT_USER_NAME } from '../../../lib/constants';
import apps from '../../../apps.config';

export const USER_HANDLE = 'somesh';
export const HOST_NAME = 'ubuntu';

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
        content: `Email: somesh@example.com\nGitHub: https://github.com/Strider221B\nLinkedIn: https://linkedin.com/in/someshchatterjee`,
      },
      'skills.txt': {
        type: 'file',
        content: `Languages: Python, JavaScript, TypeScript, C++, SQL, Bash\nFrontend: React, Next.js, Tailwind CSS, Redux\nBackend: FastAPI, Node.js, Express, PostgreSQL, Docker\nAI/ML: PyTorch, Transformers, Agentic Workflows, LangChain`,
      },
      projects: {
        type: 'dir',
        children: {
          'ubuntu-web-portfolio': {
            type: 'file',
            content: `Ubuntu 26.04.1 LTS web desktop simulation built with Next.js, Tailwind CSS, and React.`,
          },
          'autonomous-agents': {
            type: 'file',
            content: `Deep agentic workflows and tool-calling systems for developer automation.`,
          },
        },
      },
      articles: {
        type: 'dir',
        children: {
          'data-science.md': {
            type: 'file',
            content: `Explorations in data science, predictive modeling, and statistical inference.`,
          },
          'machine-learning.md': {
            type: 'file',
            content: `Deep learning architectures and reinforcement learning experiments.`,
          },
          'programming.md': {
            type: 'file',
            content: `Modern systems engineering, clean architecture, and reactive patterns.`,
          },
        },
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
  const candidate = currentPath === '~' ? `~/${cleanTarget}` : `${currentPath}/${cleanTarget}`;

  // Verify existence
  if (cleanTarget === 'projects' || candidate === '~/projects') return '~/projects';
  if (cleanTarget === 'articles' || candidate === '~/articles') return '~/articles';
  return null;
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
          { cmd: 'pwd', desc: 'Print working directory' },
          { cmd: 'whoami', desc: 'Print current username' },
          { cmd: 'uname -a', desc: 'Print operating system details' },
          { cmd: 'neofetch', desc: 'Show system specifications & ASCII logo' },
          { cmd: 'apps', desc: 'List all installable applications' },
          { cmd: 'open <app>', desc: 'Launch desktop app (e.g. open settings)' },
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

    case 'ls': {
      if (context.cwd === '~') {
        return {
          type: 'ls',
          dirs: ['projects', 'articles'],
          files: ['bio.txt', 'contact.txt', 'skills.txt'],
        };
      }
      if (context.cwd === '~/projects') {
        return {
          type: 'ls',
          dirs: [],
          files: ['ubuntu-web-portfolio', 'autonomous-agents'],
        };
      }
      if (context.cwd === '~/articles') {
        return {
          type: 'ls',
          dirs: [],
          files: ['data-science.md', 'machine-learning.md', 'programming.md'],
        };
      }
      return { type: 'text', content: '' };
    }

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
      const rootFiles = VIRTUAL_FS['~'].children;
      if (context.cwd === '~' && rootFiles[filename]?.content) {
        return { type: 'text', content: rootFiles[filename].content };
      }
      if (context.cwd === '~/projects' && rootFiles.projects.children[filename]?.content) {
        return { type: 'text', content: rootFiles.projects.children[filename].content };
      }
      if (context.cwd === '~/articles' && rootFiles.articles.children[filename]?.content) {
        return { type: 'text', content: rootFiles.articles.children[filename].content };
      }
      return {
        type: 'error',
        content: `cat: ${filename}: No such file or directory`,
      };
    }

    case 'apps': {
      return {
        type: 'apps',
        apps: apps.map((a) => ({ id: a.id, title: a.title })),
      };
    }

    case 'open': {
      if (!args[0]) {
        return { type: 'error', content: "Usage: open <app_id> (type 'apps' to view available IDs)" };
      }
      const appId = args[0].toLowerCase();
      const targetApp = apps.find((a) => a.id.toLowerCase() === appId || a.title.toLowerCase() === appId);
      if (targetApp && context.openApp) {
        context.openApp(targetApp.id);
        return { type: 'success', content: `Launching ${targetApp.title}...` };
      }
      return {
        type: 'error',
        content: `open: app '${args[0]}' not found. Run 'apps' to see available applications.`,
      };
    }

    case 'exit': {
      if (context.closeApp) {
        context.closeApp('terminal');
      }
      return { type: 'text', content: 'exit' };
    }

    case 'history': {
      return {
        type: 'history',
        history: context.history || [],
      };
    }

    case 'neofetch': {
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
    }

    case 'sudo': {
      return {
        type: 'error',
        content: `[sudo] password for ${USER_HANDLE}: \n${USER_HANDLE} is not in the sudoers file. This incident will be reported.`,
      };
    }

    default:
      return {
        type: 'error',
        content: `bash: ${command}: command not found. Type 'help' for a list of available commands.`,
      };
  }
};
