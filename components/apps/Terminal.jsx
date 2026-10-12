/**
 * @file components/apps/Terminal.jsx
 * @description Simulated Ubuntu bash terminal emulator application window.
 */

// 1. React / Next.js core
import React, { useState } from 'react';

// 3. Component function definition
/**
 * Renders the terminal emulator window.
 *
 * @returns {JSX.Element} Interactive terminal view
 */
export default function Terminal() {
  const [command, setCommand] = useState('');

  return (
    <div className="h-full bg-[#300A24] text-white font-mono text-sm p-4 select-text">
      <div className="text-ubt-green font-bold">
        guest@ubuntu:~$ <span className="text-white font-normal">welcome</span>
      </div>
      <div className="text-white/80 my-2">
        Type &apos;help&apos; to view available portfolio commands.
      </div>
      <div className="flex items-center gap-2 mt-4 text-ubt-green font-bold">
        <span>guest@ubuntu:~$</span>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          className="flex-1 bg-transparent text-white outline-none border-none font-mono"
          aria-label="Terminal prompt"
          autoFocus
        />
      </div>
    </div>
  );
}
