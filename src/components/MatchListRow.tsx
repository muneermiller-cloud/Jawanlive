import React from 'react';
import { Play, Clock, Star, Film, Radio, Columns } from 'lucide-react';
import { StreamItemMeta } from '../types';
import { parseKickoffDate } from '../services/streamService';
import {
  getLeagueForMatch,
  getCompetitionBadge,
  isRecapOrHighlight,
  isHighlightOnly,
} from '../services/leagueService';

interface MatchListRowProps {
  item: StreamItemMeta;
  isActive: boolean;
  isFavorite: boolean;
  onSelect: (item: StreamItemMeta) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onAddToMultiView?: (item: StreamItemMeta, e: React.MouseEvent) => void;
}

export const MatchListRow: React.FC<MatchListRowProps> = ({
  item,
  isActive,
  isFavorite,
  onSelect,
  onToggleFavorite,
  onAddToMultiView,
}) => {
  const isRecap = isRecapOrHighlight(item);
  const isHighlight = isHighlightOnly(item);
  const isLive = item.releaseInfo?.toLowerCase().includes('live') || item.category === 'live';
  const league = getLeagueForMatch(item.name, item.genres, item.description);
  const compBadge = getCompetitionBadge(item.name, item.genres, item.description);

  const kickoffDate = parseKickoffDate(item.releaseInfo);
  const now = new Date();
  const isUpcoming = kickoffDate && kickoffDate.getTime() > now.getTime();

  // Extract team names if format is "A vs B"
  const titleParts = item.name.split(/\s+vs\.?\s+/i);
  const hasTeams = titleParts.length === 2;

  let timeDisplay = item.releaseInfo || 'Live';
  if (isRecap && item.runtime) {
    timeDisplay = item.runtime;
  }

  return (
    <div
      id={`match-row-${item.id.replace(/[^a-zA-Z0-9_-]/g, '_')}`}
      onClick={() => onSelect(item)}
      className={`group flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border transition-all cursor-pointer ${
        isActive
          ? 'bg-violet-950/40 border-violet-500/80 shadow-md shadow-violet-600/15'
          : 'bg-[#0f141f] border-white/5 hover:bg-[#131a29] hover:border-violet-500/40'
      }`}
    >
      {/* Left side: Status & League */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Favorite star */}
        <button
          onClick={(e) => onToggleFavorite(item.id, e)}
          className={`p-1.5 rounded-lg transition-colors shrink-0 ${
            isFavorite
              ? 'text-amber-400 hover:text-amber-300'
              : 'text-zinc-600 hover:text-zinc-300'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star size={14} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>

        {/* Status Indicator Badge */}
        <div className="shrink-0 w-20 flex justify-center">
          {isLive ? (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white flex items-center gap-1 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Live
            </span>
          ) : isRecap ? (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center gap-1">
              <Film size={10} />
              {isHighlight ? 'Highlights' : 'Replay'}
            </span>
          ) : isUpcoming ? (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-black flex items-center gap-1">
              <Clock size={10} />
              Upcoming
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-zinc-800 text-zinc-400">
              Match
            </span>
          )}
        </div>

        {/* Competition pill */}
        <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-zinc-800/80 text-zinc-300 border border-white/5 shrink-0">
          <span>{compBadge.flag}</span>
          <span className="truncate max-w-[110px]">{compBadge.label}</span>
        </div>

        {/* Fixture title */}
        <div className="min-w-0 flex-1">
          {hasTeams ? (
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white truncate">
              <span className="truncate group-hover:text-violet-300 transition-colors">
                {titleParts[0]}
              </span>
              <span className="text-[10px] uppercase font-bold text-zinc-500 shrink-0">vs</span>
              <span className="truncate group-hover:text-violet-300 transition-colors">
                {titleParts[1]}
              </span>
            </div>
          ) : (
            <div className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-violet-300 transition-colors">
              {item.name}
            </div>
          )}
          {item.description && (
            <p className="text-[11px] text-zinc-400 truncate hidden md:block mt-0.5">
              {item.description.split('\n')[0]}
            </p>
          )}
        </div>
      </div>

      {/* Right side: Time & Play Action */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs text-zinc-400 font-mono hidden sm:flex items-center gap-1 mr-1">
          <Clock size={11} className="text-zinc-500" />
          <span>{timeDisplay}</span>
        </span>

        {onAddToMultiView && (
          <button
            onClick={(e) => onAddToMultiView(item, e)}
            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-cyan-300 rounded-lg text-xs transition-colors hidden sm:flex items-center"
            title="Add to TOD MultiView"
          >
            <Columns size={13} />
          </button>
        )}

        <button
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            isActive
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
              : 'bg-zinc-800 hover:bg-violet-600 hover:text-white text-zinc-200'
          }`}
        >
          <Play size={12} fill="currentColor" />
          <span>{isActive ? 'Playing' : 'Watch'}</span>
        </button>
      </div>
    </div>
  );
};
