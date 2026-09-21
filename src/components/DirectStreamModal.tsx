import React, { useState } from 'react';
import { X, Play, Link as LinkIcon } from 'lucide-react';
import { StreamSource } from '../types';

interface DirectStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayDirectStream: (title: string, stream: StreamSource) => void;
}

export const DirectStreamModal: React.FC<DirectStreamModalProps> = ({
  isOpen,
  onClose,
  onPlayDirectStream,
}) => {
  const [streamUrl, setStreamUrl] = useState('');
  const [streamTitle, setStreamTitle] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!streamUrl.trim()) return;

    onPlayDirectStream(streamTitle.trim() || 'Custom HD Stream', {
      name: 'Direct Stream',
      title: streamTitle.trim() || 'User Stream Feed',
      url: streamUrl.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div
        id="direct-stream-modal"
        className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <LinkIcon size={18} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Play Direct Stream</h3>
              <p className="text-xs text-zinc-400">Play any custom HLS (.m3u8) or video link</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
              Stream Video URL (HLS / m3u8 / MP4)
            </label>
            <input
              id="direct-stream-url-input"
              type="url"
              required
              placeholder="https://example.com/live/stream.m3u8"
              value={streamUrl}
              onChange={(e) => setStreamUrl(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
              Custom Title (Optional)
            </label>
            <input
              id="direct-stream-title-input"
              type="text"
              placeholder="e.g. Champions League Live Feed"
              value={streamTitle}
              onChange={(e) => setStreamTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="play-direct-stream-btn"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Play size={13} fill="currentColor" />
              Start HD Stream
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
