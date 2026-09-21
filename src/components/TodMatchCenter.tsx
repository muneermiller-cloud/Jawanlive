import React, { useState } from 'react';
import {
  Activity,
  Clock,
  Users,
  Shield,
  BarChart2,
  Volume2,
  Flame,
  Radio,
  Award,
  ChevronRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { StreamItemMeta } from '../types';
import { generateMatchIntelligence, MatchIntelligence, MatchEvent } from '../services/matchIntelligenceService';

interface TodMatchCenterProps {
  item: StreamItemMeta;
  isLive: boolean;
  selectedAudioCommentary: string;
  onSelectAudioCommentary: (lang: string) => void;
  onJumpToTimelineMinute?: (minute: number) => void;
}

export const TodMatchCenter: React.FC<TodMatchCenterProps> = ({
  item,
  isLive,
  selectedAudioCommentary,
  onSelectAudioCommentary,
  onJumpToTimelineMinute,
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'timeline' | 'lineups' | 'h2h' | 'audio'>('timeline');
  const [lineupTeam, setLineupTeam] = useState<'home' | 'away'>('home');

  const intel: MatchIntelligence = React.useMemo(() => {
    return generateMatchIntelligence(item.name, isLive);
  }, [item.name, isLive]);

  return (
    <div className="bg-[#0e121b] border border-white/10 rounded-2xl p-5 shadow-xl space-y-5 text-white">
      {/* TOD360 Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-violet-600/30 font-black text-xs tracking-wider">
            TOD
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                TOD360™ Match Center
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                PRO STATS
              </span>
              {isLive && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  LIVE SYNC
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
              <MapPin size={11} className="text-zinc-500" />
              <span>{intel.stadium}</span>
              <span className="text-zinc-600">·</span>
              <span>Ref: {intel.referee}</span>
            </p>
          </div>
        </div>

        {/* Quick Commentary Feed Selector Badge */}
        <div className="flex items-center gap-1.5 bg-zinc-900/90 border border-white/10 p-1 rounded-xl text-xs">
          <Volume2 size={13} className="text-cyan-400 ml-1.5" />
          <span className="text-[11px] text-zinc-400">Audio:</span>
          <button
            onClick={() => setActiveTab('audio')}
            className="px-2 py-0.5 bg-violet-600 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 hover:bg-violet-500 transition-colors"
          >
            <span>{selectedAudioCommentary}</span>
            <ChevronRight size={11} />
          </button>
        </div>
      </div>

      {/* TOD360 Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-white/5">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
            activeTab === 'timeline'
              ? 'bg-violet-600 text-white shadow-sm shadow-violet-600/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
          }`}
        >
          <Clock size={13} />
          <span>Key Timeline</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30">
            {intel.events.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
            activeTab === 'stats'
              ? 'bg-violet-600 text-white shadow-sm shadow-violet-600/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
          }`}
        >
          <BarChart2 size={13} />
          <span>Opta Stats</span>
        </button>

        <button
          onClick={() => setActiveTab('lineups')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
            activeTab === 'lineups'
              ? 'bg-violet-600 text-white shadow-sm shadow-violet-600/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
          }`}
        >
          <Users size={13} />
          <span>Lineups & Pitch</span>
        </button>

        <button
          onClick={() => setActiveTab('h2h')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
            activeTab === 'h2h'
              ? 'bg-violet-600 text-white shadow-sm shadow-violet-600/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
          }`}
        >
          <TrendingUp size={13} />
          <span>Head-to-Head & Form</span>
        </button>

        <button
          onClick={() => setActiveTab('audio')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
            activeTab === 'audio'
              ? 'bg-violet-600 text-white shadow-sm shadow-violet-600/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
          }`}
        >
          <Volume2 size={13} />
          <span>Audio Feeds</span>
        </button>
      </div>

      {/* Tab 1: KEY TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
            <span>Match Incidents & Moments</span>
            <span className="text-[11px] text-violet-400">Click any moment to jump</span>
          </div>

          <div className="space-y-2 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
            {intel.events.map((evt, idx) => {
              const isGoal = evt.type === 'goal';
              const isCard = evt.type === 'card';
              const isSub = evt.type === 'sub';
              const isHalf = evt.type === 'halftime';

              return (
                <div
                  key={idx}
                  onClick={() => onJumpToTimelineMinute && onJumpToTimelineMinute(evt.minute)}
                  className={`group relative flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isGoal
                      ? 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/15'
                      : isCard
                      ? 'bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/15'
                      : 'bg-zinc-900/60 border-white/5 hover:bg-white/5'
                  }`}
                >
                  {/* Minute Badge */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10 border ${
                      isGoal
                        ? 'bg-emerald-600 border-emerald-400 text-white shadow-md shadow-emerald-600/40'
                        : isCard
                        ? 'bg-amber-600 border-amber-400 text-black'
                        : isHalf
                        ? 'bg-zinc-800 border-zinc-600 text-zinc-300'
                        : 'bg-violet-900/80 border-violet-500 text-violet-200'
                    }`}
                  >
                    {evt.minute}'
                  </div>

                  {/* Incident Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate">
                        {isGoal && '⚽ '}
                        {isCard && '🟨 '}
                        {isSub && '🔄 '}
                        {isHalf && '⏱️ '}
                        {evt.player}
                      </span>
                      {evt.scoreAfter && (
                        <span className="px-1.5 py-0.2 rounded bg-white/10 text-white font-mono text-[10px] font-bold">
                          {evt.scoreAfter}
                        </span>
                      )}
                    </div>
                    {evt.detail && (
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">{evt.detail}</p>
                    )}
                  </div>

                  {/* Team Tag */}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                      evt.team === 'home'
                        ? 'bg-indigo-500/20 text-indigo-300'
                        : evt.team === 'away'
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {evt.team === 'home' ? intel.homeShort : evt.team === 'away' ? intel.awayShort : 'Match'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: OPTA STATS */}
      {activeTab === 'stats' && (
        <div className="space-y-4">
          {/* Header Teams with colors */}
          <div className="flex items-center justify-between px-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
            <span className="flex items-center gap-1.5 text-white">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: intel.homeColor }} />
              {intel.homeTeam}
            </span>
            <span className="text-[11px] text-zinc-500">Live Match Statistics</span>
            <span className="flex items-center gap-1.5 text-white">
              {intel.awayTeam}
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: intel.awayColor }} />
            </span>
          </div>

          {/* Possession Bar */}
          <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-white/5 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-white font-bold">{intel.stats.possessionHome}%</span>
              <span className="text-zinc-400 uppercase text-[10px] tracking-wider">Ball Possession</span>
              <span className="text-white font-bold">{intel.stats.possessionAway}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-zinc-800 flex overflow-hidden p-0.5">
              <div
                className="h-full rounded-l-full transition-all duration-700"
                style={{ width: `${intel.stats.possessionHome}%`, backgroundColor: intel.homeColor || '#6366f1' }}
              />
              <div
                className="h-full rounded-r-full transition-all duration-700"
                style={{ width: `${intel.stats.possessionAway}%`, backgroundColor: intel.awayColor || '#06b6d4' }}
              />
            </div>
          </div>

          {/* Key Metric Rows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <StatRow
              label="Expected Goals (xG)"
              homeVal={intel.stats.xgHome}
              awayVal={intel.stats.xgAway}
              highlight
            />
            <StatRow
              label="Total Shots"
              homeVal={intel.stats.shotsHome}
              awayVal={intel.stats.shotsAway}
            />
            <StatRow
              label="Shots on Target"
              homeVal={intel.stats.shotsOnTargetHome}
              awayVal={intel.stats.shotsOnTargetAway}
            />
            <StatRow
              label="Dangerous Attacks"
              homeVal={intel.stats.dangerousAttacksHome}
              awayVal={intel.stats.dangerousAttacksAway}
            />
            <StatRow
              label="Pass Accuracy"
              homeVal={`${intel.stats.passAccuracyHome}%`}
              awayVal={`${intel.stats.passAccuracyAway}%`}
            />
            <StatRow
              label="Corner Kicks"
              homeVal={intel.stats.cornersHome}
              awayVal={intel.stats.cornersAway}
            />
            <StatRow
              label="Fouls Committed"
              homeVal={intel.stats.foulsHome}
              awayVal={intel.stats.foulsAway}
            />
            <StatRow
              label="Yellow Cards"
              homeVal={intel.stats.yellowCardsHome}
              awayVal={intel.stats.yellowCardsAway}
            />
          </div>
        </div>
      )}

      {/* Tab 3: LINEUPS & 2D PITCH */}
      {activeTab === 'lineups' && (
        <div className="space-y-3">
          {/* Team Toggle Bar */}
          <div className="flex items-center justify-between bg-zinc-900/80 p-1.5 rounded-xl border border-white/5">
            <button
              onClick={() => setLineupTeam('home')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                lineupTeam === 'home'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: intel.homeColor }} />
              <span>{intel.homeTeam} ({intel.homeLineup.formation})</span>
            </button>
            <button
              onClick={() => setLineupTeam('away')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                lineupTeam === 'away'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: intel.awayColor }} />
              <span>{intel.awayTeam} ({intel.awayLineup.formation})</span>
            </button>
          </div>

          {/* 2D Football Pitch */}
          {(() => {
            const lineup = lineupTeam === 'home' ? intel.homeLineup : intel.awayLineup;
            const shirtColor = lineupTeam === 'home' ? intel.homeColor : intel.awayColor;

            return (
              <div className="space-y-3">
                <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-emerald-500/30 bg-gradient-to-b from-[#115024] via-[#0d3d1b] to-[#0a2f15] shadow-inner p-3">
                  {/* Pitch markings */}
                  <div className="absolute inset-2 border border-white/20 rounded-xl pointer-events-none" />
                  <div className="absolute left-1/2 top-2 bottom-2 w-px bg-white/20 -translate-x-1/2 pointer-events-none" />
                  <div className="absolute left-1/2 top-1/2 w-20 h-20 border border-white/20 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                  <div className="absolute left-2 top-1/2 w-14 h-28 border border-white/20 -translate-y-1/2 rounded-r-xl pointer-events-none" />
                  <div className="absolute right-2 top-1/2 w-14 h-28 border border-white/20 -translate-y-1/2 rounded-l-xl pointer-events-none" />

                  {/* Manager Tag in Corner */}
                  <div className="absolute bottom-3 left-4 text-[10px] bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded border border-white/10 text-zinc-300">
                    Manager: <span className="text-white font-semibold">{lineup.manager}</span>
                  </div>

                  {/* Starting XI Nodes on Pitch */}
                  {lineup.startingXI.map((player, idx) => (
                    <div
                      key={idx}
                      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-default group"
                      style={{
                        left: `${player.gridPos.x}%`,
                        top: `${player.gridPos.y}%`,
                      }}
                    >
                      <div
                        className="w-6 h-6 rounded-full border border-white/80 shadow-md flex items-center justify-center font-bold text-[10px] text-white transition-transform group-hover:scale-125"
                        style={{ backgroundColor: shirtColor || '#4f46e5' }}
                      >
                        {player.number}
                      </div>
                      <span className="text-[9px] font-semibold text-white/90 bg-black/70 px-1 rounded mt-0.5 truncate max-w-[65px] border border-white/10 shadow-xs">
                        {player.name}
                        {player.isCaptain && ' (C)'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Substitutes Bench */}
                <div className="p-3 bg-zinc-900/60 rounded-xl border border-white/5">
                  <span className="text-[11px] font-semibold text-zinc-400 block mb-1.5 uppercase tracking-wider">
                    Substitutes Bench
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {lineup.bench.map((b, bIdx) => (
                      <span
                        key={bIdx}
                        className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded text-[11px] border border-white/5"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Tab 4: HEAD TO HEAD & FORM */}
      {activeTab === 'h2h' && (
        <div className="space-y-4 text-xs">
          {/* Recent Form */}
          <div className="grid grid-cols-2 gap-3 bg-zinc-900/80 p-3.5 rounded-xl border border-white/5">
            <div>
              <span className="font-bold text-white block mb-1.5">{intel.homeTeam} Form</span>
              <div className="flex items-center gap-1">
                {intel.headToHead.homeForm.map((res, idx) => (
                  <span
                    key={idx}
                    className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] ${
                      res === 'W'
                        ? 'bg-emerald-600 text-white'
                        : res === 'D'
                        ? 'bg-amber-600 text-black'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    {res}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="font-bold text-white block mb-1.5">{intel.awayTeam} Form</span>
              <div className="flex items-center gap-1">
                {intel.headToHead.awayForm.map((res, idx) => (
                  <span
                    key={idx}
                    className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] ${
                      res === 'W'
                        ? 'bg-emerald-600 text-white'
                        : res === 'D'
                        ? 'bg-amber-600 text-black'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    {res}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* TOD FanZone Prediction Meter */}
          <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Flame size={13} className="text-amber-400" />
                TOD FanZone Community Prediction
              </span>
              <span className="text-[11px] text-zinc-400">12,480 Fan Votes</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
              <div className="bg-zinc-800/80 p-2 rounded-lg border border-indigo-500/30">
                <span className="block text-[10px] text-zinc-400 truncate">{intel.homeShort} Win</span>
                <span className="font-bold text-indigo-400 text-sm">{intel.fanPrediction.homePercent}%</span>
              </div>
              <div className="bg-zinc-800/80 p-2 rounded-lg border border-white/5">
                <span className="block text-[10px] text-zinc-400">Draw</span>
                <span className="font-bold text-zinc-300 text-sm">{intel.fanPrediction.drawPercent}%</span>
              </div>
              <div className="bg-zinc-800/80 p-2 rounded-lg border border-cyan-500/30">
                <span className="block text-[10px] text-zinc-400 truncate">{intel.awayShort} Win</span>
                <span className="font-bold text-cyan-400 text-sm">{intel.fanPrediction.awayPercent}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: AUDIO COMMENTARY & LANGUAGE FEEDS */}
      {activeTab === 'audio' && (
        <div className="space-y-3">
          <div className="text-xs text-zinc-400">
            TOD broadcasts premium multi-language commentary and surround stadium audio:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              {
                id: 'English',
                name: '🇬🇧 English (Main Broadcast)',
                desc: 'Official Premier League / UEFA International Commentary feed',
                badge: 'Dolby Atmos',
              },
              {
                id: 'Arabic',
                name: '🇸🇦 Arabic (TOD Signature)',
                desc: 'Passionate beIN SPORTS commentary with Issam Chaouali & Hafid Derradji',
                badge: 'High Energy',
              },
              {
                id: 'Spanish',
                name: '🇪🇸 Spanish (Castellano)',
                desc: 'La Liga TV official commentators and pitchside analysts',
                badge: 'HD Stereo',
              },
              {
                id: 'Stadium Ambience',
                name: '🏟️ Stadium Ambience (Crowd Only)',
                desc: 'Pure authentic crowd noise, chants, and pitch microphones with no commentary',
                badge: 'Immersive',
              },
            ].map((feed) => {
              const isSelected = selectedAudioCommentary === feed.id;

              return (
                <button
                  key={feed.id}
                  onClick={() => onSelectAudioCommentary(feed.id)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-start justify-between ${
                    isSelected
                      ? 'bg-violet-600/20 border-violet-500 text-white shadow-sm'
                      : 'bg-zinc-900/60 border-white/5 text-zinc-300 hover:bg-white/5'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{feed.name}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-zinc-300 font-mono">
                        {feed.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-snug">{feed.desc}</p>
                  </div>
                  {isSelected && (
                    <CheckCircle2 size={16} className="text-violet-400 shrink-0 ml-2 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

interface StatRowProps {
  label: string;
  homeVal: string | number;
  awayVal: string | number;
  highlight?: boolean;
}

const StatRow: React.FC<StatRowProps> = ({ label, homeVal, awayVal, highlight = false }) => {
  return (
    <div
      className={`p-2.5 rounded-xl border flex items-center justify-between ${
        highlight
          ? 'bg-violet-950/30 border-violet-500/20 text-white'
          : 'bg-zinc-900/60 border-white/5 text-zinc-300'
      }`}
    >
      <span className="font-bold text-sm w-12 text-left text-white">{homeVal}</span>
      <span className="text-[11px] text-zinc-400 text-center flex-1">{label}</span>
      <span className="font-bold text-sm w-12 text-right text-white">{awayVal}</span>
    </div>
  );
};
