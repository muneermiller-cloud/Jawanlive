import React from 'react';
import { Play, Clock, Star, Radio, Film, Columns, Sparkles } from 'lucide-react';
import { StreamItemMeta } from '../types';
import { parseKickoffDate } from '../services/streamService';
import {
  getLeagueForMatch,
  getCompetitionBadge,
  isRecapOrHighlight,
  isHighlightOnly,
} from '../services/leagueService';

interface MatchCardProps {
  item: StreamItemMeta;
  isActive: boolean;
  isFavorite: boolean;
  onSelect: (item: StreamItemMeta) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onAddToMultiView?: (item: StreamItemMeta, e: React.MouseEvent) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
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

  // Compute countdown or formatted kickoff
  const kickoffDate = parseKickoffDate(item.releaseInfo);
  const now = new Date();
  const isUpcoming = kickoffDate && kickoffDate.getTime() > now.getTime();

  let timeBadge = item.releaseInfo || '';
  if (isRecap && item.runtime) {
    timeBadge = item.runtime;
  }

  // Extract team names for clear typography if format is "A vs B" or "A vs. B"
  const titleParts = item.name.split(/\s+vs\.?\s+/i);
  const hasTeams = titleParts.length === 2;

  return (
    <div
      id={`match-card-${item.id.replace(/[^a-zA-Z0-9_-]/g, '_')}`}
      onClick={() => onSelect(item)}
      className={`group relative overflow-hidden rounded-2xl bg-[#0f141f] border transition-all duration-200 cursor-pointer flex flex-col ${
        isActive
          ? 'ring-2 ring-violet-500 border-violet-500/80 shadow-xl shadow-violet-600/20'
          : 'border-white/5 hover:border-violet-500/40 hover:shadow-lg hover:bg-[#131a29]'
      }`}
    >
      {/* Thumbnail Banner Area */}
      <div className="relative aspect-16/9 w-full bg-[#080b12] overflow-hidden">
        {item.poster || item.background ? (
          <img
            src={item.poster || item.background}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0e1320] via-[#090d16] to-[#0e1320] p-4 text-center">
            <Radio size={28} className="text-zinc-600 mb-2" />
            <span className="text-xs text-zinc-500 font-medium line-clamp-1">{item.name}</span>
          </div>
        )}

        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f141f] via-[#0f141f]/30 to-transparent opacity-85 group-hover:opacity-65 transition-opacity" />

        {/* Status Badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10 flex-wrap max-w-[80%]">
          {isLive ? (
            <span className="px-2 py-0.5 bg-red-600 text-white text-[11px] font-bold rounded-md uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              Live
            </span>
          ) : isRecap ? (
            <span className="px-2 py-0.5 bg-violet-600 text-white text-[11px] font-semibold rounded-md flex items-center gap-1 shadow-sm">
              <Film size={11} />
              {isHighlight ? 'Highlights' : 'Replay'}
            </span>
          ) : isUpcoming ? (
            <span className="px-2 py-0.5 bg-amber-500 text-black text-[11px] font-bold rounded-md flex items-center gap-1 shadow-sm">
              <Clock size={11} />
              Upcoming
            </span>
          ) : null}

          {/* Competition Pill */}
          <span
            className={`px-2 py-0.5 text-[10px] font-semibold rounded-md flex items-center gap-1 border backdrop-blur-md shadow-xs ${league.badgeStyle.bg} ${league.badgeStyle.text} ${league.badgeStyle.border}`}
          >
            <span>{compBadge.flag}</span>
            <span className="truncate max-w-[110px]">{compBadge.label}</span>
          </span>
        </div>

        {/* Action Buttons (Favorite + MultiView) */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          {onAddToMultiView && (
            <button
              onClick={(e) => onAddToMultiView(item, e)}
              className="p-1.5 rounded-lg backdrop-blur-md bg-black/60 text-zinc-400 hover:text-cyan-300 hover:bg-black/80 transition-colors"
              title="Add to TOD MultiView (Dual Screen)"
            >
              <Columns size={13} />
            </button>
          )}

          <button
            id={`favorite-btn-${item.id}`}
            onClick={(e) => onToggleFavorite(item.id, e)}
            className={`p-1.5 rounded-lg backdrop-blur-md transition-colors ${
              isFavorite
                ? 'bg-amber-400 text-black shadow-md'
                : 'bg-black/60 text-zinc-400 hover:text-white hover:bg-black/80'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star size={13} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Quick Play Hover Indicator */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white flex items-center justify-center shadow-xl shadow-violet-600/40 transform scale-90 group-hover:scale-100 transition-transform">
            <Play size={20} className="ml-0.5" fill="currentColor" />
          </div>
        </div>

        {/* Duration / Release pill on thumbnail bottom right */}
        {timeBadge && (
          <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 backdrop-blur-xs rounded-md text-[10px] font-mono text-zinc-300 border border-white/10">
            {timeBadge}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* League tag */}
          <div className="flex items-center justify-between gap-1.5 mb-2">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-xs leading-none">{league.flag}</span>
              <span className={`text-[11px] font-semibold tracking-wide truncate ${league.badgeStyle.text}`}>
                {league.name}
              </span>
            </div>
            <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider shrink-0">
              TOD360™
            </span>
          </div>

          {hasTeams ? (
            <div className="space-y-1 mb-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-white group-hover:text-violet-300 transition-colors">
                <span className="truncate">{titleParts[0]}</span>
                <span className="text-[10px] text-zinc-500 uppercase px-1">HOME</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-white group-hover:text-violet-300 transition-colors">
                <span className="truncate">{titleParts[1]}</span>
                <span className="text-[10px] text-zinc-500 uppercase px-1">AWAY</span>
              </div>
            </div>
          ) : (
            <h4 className="text-sm font-bold text-white line-clamp-2 mb-1 group-hover:text-violet-300 transition-colors leading-snug">
              {item.name}
            </h4>
          )}

          {item.description && (
            <p className="text-[11px] text-zinc-400 line-clamp-1 mt-1">{item.description.split('\n')[0]}</p>
          )}
        </div>

        <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
          <span className="flex items-center gap-1 truncate max-w-[70%] text-[11px]">
            <Clock size={11} className="text-zinc-500 shrink-0" />
            <span className="truncate">{item.releaseInfo || 'Live Broadcast'}</span>
          </span>
          <span className="text-violet-400 font-bold text-[11px] group-hover:text-violet-300 flex items-center gap-1">
            <span>Watch</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-violet-950 text-violet-300 border border-violet-800 font-mono">4K</span>
          </span>
        </div>
      </div>
    </div>
  );
};
