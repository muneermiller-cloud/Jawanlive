import React, { useState } from 'react';
import {
  X,
  Laptop,
  Terminal,
  Server,
  Copy,
  Check,
  Wifi,
  Smartphone,
  Tv,
  Download,
  Layers,
} from 'lucide-react';

interface SelfHostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SelfHostModal: React.FC<SelfHostModalProps> = ({ isOpen, onClose }) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Laptop size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Host & Run on Your Own PC</h3>
              <p className="text-xs text-zinc-400">
                Self-host locally with Node.js or Docker for personal streaming
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* 3 Step Quickstart Guide */}
        <div className="space-y-4">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px]">
                  1
                </span>
                <span>Export / Download the Project</span>
              </div>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              In Google AI Studio, click <strong>Settings</strong> (gear icon top right) and select{' '}
              <strong>Export to GitHub</strong> or <strong>Download ZIP</strong> to extract the code to a folder on your computer.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px]">
                  2
                </span>
                <span>Install Dependencies (Node.js 18+)</span>
              </div>
              <button
                onClick={() => handleCopy('npm install', 'npm-install')}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 bg-zinc-800/80 px-2 py-1 rounded-md"
              >
                {copiedCmd === 'npm-install' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copiedCmd === 'npm-install' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="bg-black/70 border border-zinc-800 rounded-lg p-2.5 font-mono text-xs text-zinc-300">
              cd sports-player &amp;&amp; npm install
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px]">
                  3
                </span>
                <span>Start the Local Server</span>
              </div>
              <button
                onClick={() => handleCopy('npm run dev', 'npm-run')}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 bg-zinc-800/80 px-2 py-1 rounded-md"
              >
                {copiedCmd === 'npm-run' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copiedCmd === 'npm-run' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="bg-black/70 border border-zinc-800 rounded-lg p-2.5 font-mono text-xs text-zinc-300">
              npm run dev
            </div>
            <p className="text-[11px] text-zinc-400">
              For production mode: <code className="text-zinc-200">npm run build &amp;&amp; npm start</code>
            </p>
          </div>
        </div>

        {/* Local Network / Smart TV access */}
        <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/25 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
            <Wifi size={15} />
            <span>Watch on Smart TV, Phone, or Tablet</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            When you run the server, it binds to <code className="text-indigo-200 bg-indigo-900/40 px-1 py-0.5 rounded">0.0.0.0:3000</code>.
            Open your browser on any device on the same home Wi-Fi and navigate to:
          </p>
          <div className="bg-black/60 border border-indigo-500/20 rounded-lg p-2 font-mono text-xs text-amber-300 flex items-center justify-between">
            <span>http://&lt;your-pc-ip&gt;:3000</span>
            <span className="text-[10px] text-zinc-400 font-sans">e.g. 192.168.1.45:3000</span>
          </div>
        </div>

        {/* Docker alternative */}
        <div className="p-3.5 rounded-xl bg-zinc-950/40 border border-zinc-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-zinc-300">
            <Server size={14} className="text-zinc-400" />
            <span>Docker Compose is also included (<code className="text-zinc-200">docker compose up -d</code>)</span>
          </div>
          <button
            onClick={() => handleCopy('docker compose up -d', 'docker')}
            className="text-zinc-400 hover:text-white flex items-center gap-1 bg-zinc-800 px-2 py-1 rounded"
          >
            {copiedCmd === 'docker' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            <span>{copiedCmd === 'docker' ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
