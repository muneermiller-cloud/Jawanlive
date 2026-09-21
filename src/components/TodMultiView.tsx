import React, { useState } from 'react';
import {
  Columns,
  Volume2,
  VolumeX,
  ArrowLeftRight,
  Maximize,
  X,
  Tv,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { StreamItemMeta, StreamSource } from '../types';
import { VideoPlayer } from './VideoPlayer';

interface TodMultiViewProps {
  primaryItem: StreamItemMeta;
  primarySources: StreamSource[];
  primarySourceIndex: number;
  onSelectPrimarySource: (idx: number) => void;

  secondaryItem: StreamItemMeta | null;
  secondarySources: StreamSource[];
  secondarySourceIndex: number;
  onSelectSecondarySource: (idx: number) => void;

  availableItems: StreamItemMeta[];
  onSelectSecondaryItem: (item: StreamItemMeta) => void;
  onCloseMultiView: () => void;
  onSwapScreens: () => void;
}

export const TodMultiView: React.FC<TodMultiViewProps> = ({
  primaryItem,
  primarySources,
  primarySourceIndex,
  onSelectPrimarySource,

  secondaryItem,
  secondarySources,
  secondarySourceIndex,
  onSelectSecondarySource,

  availableItems,
  onSelectSecondaryItem,
  onCloseMultiView,
  onSwapScreens,
}) => {
  const [activeAudioScreen, setActiveAudioScreen] = useState<'primary' | 'secondary'>('primary');
  const [showMatchPicker, setShowMatchPicker] = useState(false);

  return (
    <div id="tod-multiview-container" className="space-y-3 bg-[#0a0d14] p-3 sm:p-4 rounded-2xl border border-violet-500/30 shadow-2xl">
      {/* MultiView Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-2 py-1 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="px-2 py-0.5 rounded-lg bg-violet-600 text-white text-xs font-black tracking-wider flex items-center gap-1.5 shadow-md shadow-violet-600/30">
            <Columns size={13} />
            <span>TOD MULTIVIEW™</span>
          </div>
          <span className="text-xs text-zinc-400 hidden sm:inline">
            Watch 2 simultaneous matches on 1 screen
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Focus Toggle */}
          <div className="flex items-center gap-1 bg-zinc-900 border border-white/10 p-0.5 rounded-xl text-xs">
            <button
              onClick={() => setActiveAudioScreen('primary')}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all ${
                activeAudioScreen === 'primary'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Volume2 size={12} />
              <span>Audio: Screen 1</span>
            </button>
            <button
              onClick={() => setActiveAudioScreen('secondary')}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all ${
                activeAudioScreen === 'secondary'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Volume2 size={12} />
              <span>Audio: Screen 2</span>
            </button>
          </div>

          {/* Swap Screens */}
          <button
            onClick={onSwapScreens}
            className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 rounded-xl text-xs transition-colors"
            title="Swap Screen 1 and Screen 2"
          >
            <ArrowLeftRight size={14} />
          </button>

          {/* Close MultiView */}
          <button
            onClick={onCloseMultiView}
            className="p-1.5 bg-zinc-900 hover:bg-rose-900/60 text-zinc-400 hover:text-rose-200 border border-white/10 rounded-xl text-xs transition-colors"
            title="Exit MultiView"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Dual Video Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Screen 1 (Primary) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-2 text-xs">
            <span className="font-bold text-violet-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-violet-400" />
              SCREEN 1: {primaryItem.name}
            </span>
            {activeAudioScreen === 'primary' && (
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <Volume2 size={11} />
                Audio Active
              </span>
            )}
          </div>
          <div className="rounded-xl overflow-hidden border border-violet-500/20 shadow-lg">
            <VideoPlayer
              title={primaryItem.name}
              subtitle={primaryItem.releaseInfo}
              sources={primarySources}
              activeSourceIndex={primarySourceIndex}
              onSelectSource={onSelectPrimarySource}
              poster={primaryItem.background || primaryItem.poster}
              isLive={true}
            />
          </div>
        </div>

        {/* Screen 2 (Secondary) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-2 text-xs">
            <span className="font-bold text-cyan-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              SCREEN 2: {secondaryItem ? secondaryItem.name : 'Select Match'}
            </span>
            <div className="flex items-center gap-2">
              {secondaryItem && activeAudioScreen === 'secondary' && (
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <Volume2 size={11} />
                  Audio Active
                </span>
              )}
              <button
                onClick={() => setShowMatchPicker(!showMatchPicker)}
                className="text-[11px] px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded border border-white/10"
              >
                Change Match
              </button>
            </div>
          </div>

          {secondaryItem ? (
            <div className="rounded-xl overflow-hidden border border-cyan-500/20 shadow-lg">
              <VideoPlayer
                title={secondaryItem.name}
                subtitle={secondaryItem.releaseInfo}
                sources={secondarySources}
                activeSourceIndex={secondarySourceIndex}
                onSelectSource={onSelectSecondarySource}
                poster={secondaryItem.background || secondaryItem.poster}
                isLive={true}
              />
            </div>
          ) : (
            <div className="w-full aspect-video rounded-xl bg-zinc-900/80 border border-dashed border-zinc-700 flex flex-col items-center justify-center p-6 text-center">
              <Tv size={32} className="text-zinc-600 mb-2" />
              <h4 className="text-sm font-semibold text-white mb-1">Pick 2nd Live Match</h4>
              <p className="text-xs text-zinc-400 mb-4 max-w-xs">
                Select another live European clash to stream simultaneously alongside Screen 1.
              </p>
              <button
                onClick={() => setShowMatchPicker(true)}
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold"
              >
                Choose from Live Matches
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Match Picker Dropdown / Modal */}
      {showMatchPicker && (
        <div className="p-3 bg-zinc-900/95 border border-white/10 rounded-xl space-y-2 mt-2">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
            <span>Select Match for Screen 2</span>
            <button
              onClick={() => setShowMatchPicker(false)}
              className="text-zinc-500 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
            {availableItems
              .filter((i) => i.id !== primaryItem.id)
              .map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectSecondaryItem(item);
                    setShowMatchPicker(false);
                  }}
                  className="p-2 bg-zinc-800/80 hover:bg-zinc-750 border border-white/5 rounded-lg text-left text-xs transition-colors flex flex-col justify-between"
                >
                  <span className="font-semibold text-white truncate w-full">{item.name}</span>
                  <span className="text-[10px] text-zinc-400 mt-1 truncate">{item.releaseInfo || 'Live'}</span>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
