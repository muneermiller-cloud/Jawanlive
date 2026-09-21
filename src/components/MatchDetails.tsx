import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Radio,
  Star,
  Copy,
  Check,
  Server,
  Info,
  ShieldCheck,
  Columns,
} from 'lucide-react';
import { StreamItemMeta, StreamSource } from '../types';
import { parseKickoffDate } from '../services/streamService';
import {
  getLeagueForMatch,
  getCompetitionBadge,
  isRecapOrHighlight,
  isHighlightOnly,
} from '../services/leagueService';
import { TodMatchCenter } from './TodMatchCenter';

interface MatchDetailsProps {
  item: StreamItemMeta;
  sources: StreamSource[];
  activeSourceIndex: number;
  onSelectSource: (index: number) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onOpenMultiView?: () => void;
  onJumpToTimelineMinute?: (minute: number) => void;
}

export const MatchDetails: React.FC<MatchDetailsProps> = ({
  item,
  sources,
  activeSourceIndex,
  onSelectSource,
  isFavorite,
  onToggleFavorite,
  onOpenMultiView,
  onJumpToTimelineMinute,
}) => {
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState<string>('');
  const [selectedAudioCommentary, setSelectedAudioCommentary] = useState<string>('English');

  const kickoffDate = parseKickoffDate(item.releaseInfo);
  const isRecap = isRecapOrHighlight(item);
  const isHighlight = isHighlightOnly(item);
  const league = getLeagueForMatch(item.name, item.genres, item.description);
  const compBadge = getCompetitionBadge(item.name, item.genres, item.description);

  useEffect(() => {
    if (!kickoffDate || isRecap) {
      setCountdown('');
      return;
    }

    const updateCountdown = () => {
      const diff = kickoffDate.getTime() - new Date().getTime();
      if (diff <= 0) {
        setCountdown('Match in progress');
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      if (days > 0) {
        setCountdown(`Starts in ${days}d ${hours}h ${minutes}m`);
      } else {
        setCountdown(`Starts in ${hours}h ${minutes}m ${seconds}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [kickoffDate, isRecap]);

  const handleCopyLink = () => {
    const currentUrl = sources[activeSourceIndex]?.url || window.location.href;
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="match-active-details" className="space-y-4">
      {/* Primary Match Context Card */}
      <div className="bg-[#0e121b] border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {isRecap ? (
                <span className="px-2.5 py-0.5 rounded-md bg-violet-500/20 text-violet-300 text-xs font-semibold border border-violet-500/30">
                  {isHighlight ? 'Match Highlights' : 'Full Match Replay'}
                </span>
              ) : countdown.includes('in progress') ? (
                <span className="px-2.5 py-0.5 rounded-md bg-red-500/20 text-red-400 text-xs font-semibold border border-red-500/30 flex items-center gap-1.5 animate-pulse">
                  <Radio size={12} />
                  Live Broadcast
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 flex items-center gap-1.5">
                  <Clock size={12} />
                  {countdown || 'Upcoming Fixture'}
                </span>
              )}

              {/* Competition Badge */}
              <span
                className={`px-2.5 py-0.5 rounded-md text-xs font-semibold border flex items-center gap-1.5 shadow-xs ${league.badgeStyle.bg} ${league.badgeStyle.text} ${league.badgeStyle.border}`}
              >
                <span>{compBadge.flag}</span>
                <span>{compBadge.label}</span>
              </span>

              {item.genres?.map((genre, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 text-xs font-medium"
                >
                  {genre}
                </span>
              ))}
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">{item.name}</h1>
            {item.releaseInfo && (
              <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
                <Calendar size={13} className="text-zinc-500" />
                <span>{item.releaseInfo}</span>
                {item.runtime && <span className="text-zinc-500">· Duration {item.runtime}</span>}
              </p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {onOpenMultiView && (
              <button
                onClick={onOpenMultiView}
                className="px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/40 transition-all"
                title="Watch with another match in MultiView"
              >
                <Columns size={14} className="text-cyan-400" />
                <span>MultiView</span>
              </button>
            )}

            <button
              id="favorite-active-btn"
              onClick={(e) => onToggleFavorite(item.id, e)}
              className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 border transition-all ${
                isFavorite
                  ? 'bg-amber-400/10 border-amber-400/30 text-amber-300'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-750'
              }`}
            >
              <Star size={14} fill={isFavorite ? 'currentColor' : 'none'} />
              {isFavorite ? 'Saved' : 'Favorite'}
            </button>

            <button
              id="copy-stream-source-btn"
              onClick={handleCopyLink}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-zinc-300 hover:text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all"
              title="Copy current video stream URL"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy Stream'}
            </button>
          </div>
        </div>

        {/* Stream Feeds Selector (if multiple sources exist) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Server size={13} className="text-violet-400" />
              Stream Feeds & CDNs ({sources.length})
            </span>
            <span className="text-[11px] text-zinc-500 flex items-center gap-1">
              <ShieldCheck size={12} className="text-emerald-400" />
              TOD Fast Ingest CDN
            </span>
          </div>

          {sources.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {sources.map((src, index) => {
                const isSelected = activeSourceIndex === index;
                return (
                  <button
                    key={index}
                    id={`select-source-${index}`}
                    onClick={() => onSelectSource(index)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-violet-600/20 border-violet-500 text-white shadow-sm'
                        : 'bg-zinc-950/60 border-white/5 text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-zinc-200 truncate">
                        {src.name || `Channel ${index + 1}`}
                      </span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
                      )}
                    </div>
                    {src.title && (
                      <span className="text-[11px] text-zinc-400 line-clamp-1 leading-tight">
                        {src.title}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-3 bg-zinc-950/40 rounded-xl border border-white/5 text-xs text-zinc-400 flex items-center gap-2">
              <Info size={14} className="text-zinc-500" />
              Querying stream sources from manifest...
            </div>
          )}
        </div>

        {/* Description / Broadcast Notes */}
        {item.description && (
          <div className="pt-2 text-xs text-zinc-400 border-t border-white/5 space-y-1">
            <span className="font-semibold text-zinc-300">Match Details & Broadcast Notes:</span>
            <p className="whitespace-pre-line leading-relaxed text-zinc-400">{item.description}</p>
          </div>
        )}
      </div>

      {/* TOD360 Match Center (Timeline, Opta Stats, Lineups & Pitch, H2H, Commentary) */}
      <TodMatchCenter
        item={item}
        isLive={countdown.includes('in progress') || !isRecap}
        selectedAudioCommentary={selectedAudioCommentary}
        onSelectAudioCommentary={(lang) => setSelectedAudioCommentary(lang)}
        onJumpToTimelineMinute={onJumpToTimelineMinute}
      />
    </div>
  );
};

