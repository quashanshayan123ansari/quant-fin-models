import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'typescript' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-lg bg-slate-950 border border-slate-800 overflow-hidden font-mono text-xs">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-slate-400">
        <span className="uppercase text-[10px] font-bold text-cyan-400">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-slate-200 transition text-[11px]"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied!' : 'Copy Code'}</span>
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-slate-300 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
};
