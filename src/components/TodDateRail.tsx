import React from 'react';
import { Calendar, Flame } from 'lucide-react';

export type DateFilterType = 'all' | 'yesterday' | 'today' | 'tomorrow' | 'upcoming';

interface TodDateRailProps {
  activeDateFilter: DateFilterType;
  onSelectDateFilter: (filter: DateFilterType) => void;
  counts: {
    all: number;
    yesterday: number;
    today: number;
    tomorrow: number;
    upcoming: number;
  };
}

export const TodDateRail: React.FC<TodDateRailProps> = ({
  activeDateFilter,
  onSelectDateFilter,
  counts,
}) => {
  const options: Array<{ id: DateFilterType; label: string; subLabel: string; isLiveToday?: boolean }> = [
    { id: 'all', label: 'All Matchdays', subLabel: 'Full Schedule' },
    { id: 'yesterday', label: 'Yesterday', subLabel: 'Completed & Recaps' },
    { id: 'today', label: 'Today', subLabel: 'Live & Imminent', isLiveToday: true },
    { id: 'tomorrow', label: 'Tomorrow', subLabel: 'Next Fixtures' },
    { id: 'upcoming', label: 'Weekend / Later', subLabel: 'Upcoming Rounds' },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
      {options.map((opt) => {
        const isSelected = activeDateFilter === opt.id;
        const count = counts[opt.id];

        return (
          <button
            key={opt.id}
            id={`date-rail-${opt.id}`}
            onClick={() => onSelectDateFilter(opt.id)}
            className={`px-3.5 py-2 rounded-xl text-left transition-all shrink-0 flex items-center gap-2.5 border ${
              isSelected
                ? 'bg-gradient-to-r from-violet-700 to-indigo-600 border-violet-500/50 text-white shadow-md shadow-violet-700/20'
                : 'bg-[#10141e] border-white/5 text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            {opt.isLiveToday && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white tracking-tight">{opt.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isSelected ? 'bg-black/30 text-white' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {count}
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 block -mt-0.5">{opt.subLabel}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
