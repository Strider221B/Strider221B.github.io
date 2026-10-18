/**
 * @file components/apps/terminal/TerminalOutput.jsx
 * @description Renders structured execution output blocks for the Ubuntu terminal emulator.
 */

// 1. React / Next.js core
import React from 'react';

// 2. Constants
const COLOR_PALETTE_HEX = [
  'bg-black', 'bg-red-600', 'bg-green-600', 'bg-yellow-600',
  'bg-blue-600', 'bg-purple-600', 'bg-cyan-600', 'bg-gray-200',
];

// 3. Component function definition
/**
 * Renders a single command execution output block.
 *
 * @param {Object} props
 * @param {Object} props.result - Command execution result payload
 * @returns {JSX.Element|null} Formatted terminal output
 */
export default function TerminalOutput({ result }) {
  if (!result || result.type === 'empty' || result.type === 'clear') {
    return null;
  }

  if (result.type === 'error') {
    return <div className="text-red-400 whitespace-pre-wrap">{result.content}</div>;
  }

  if (result.type === 'article_view') {
    return (
      <div className="my-2 space-y-3 font-mono">
        <div className="text-ub-orange font-bold text-base border-b border-ub-orange/40 pb-1 flex items-center justify-between flex-wrap gap-2">
          <span>{result.title}</span>
          {result.onOpenReader && (
            <button
              type="button"
              onClick={result.onOpenReader}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-ub-orange text-white hover:bg-ub-orange/80 rounded transition-colors text-xs font-sans font-medium cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
              <span>Open in GUI Reader</span>
            </button>
          )}
        </div>
        <div className="text-white/90 whitespace-pre-wrap leading-relaxed max-h-[50vh] overflow-y-auto p-2.5 bg-black/30 rounded border border-white/10 text-xs sm:text-sm">
          {result.content}
        </div>
        <div className="pt-2 border-t border-white/20 text-xs text-white/70 space-y-1.5">
          <div className="text-ubt-blue font-bold">[!] Document opened in terminal view.</div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-ubt-green">
              [*] Run &apos;open reader&apos;, &apos;reader&apos;, or click:
            </span>
            {result.onOpenReader && (
              <button
                type="button"
                onClick={result.onOpenReader}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-ub-orange/20 hover:bg-ub-orange border border-ub-orange/40 text-ub-orange hover:text-white rounded transition-colors text-xs font-mono font-medium cursor-pointer"
              >
                <span>[Click to Open GUI Reader]</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (result.type === 'category_ls') {
    return (
      <div className="my-2 space-y-2 font-mono">
        <div className="text-white/60 text-xs">
          total {result.files.length}
        </div>
        <div className="space-y-1 text-xs">
          {result.files.map((file) => (
            <div key={file.name} className="flex items-center gap-3">
              <span className="text-white/50">-rw-r--r-- 1 somesh somesh {file.size || '2.4K'}</span>
              <span className="text-ubt-green font-semibold">{file.name}</span>
            </div>
          ))}
        </div>
        <div className="pt-2 text-xs text-ubt-blue">
          [*] Run &apos;cat ~/articles/{result.category}/&lt;filename&gt;&apos; to display an article.
        </div>
      </div>
    );
  }

  if (result.type === 'help') {
    return (
      <div className="my-2 space-y-1">
        <p className="text-white/60 mb-2">Available Ubuntu Portfolio commands:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
          {result.content.map((item) => (
            <div key={item.cmd} className="flex gap-2">
              <span className="text-ubt-green font-bold w-28 shrink-0">{item.cmd}</span>
              <span className="text-white/70">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (result.type === 'ls') {
    return (
      <div className="flex flex-wrap gap-4 my-1">
        {result.dirs.map((dir) => (
          <span key={dir} className="text-ubt-blue font-bold">{dir}/</span>
        ))}
        {result.files.map((file) => (
          <span key={file} className="text-white">{file}</span>
        ))}
      </div>
    );
  }

  if (result.type === 'apps') {
    return (
      <div className="my-2">
        <p className="text-white/60 mb-1">Installed applications (launch with: open &lt;id&gt;):</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {result.apps.map((app) => (
            <span key={app.id} className="text-white">
              <strong className="text-ub-orange">{app.id}</strong> ({app.title})
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (result.type === 'history') {
    return (
      <div className="my-1 space-y-0.5">
        {result.history.map((cmd, idx) => (
          <div key={idx} className="text-white/80">
            <span className="text-white/40 mr-3">{idx + 1}</span>
            <span>{cmd}</span>
          </div>
        ))}
      </div>
    );
  }

  if (result.type === 'neofetch') {
    return (
      <div className="flex flex-col md:flex-row gap-4 my-2">
        <pre className="text-ub-orange font-bold text-xs leading-none shrink-0 overflow-x-auto">
          {result.art.join('\n')}
        </pre>
        <div className="flex flex-col justify-center space-y-1 text-xs">
          <div className="font-bold text-sm text-ubt-green">
            somesh@ubuntu <span className="text-white/40">-------------</span>
          </div>
          {result.info.map((item) => (
            <div key={item.label} className="flex gap-2">
              <span className="text-ub-orange font-semibold w-24 shrink-0">{item.label}:</span>
              <span className="text-white/90">{item.value}</span>
            </div>
          ))}
          <div className="flex gap-1 pt-2">
            {COLOR_PALETTE_HEX.map((color, idx) => (
              <span key={idx} className={`w-3 h-3 rounded-sm ${color} inline-block`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <div className="whitespace-pre-wrap text-white/90">{result.content}</div>;
}
