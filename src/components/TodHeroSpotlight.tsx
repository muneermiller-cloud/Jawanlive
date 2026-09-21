import React from 'react';
import { Play, Radio, Columns, Volume2, Shield, Calendar, Sparkles } from 'lucide-react';
import { StreamItemMeta } from '../types';
import { getLeagueForMatch, getCompetitionBadge } from '../services/leagueService';
import { extractTeamsFromTitle } from '../services/matchIntelligenceService';

interface TodHeroSpotlightProps {
  item: StreamItemMeta;
  onWatch: () => void;
  onAddToMultiView?: () => void;
  isLive: boolean;
}

export const TodHeroSpotlight: React.FC<TodHeroSpotlightProps> = ({
  item,
  onWatch,
  onAddToMultiView,
  isLive,
}) => {
  const { home, away } = extractTeamsFromTitle(item.name);
  const league = getLeagueForMatch(item.name, item.genres, item.description);
  const comp = getCompetitionBadge(item.name, item.genres, item.description);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-r from-[#0d111a] via-[#121826] to-[#0d111a] shadow-2xl p-6 md:p-8">
      {/* Background stadium texture & ambient light glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Subtle Grid Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left: Broadcast Context & Teams Display */}
        <div className="space-y-4 max-w-2xl text-center lg:text-left">
          {/* Top Badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-violet-600/20 text-violet-300 border border-violet-500/30 text-xs font-black tracking-wider flex items-center gap-1.5 shadow-sm">
              <Sparkles size={12} className="text-violet-400" />
              TOD SPOTLIGHT FIXTURE
            </span>

            {isLive ? (
              <span className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                <Radio size={12} />
                LIVE IN 4K UHD
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5">
                <Calendar size={12} />
                {item.releaseInfo || 'Upcoming Headliner'}
              </span>
            )}

            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 ${league.badgeStyle.bg} ${league.badgeStyle.text} ${league.badgeStyle.border}`}>
              <span>{comp.flag}</span>
              <span>{comp.label}</span>
            </span>
          </div>

          {/* Marquee Title */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {item.name}
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
            {item.description || 'Watch full multi-angle European live coverage with Dolby Atmos sound, Opta statistics, and interactive instant replays on TOD.'}
          </p>

          {/* Broadcast Audio & Feeds Highlights */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1 text-xs text-zinc-300">
            <span className="flex items-center gap-1.5 bg-zinc-900/80 px-2.5 py-1 rounded-lg border border-white/5">
              <span>🇬🇧 English</span>
              <span className="text-zinc-500">·</span>
              <span>🇸🇦 Arabic TOD</span>
              <span className="text-zinc-500">·</span>
              <span>🇪🇸 Spanish</span>
            </span>
            <span className="bg-zinc-900/80 px-2.5 py-1 rounded-lg border border-white/5 text-zinc-400">
              ⚡ Ultra-Low Latency CDN
            </span>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
            <button
              onClick={onWatch}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-500 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-violet-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Play size={16} fill="white" />
              <span>Watch Broadcast Now</span>
            </button>

            {onAddToMultiView && (
              <button
                onClick={onAddToMultiView}
                className="px-4 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-white/10 font-semibold text-xs flex items-center gap-2 transition-colors"
                title="Watch with another match side-by-side"
              >
                <Columns size={15} className="text-cyan-400" />
                <span>Open in TOD MultiView</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Team Crest Cards (Split Board) */}
        <div className="flex items-center gap-3 bg-[#0a0d14]/80 p-4 rounded-2xl border border-white/10 shadow-xl shrink-0 w-full sm:w-auto justify-center">
          {/* Home Team Card */}
          <div className="flex flex-col items-center text-center p-3 w-28 sm:w-32 rounded-xl bg-white/5 border border-white/5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-900/60 to-violet-700/40 border border-indigo-500/30 flex items-center justify-center text-lg font-black text-white shadow-inner mb-2">
              {home.substring(0, 3).toUpperCase()}
            </div>
            <span className="text-xs font-bold text-white truncate max-w-full">{home}</span>
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">Home</span>
          </div>

          <div className="flex flex-col items-center justify-center px-1">
            <span className="text-lg font-black text-violet-400">VS</span>
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">LIVE</span>
          </div>

          {/* Away Team Card */}
          <div className="flex flex-col items-center text-center p-3 w-28 sm:w-32 rounded-xl bg-white/5 border border-white/5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-900/60 to-blue-700/40 border border-cyan-500/30 flex items-center justify-center text-lg font-black text-white shadow-inner mb-2">
              {away.substring(0, 3).toUpperCase()}
            </div>
            <span className="text-xs font-bold text-white truncate max-w-full">{away}</span>
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">Away</span>
          </div>
        </div>
      </div>
    </div>
  );
};
