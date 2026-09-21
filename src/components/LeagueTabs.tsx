import React from 'react';
import { Trophy, Globe2 } from 'lucide-react';
import { TOP_5_LEAGUES, MAJOR_TOURNAMENTS, LeagueDefinition } from '../services/leagueService';

interface LeagueTabsProps {
  activeLeagueId: string;
  onSelectLeague: (leagueId: string) => void;
  leagueCounts: Record<string, number>;
  totalAllCount: number;
}

export const LeagueTabs: React.FC<LeagueTabsProps> = ({
  activeLeagueId,
  onSelectLeague,
  leagueCounts,
  totalAllCount,
}) => {
  return (
    <div className="space-y-2.5">
      {/* Header with Title */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <Trophy size={12} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            Competitions
          </span>
        </div>

        {/* Indicator */}
        <div className="text-[11px] text-zinc-500">
          Top 5 Leagues, Domestic Cups & Major Tournaments
        </div>
      </div>

      {/* Tabs Container */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar scroll-smooth">
        {/* All Competitions Tab */}
        <button
          id="league-tab-all"
          onClick={() => onSelectLeague('all')}
          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 border ${
            activeLeagueId === 'all'
              ? 'bg-zinc-100 text-zinc-950 border-white shadow-md'
              : 'bg-zinc-900/90 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850 border-zinc-800/90'
          }`}
        >
          <Globe2 size={13} />
          <span>All Competitions</span>
          <span
            className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
              activeLeagueId === 'all' ? 'bg-zinc-300 text-zinc-900' : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            {totalAllCount}
          </span>
        </button>

        {/* Separator before Top 5 */}
        <div className="h-6 w-px bg-zinc-800 shrink-0 mx-0.5" />

        {/* TOP 5 LEAGUES & DOMESTIC CUPS */}
        {TOP_5_LEAGUES.map((league) => {
          const count = leagueCounts[league.id] || 0;
          const isActive = activeLeagueId === league.id;

          return (
            <button
              key={league.id}
              id={`league-tab-${league.id}`}
              onClick={() => onSelectLeague(league.id)}
              className={`relative px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 border ${
                isActive
                  ? `${league.activeTabStyle} border-transparent shadow-lg`
                  : 'bg-zinc-900/90 text-zinc-300 hover:text-white hover:bg-zinc-850 border-zinc-800/90'
              }`}
            >
              <span className="text-sm leading-none" role="img" aria-label={league.name}>
                {league.flag}
              </span>
              <span className="font-semibold">{league.name}</span>

              {/* Count badge */}
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                  isActive ? 'bg-black/30 text-white' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}

        {/* Separator before Major Tournaments */}
        <div className="h-6 w-px bg-zinc-800 shrink-0 mx-0.5" />

        {/* MAJOR EUROPEAN & INTERNATIONAL TOURNAMENTS */}
        {MAJOR_TOURNAMENTS.map((tournament) => {
          const count = leagueCounts[tournament.id] || 0;
          const isActive = activeLeagueId === tournament.id;

          // For international tournaments, only show if there are fixtures
          if (tournament.id === 'international_tournaments' && count === 0) {
            return null;
          }

          return (
            <button
              key={tournament.id}
              id={`league-tab-${tournament.id}`}
              onClick={() => onSelectLeague(tournament.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 border ${
                isActive
                  ? `${tournament.activeTabStyle} border-transparent shadow-lg`
                  : 'bg-zinc-900/90 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850 border-zinc-800/90'
              }`}
            >
              <span className="text-sm leading-none" role="img" aria-label={tournament.name}>
                {tournament.flag}
              </span>
              <span>{tournament.shortName}</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                  isActive ? 'bg-black/30 text-white' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
