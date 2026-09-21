import React from 'react';
import { Calendar, Radio, ArrowRight, Clock, Tv, Film } from 'lucide-react';
import { StreamItemMeta } from '../types';
import { formatKickoffDisplay } from '../utils/leagues';

interface NoLiveMatchesNoticeProps {
  onSwitchToUpcoming: () => void;
  onSwitchToReplays?: () => void;
  upcomingCount: number;
  replaysCount?: number;
  previewMatches?: StreamItemMeta[];
  onSelectMatch?: (item: StreamItemMeta) => void;
}

export const NoLiveMatchesNotice: React.FC<NoLiveMatchesNoticeProps> = ({
  onSwitchToUpcoming,
  onSwitchToReplays,
  upcomingCount,
  replaysCount = 0,
  previewMatches = [],
  onSelectMatch,
}) => {
  return (
    <div
      id="no-live-matches-notice"
      className="w-full rounded-3xl bg-gradient-to-b from-[#0e1424] to-[#080c16] border border-white/10 p-6 sm:p-10 shadow-2xl relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-2xl mx-auto text-center flex flex-col items-center">
        {/* Live Status Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#141a2e] border border-white/10 flex items-center justify-center text-zinc-400 mb-5 shadow-xl relative">
          <Radio size={32} className="text-zinc-500" />
          <span className="absolute top-2 right-2 w-3 h-3 rounded-full bg-red-500/40 border border-red-500/60" />
        </div>

        {/* Primary Message as explicitly requested */}
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
          No live matches currently
        </h2>
        <p className="text-sm sm:text-base text-zinc-300 font-medium max-w-lg mb-6 leading-relaxed">
          Please check upcoming fixtures to view today’s schedule, kickoff times, and set reminders for live streams.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto mb-8">
          <button
            id="check-upcoming-fixtures-btn"
            onClick={onSwitchToUpcoming}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs sm:text-sm tracking-wide transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Calendar size={16} />
            <span>Check Upcoming Fixtures ({upcomingCount})</span>
            <ArrowRight size={15} />
          </button>

          {replaysCount > 0 && onSwitchToReplays && (
            <button
              id="check-replays-btn"
              onClick={onSwitchToReplays}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#151c2e] hover:bg-[#1c263e] text-zinc-200 hover:text-white border border-white/10 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
            >
              <Film size={15} className="text-violet-400" />
              <span>Watch Replays & Highlights ({replaysCount})</span>
            </button>
          )}
        </div>

        {/* Quick Next Fixtures preview if available */}
        {previewMatches.length > 0 && (
          <div className="w-full pt-6 border-t border-white/10 text-left">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={13} className="text-amber-400" />
                <span>Next Scheduled Fixtures</span>
              </span>
              <button
                onClick={onSwitchToUpcoming}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight size={12} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {previewMatches.slice(0, 4).map((match) => (
                <div
                  key={match.id}
                  onClick={() => onSelectMatch?.(match)}
                  className="p-3 rounded-xl bg-[#111728]/80 hover:bg-[#171f36] border border-white/5 hover:border-amber-500/30 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-zinc-200 truncate group-hover:text-amber-300 transition-colors">
                      {match.name}
                    </p>
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                      {formatKickoffDisplay(match.releaseInfo)}
                    </p>
                  </div>
                  <div className="shrink-0 p-1.5 rounded-lg bg-zinc-800/80 text-zinc-400 group-hover:text-white group-hover:bg-amber-500/20 transition-colors">
                    <Tv size={14} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
