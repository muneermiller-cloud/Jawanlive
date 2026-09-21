import React from 'react';
import { Radio, Calendar, Film, Layers } from 'lucide-react';

export type MainStatusFilter = 'live' | 'upcoming' | 'replays' | 'all';

interface MainPageFilterNavProps {
  activeStatus: MainStatusFilter;
  onSelectStatus: (status: MainStatusFilter) => void;
  counts: {
    live: number;
    upcoming: number;
    replays: number;
    all: number;
  };
}

export const MainPageFilterNav: React.FC<MainPageFilterNavProps> = ({
  activeStatus,
  onSelectStatus,
  counts,
}) => {
  return (
    <nav
      id="main-page-top-nav"
      aria-label="Match broadcast categories"
      className="w-full bg-[#0b0f19] border border-white/10 rounded-2xl p-2 sm:p-2.5 shadow-2xl backdrop-blur-md"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Primary Options: LIVE | Upcoming Fixtures | Replay and Highlights */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {/* LIVE Option */}
          <button
            id="top-nav-option-live"
            onClick={() => onSelectStatus('live')}
            className={`group relative px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black tracking-wider uppercase transition-all duration-200 flex items-center gap-2.5 shrink-0 ${
              activeStatus === 'live'
                ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-lg shadow-red-600/30 border border-red-400/40 ring-2 ring-red-500/20'
                : 'bg-[#131929] hover:bg-[#1a233a] text-zinc-300 hover:text-white border border-white/5 hover:border-red-500/30'
            }`}
          >
            <span className="relative flex h-2.5 w-2.5 items-center justify-center">
              {counts.live > 0 ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                </>
              ) : (
                <span
                  className={`inline-flex rounded-full h-2 w-2 ${
                    activeStatus === 'live' ? 'bg-white/80' : 'bg-zinc-500'
                  }`}
                />
              )}
            </span>
            <span className="tracking-widest">LIVE</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-colors ${
                activeStatus === 'live'
                  ? 'bg-black/30 text-white border border-white/20'
                  : counts.live > 0
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {counts.live}
            </span>
          </button>

          {/* Upcoming Fixtures Option */}
          <button
            id="top-nav-option-upcoming"
            onClick={() => onSelectStatus('upcoming')}
            className={`group relative px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 flex items-center gap-2.5 shrink-0 ${
              activeStatus === 'upcoming'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 shadow-lg shadow-amber-500/25 border border-amber-300/40 ring-2 ring-amber-400/20'
                : 'bg-[#131929] hover:bg-[#1a233a] text-zinc-300 hover:text-white border border-white/5 hover:border-amber-500/30'
            }`}
          >
            <Calendar
              size={15}
              className={
                activeStatus === 'upcoming'
                  ? 'text-zinc-950'
                  : 'text-amber-400 group-hover:scale-110 transition-transform'
              }
            />
            <span>Upcoming Fixtures</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-colors ${
                activeStatus === 'upcoming'
                  ? 'bg-black/25 text-zinc-950 border border-black/20'
                  : 'bg-amber-500/15 text-amber-300 border border-amber-500/25'
              }`}
            >
              {counts.upcoming}
            </span>
          </button>

          {/* Replay and Highlights Option */}
          <button
            id="top-nav-option-replays"
            onClick={() => onSelectStatus('replays')}
            className={`group relative px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 flex items-center gap-2.5 shrink-0 ${
              activeStatus === 'replays'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30 border border-violet-400/40 ring-2 ring-violet-500/20'
                : 'bg-[#131929] hover:bg-[#1a233a] text-zinc-300 hover:text-white border border-white/5 hover:border-violet-500/30'
            }`}
          >
            <Film
              size={15}
              className={
                activeStatus === 'replays'
                  ? 'text-white'
                  : 'text-violet-400 group-hover:scale-110 transition-transform'
              }
            />
            <span>Replay and Highlights</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-colors ${
                activeStatus === 'replays'
                  ? 'bg-black/30 text-white border border-white/20'
                  : 'bg-violet-500/15 text-violet-300 border border-violet-500/25'
              }`}
            >
              {counts.replays}
            </span>
          </button>
        </div>

        {/* Quick view toggle: All Matches option */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
          <button
            id="top-nav-option-all"
            onClick={() => onSelectStatus('all')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeStatus === 'all'
                ? 'bg-zinc-200 text-zinc-950 shadow-md font-bold'
                : 'bg-[#131929] hover:bg-[#182136] text-zinc-400 hover:text-zinc-200 border border-white/5'
            }`}
            title="Show all matches across live, upcoming, and replays"
          >
            <Layers size={13} />
            <span>All Matches</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeStatus === 'all' ? 'bg-zinc-300 text-zinc-950 font-bold' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {counts.all}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};
