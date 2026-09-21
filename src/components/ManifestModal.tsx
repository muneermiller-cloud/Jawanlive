import React, { useState } from 'react';
import { X, Globe, RefreshCw, CheckCircle2, AlertTriangle, RotateCcw } from 'lucide-react';
import { DEFAULT_MANIFEST_URL } from '../services/streamService';
import { StremioManifest } from '../types';

interface ManifestModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl: string;
  manifest: StremioManifest | null;
  onSaveUrl: (newUrl: string) => Promise<void>;
  isLoading: boolean;
}

export const ManifestModal: React.FC<ManifestModalProps> = ({
  isOpen,
  onClose,
  currentUrl,
  manifest,
  onSaveUrl,
  isLoading,
}) => {
  const [inputUrl, setInputUrl] = useState(currentUrl);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    try {
      setSaveStatus('Connecting...');
      await onSaveUrl(inputUrl.trim());
      setSaveStatus('Manifest connected successfully!');
      setTimeout(() => {
        setSaveStatus(null);
        onClose();
      }, 1200);
    } catch (err: any) {
      setSaveStatus(`Failed to connect: ${err.message || 'Check URL'}`);
    }
  };

  const handleResetDefault = async () => {
    setInputUrl(DEFAULT_MANIFEST_URL);
    await onSaveUrl(DEFAULT_MANIFEST_URL);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div
        id="manifest-config-modal"
        className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Globe size={18} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Stream Manifest Settings</h3>
              <p className="text-xs text-zinc-400">Manage stream provider and manifest feeds</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Addon Manifest URL
            </label>
            <div className="relative">
              <textarea
                id="manifest-url-input"
                rows={3}
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://.../manifest.json"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
            <p className="text-[11px] text-zinc-400 mt-1.5">
              Supports Stremio-compatible sports stream manifest endpoints.
            </p>
          </div>

          {/* Active Manifest Information */}
          {manifest && (
            <div className="bg-zinc-950/70 border border-zinc-800 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Provider Name:</span>
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  {manifest.name} (v{manifest.version})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Catalogs Detected:</span>
                <span className="text-zinc-300 font-mono">
                  {manifest.catalogs?.map((c) => c.name).join(', ') || 'None'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Description:</span>
                <span className="text-zinc-300 text-right truncate max-w-[260px]">
                  {manifest.description}
                </span>
              </div>
            </div>
          )}

          {saveStatus && (
            <div
              className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                saveStatus.includes('Failed')
                  ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                  : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
              }`}
            >
              {saveStatus.includes('Failed') ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
              {saveStatus}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              id="reset-manifest-default-btn"
              onClick={handleResetDefault}
              className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw size={13} />
              Reset to User Manifest
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="save-manifest-btn"
                disabled={isLoading}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {isLoading && <RefreshCw size={13} className="animate-spin" />}
                Connect Manifest
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
