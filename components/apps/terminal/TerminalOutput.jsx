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
