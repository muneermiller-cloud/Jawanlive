import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Tv,
  Radio,
  Search,
  RotateCw,
  Globe,
  Link as LinkIcon,
  Film,
  Calendar,
  Star,
  Flame,
  AlertCircle,
  SlidersHorizontal,
  Layers,
  Sparkles,
  Trophy,
  Laptop,
  LayoutGrid,
  List,
  ArrowUpDown,
  Keyboard,
  Clock,
  Columns,
} from 'lucide-react';
import { StremioManifest, StreamItemMeta, StreamSource } from './types';
import {
  fetchManifest,
  fetchCatalog,
  fetchItemStreams,
  getSavedManifestUrl,
  saveManifestUrl,
  DEFAULT_MANIFEST_URL,
  parseKickoffDate,
} from './services/streamService';
import { VideoPlayer } from './components/VideoPlayer';
import { MatchCard } from './components/MatchCard';
import { MatchListRow } from './components/MatchListRow';
import { MatchDetails } from './components/MatchDetails';
import { ManifestModal } from './components/ManifestModal';
import { DirectStreamModal } from './components/DirectStreamModal';
import { SelfHostModal } from './components/SelfHostModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { LeagueTabs } from './components/LeagueTabs';
import { TodHeroSpotlight } from './components/TodHeroSpotlight';
import { TodDateRail, DateFilterType } from './components/TodDateRail';
import { TodMultiView } from './components/TodMultiView';
import {
  ALL_LEAGUES,
  TOP_5_LEAGUES,
  getLeagueForMatch,
  getLeagueItemCounts,
  filterItemsByLeague,
  isAllowedCompetition,
  isRecapOrHighlight,
  isHighlightOnly,
} from './services/leagueService';

const FAVORITES_KEY = 'live_stream_favorites';

export default function App() {
  const [manifestUrl, setManifestUrl] = useState<string>(getSavedManifestUrl());
  const [manifest, setManifest] = useState<StremioManifest | null>(null);

  // Catalog items
  const [activeCatalogTab, setActiveCatalogTab] = useState<string>('all_feeds');
  const [activeLeagueTab, setActiveLeagueTab] = useState<string>('all');
  const [itemsByCatalog, setItemsByCatalog] = useState<Record<string, StreamItemMeta[]>>({});
  const [isLoadingCatalog, setIsLoadingCatalog] = useState<boolean>(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  // Active Stream Item in player
  const [selectedItem, setSelectedItem] = useState<StreamItemMeta | null>(null);
  const [sources, setSources] = useState<StreamSource[]>([]);
  const [activeSourceIndex, setActiveSourceIndex] = useState<number>(0);
  const [isLoadingStreams, setIsLoadingStreams] = useState<boolean>(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [genreFilter, setGenreFilter] = useState<string>('All');

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI Modals & Display modes
  const [isManifestModalOpen, setIsManifestModalOpen] = useState(false);
  const [isDirectStreamModalOpen, setIsDirectStreamModalOpen] = useState(false);
  const [isSelfHostModalOpen, setIsSelfHostModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  // View & Filter preferences
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'upcoming' | 'replays'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'time' | 'league' | 'title'>('default');
  const [activeDateFilter, setActiveDateFilter] = useState<DateFilterType>('all');

  // TOD MultiView (Dual-Screen) state
  const [isMultiViewOpen, setIsMultiViewOpen] = useState(false);
  const [secondaryItem, setSecondaryItem] = useState<StreamItemMeta | null>(null);
  const [secondarySources, setSecondarySources] = useState<StreamSource[]>([]);
  const [activeSecondarySourceIndex, setActiveSecondarySourceIndex] = useState<number>(0);

  const playerStageRef = useRef<HTMLDivElement>(null);

  // Global keyboard listener for shortcuts modal
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        setIsShortcutsModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites', e);
    }
  }, [favorites]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Initial load: fetch manifest and all catalogs
  const loadAllData = async (url: string = manifestUrl) => {
    setIsLoadingCatalog(true);
    setCatalogError(null);
    try {
      const mani = await fetchManifest(url);
      setManifest(mani);

      // Fetch catalogs concurrently
      const catalogPromises = (mani.catalogs || []).map(async (cat) => {
        try {
          const metas = await fetchCatalog(url, cat.type, cat.id);
          return { id: cat.id, metas };
        } catch (err) {
          console.warn(`Failed to fetch catalog ${cat.id}:`, err);
          return { id: cat.id, metas: [] };
        }
      });

      const results = await Promise.all(catalogPromises);
      const itemsMap: Record<string, StreamItemMeta[]> = {};
      results.forEach((res) => {
        // Enforce strict top 5 leagues, domestic cups, and major tournament filtering on all catalogs
        itemsMap[res.id] = (res.metas || []).filter(isAllowedCompetition);
      });
      setItemsByCatalog(itemsMap);

      // If no item is currently selected, pick the first allowed item for immediate playback
      const initialLive = itemsMap['sports_live'] || [];
      const initialRecaps = itemsMap['sports_recaps'] || [];
      const initialFootball = itemsMap['sports_football'] || [];
      const defaultItem = initialLive[0] || initialRecaps[0] || initialFootball[0];

      if (defaultItem && !selectedItem) {
        handleSelectItem(defaultItem, url);
      }
    } catch (err: any) {
      console.error('Error loading streaming manifest:', err);
      setCatalogError(err.message || 'Unable to connect to stream manifest');
    } finally {
      setIsLoadingCatalog(false);
    }
  };

  useEffect(() => {
    loadAllData(manifestUrl);
  }, []);

  // When an item is chosen, fetch its stream sources
  const handleSelectItem = async (item: StreamItemMeta, url: string = manifestUrl) => {
    setSelectedItem(item);
    setIsLoadingStreams(true);
    setActiveSourceIndex(0);

    try {
      const streamSources = await fetchItemStreams(url, item.type || 'sport', item.id);
      setSources(streamSources);
    } catch (err) {
      console.error('Failed to fetch streams for item:', item.id, err);
      setSources([]);
    } finally {
      setIsLoadingStreams(false);
    }

    // Smooth scroll to video player if not already in view
    if (playerStageRef.current && window.scrollY > 300) {
      playerStageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle direct stream custom playback
  const handlePlayDirectStream = (title: string, customSource: StreamSource) => {
    const customItem: StreamItemMeta = {
      id: `custom:${Date.now()}`,
      type: 'sport',
      name: title,
      releaseInfo: 'Direct URL Stream',
      description: `Custom direct feed from: ${customSource.url}`,
    };
    setSelectedItem(customItem);
    setSources([customSource]);
    setActiveSourceIndex(0);

    if (playerStageRef.current) {
      playerStageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Change manifest URL handler
  const handleSaveManifestUrl = async (newUrl: string) => {
    saveManifestUrl(newUrl);
    setManifestUrl(newUrl);
    await loadAllData(newUrl);
  };

  // Add a match to TOD MultiView dual-screen
  const handleAddToMultiView = async (item: StreamItemMeta, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSecondaryItem(item);
    setIsMultiViewOpen(true);

    try {
      const sSources = await fetchItemStreams(manifestUrl, item.type || 'sport', item.id);
      setSecondarySources(sSources);
      setActiveSecondarySourceIndex(0);
    } catch (err) {
      console.error('Failed to load secondary stream sources:', err);
      setSecondarySources([]);
    }

    if (playerStageRef.current) {
      playerStageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Swap primary and secondary screens in MultiView
  const handleSwapMultiView = () => {
    if (!secondaryItem || !selectedItem) return;
    const tempItem = selectedItem;
    const tempSources = sources;
    const tempIdx = activeSourceIndex;

    setSelectedItem(secondaryItem);
    setSources(secondarySources);
    setActiveSourceIndex(activeSecondarySourceIndex);

    setSecondaryItem(tempItem);
    setSecondarySources(tempSources);
    setActiveSecondarySourceIndex(tempIdx);
  };

  // Deduplicate all unique items across catalogs (filtered strictly to Top 5 leagues, domestic cups, and major tournaments)
  const allUniqueItems = useMemo(() => {
    const map = new Map<string, StreamItemMeta>();
    // Priority order: live first, then today, then football, then recaps
    const order = ['sports_live', 'sports_today', 'sports_football', 'sports_recaps'];
    order.forEach((catId) => {
      (itemsByCatalog[catId] || []).forEach((item) => {
        if (isAllowedCompetition(item) && !map.has(item.id)) {
          map.set(item.id, item);
        }
      });
    });
    // Add any others
    Object.values(itemsByCatalog).flat().forEach((item) => {
      if (isAllowedCompetition(item) && !map.has(item.id)) {
        map.set(item.id, item);
      }
    });
    return Array.from(map.values());
  }, [itemsByCatalog]);

  // League counts across all feeds (so user always sees total available fixtures in each league)
  const leagueCountsAcrossAll = useMemo(() => {
    return getLeagueItemCounts(allUniqueItems);
  }, [allUniqueItems]);

  // Combine items according to active feed/catalog tab
  const currentTabRawItems = useMemo(() => {
    if (activeCatalogTab === 'all_feeds') {
      return allUniqueItems;
    }
    if (activeCatalogTab === 'favorites') {
      const map = new Map<string, StreamItemMeta>();
      allUniqueItems.forEach((it) => {
        if (favorites.includes(it.id)) {
          map.set(it.id, it);
        }
      });
      return Array.from(map.values());
    }

    const raw = itemsByCatalog[activeCatalogTab] || [];
    return raw.filter(isAllowedCompetition);
  }, [activeCatalogTab, allUniqueItems, itemsByCatalog, favorites]);

  // League counts for current tab
  const leagueCountsCurrentTab = useMemo(() => {
    return getLeagueItemCounts(currentTabRawItems);
  }, [currentTabRawItems]);

  // Current tab items filtered by selected league
  const currentLeagueFilteredItems = useMemo(() => {
    return filterItemsByLeague(currentTabRawItems, activeLeagueTab);
  }, [currentTabRawItems, activeLeagueTab]);

  // Extract available genre tags for current tab and league
  const availableGenres = useMemo(() => {
    const set = new Set<string>();
    currentLeagueFilteredItems.forEach((it) => {
      it.genres?.forEach((g) => set.add(g));
    });
    return ['All', ...Array.from(set)];
  }, [currentLeagueFilteredItems]);

  // Status counts for matches in current league view
  const statusCounts = useMemo(() => {
    let live = 0;
    let upcoming = 0;
    let replays = 0;
    const now = new Date().getTime();

    currentLeagueFilteredItems.forEach((item) => {
      const isRecap = isRecapOrHighlight(item);
      const isLive = item.releaseInfo?.toLowerCase().includes('live') || item.category === 'live';
      const kickoff = parseKickoffDate(item.releaseInfo);
      const isUp = kickoff && kickoff.getTime() > now;

      if (isLive) live++;
      else if (isRecap) replays++;
      else if (isUp) upcoming++;
    });

    return {
      all: currentLeagueFilteredItems.length,
      live,
      upcoming,
      replays,
    };
  }, [currentLeagueFilteredItems]);

  // Date rail counts across current league view
  const dateCounts = useMemo(() => {
    let yesterday = 0;
    let today = 0;
    let tomorrow = 0;
    let upcoming = 0;

    const nowDate = new Date();
    const todayStr = nowDate.toDateString();

    const yestDate = new Date();
    yestDate.setDate(yestDate.getDate() - 1);
    const yestStr = yestDate.toDateString();

    const tomDate = new Date();
    tomDate.setDate(tomDate.getDate() + 1);
    const tomStr = tomDate.toDateString();

    currentLeagueFilteredItems.forEach((item) => {
      const isRecap = isRecapOrHighlight(item);
      const isLive = item.releaseInfo?.toLowerCase().includes('live') || item.category === 'live';
      const isTodayCat = itemsByCatalog['sports_today']?.some((it) => it.id === item.id);
      const kickoff = parseKickoffDate(item.releaseInfo);

      if (isLive || isTodayCat) {
        today++;
      } else if (kickoff) {
        const kStr = kickoff.toDateString();
        if (kStr === todayStr) today++;
        else if (kStr === yestStr) yesterday++;
        else if (kStr === tomStr) tomorrow++;
        else if (kickoff.getTime() > tomDate.getTime()) upcoming++;
        else yesterday++;
      } else if (isRecap) {
        yesterday++;
      } else {
        upcoming++;
      }
    });

    return {
      all: currentLeagueFilteredItems.length,
      yesterday,
      today,
      tomorrow,
      upcoming,
    };
  }, [currentLeagueFilteredItems, itemsByCatalog]);

  // Spotlight premier fixture for hero marquee
  const spotlightItem = useMemo(() => {
    const liveTop5 = allUniqueItems.find((it) => {
      const isLive = it.releaseInfo?.toLowerCase().includes('live') || it.category === 'live';
      const league = getLeagueForMatch(it.name, it.genres, it.description);
      return isLive && league.id !== 'other';
    });
    if (liveTop5) return liveTop5;

    const anyLive = allUniqueItems.find(
      (it) => it.releaseInfo?.toLowerCase().includes('live') || it.category === 'live'
    );
    if (anyLive) return anyLive;

    const premier = allUniqueItems.find((it) => {
      const league = getLeagueForMatch(it.name, it.genres, it.description);
      return TOP_5_LEAGUES.some((l) => l.id === league.id);
    });
    if (premier) return premier;

    return allUniqueItems[0] || null;
  }, [allUniqueItems]);

  // Filter items by status, date, search query & genre, then sort
  const filteredItems = useMemo(() => {
    const now = new Date().getTime();

    const result = currentLeagueFilteredItems.filter((item) => {
      const isRecap = isRecapOrHighlight(item);
      const isLive = item.releaseInfo?.toLowerCase().includes('live') || item.category === 'live';
      const kickoff = parseKickoffDate(item.releaseInfo);
      const isUpcoming = kickoff && kickoff.getTime() > now;

      // Status filter
      if (statusFilter === 'live' && !isLive) return false;
      if (statusFilter === 'upcoming' && !isUpcoming) return false;
      if (statusFilter === 'replays' && !isRecap) return false;

      // Date rail filter
      if (activeDateFilter !== 'all') {
        const isTodayCat = itemsByCatalog['sports_today']?.some((it) => it.id === item.id);
        const todayStr = new Date().toDateString();
        const yestDate = new Date();
        yestDate.setDate(yestDate.getDate() - 1);
        const tomDate = new Date();
        tomDate.setDate(tomDate.getDate() + 1);

        if (activeDateFilter === 'today') {
          const isMatchToday = isLive || isTodayCat || (kickoff && kickoff.toDateString() === todayStr);
          if (!isMatchToday) return false;
        } else if (activeDateFilter === 'yesterday') {
          const isMatchYest = (kickoff && kickoff.toDateString() === yestDate.toDateString()) || isRecap;
          if (!isMatchYest) return false;
        } else if (activeDateFilter === 'tomorrow') {
          const isMatchTom = kickoff && kickoff.toDateString() === tomDate.toDateString();
          if (!isMatchTom) return false;
        } else if (activeDateFilter === 'upcoming') {
          const isMatchUp = kickoff ? kickoff.getTime() > tomDate.getTime() : !isRecap && !isLive;
          if (!isMatchUp) return false;
        }
      }

      const matchesSearch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.releaseInfo?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGenre =
        genreFilter === 'All' ||
        item.genres?.includes(genreFilter) ||
        (genreFilter === 'Recap' && isRecap);

      return matchesSearch && matchesGenre;
    });

    if (sortBy === 'time') {
      return [...result].sort((a, b) => {
        const timeA = parseKickoffDate(a.releaseInfo)?.getTime() || 0;
        const timeB = parseKickoffDate(b.releaseInfo)?.getTime() || 0;
        return timeA - timeB;
      });
    } else if (sortBy === 'league') {
      return [...result].sort((a, b) => {
        const lA = getLeagueForMatch(a.name, a.genres, a.description).name;
        const lB = getLeagueForMatch(b.name, b.genres, b.description).name;
        return lA.localeCompare(lB);
      });
    } else if (sortBy === 'title') {
      return [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [
    currentLeagueFilteredItems,
    statusFilter,
    activeDateFilter,
    searchQuery,
    genreFilter,
    sortBy,
    itemsByCatalog,
  ]);

  const isCurrentItemLive =
    selectedItem?.releaseInfo?.toLowerCase().includes('live') ||
    selectedItem?.category === 'live';

  return (
    <div className="min-h-screen bg-[#080b12] text-zinc-100 flex flex-col font-sans antialiased selection:bg-violet-600 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#080b12]/90 backdrop-blur-md border-b border-white/10 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Logo - TOD Style */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-600/30">
              <Tv size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-wider text-white">TOD</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-violet-500/20 text-violet-300 border border-violet-500/40 uppercase tracking-widest">
                  TOD360™
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block font-medium">
                Live Football & 4K Ultra Broadcasts
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="flex-1 max-w-md mx-2">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
              />
              <input
                id="global-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search teams, fixtures, tournaments..."
                className="w-full bg-[#0e131f] hover:bg-[#131929] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* MultiView Toggle Button */}
            <button
              id="header-multiview-btn"
              onClick={() => {
                setIsMultiViewOpen((prev) => !prev);
                if (!secondaryItem && selectedItem) {
                  const nextMatch = allUniqueItems.find((it) => it.id !== selectedItem.id);
                  if (nextMatch) handleAddToMultiView(nextMatch);
                }
              }}
              className={`px-3 py-2 border rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isMultiViewOpen
                  ? 'bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-600/30'
                  : 'bg-[#0e131f] hover:bg-[#151c2e] border-white/10 text-zinc-300 hover:text-white'
              }`}
              title="Toggle TOD MultiView (Dual Match Screen)"
            >
              <Columns size={14} className={isMultiViewOpen ? 'text-white' : 'text-cyan-400'} />
              <span className="hidden sm:inline">MultiView</span>
            </button>

            <button
              id="open-self-host-btn"
              onClick={() => setIsSelfHostModalOpen(true)}
              className="px-3 py-2 bg-[#0e131f] hover:bg-[#151c2e] border border-white/10 text-zinc-300 hover:text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Guide to host and run this app on your own PC"
            >
              <Laptop size={14} className="text-amber-400" />
              <span className="hidden sm:inline">Run on PC</span>
            </button>

            <button
              id="open-direct-stream-btn"
              onClick={() => setIsDirectStreamModalOpen(true)}
              className="px-3 py-2 bg-[#0e131f] hover:bg-[#151c2e] border border-white/10 text-zinc-300 hover:text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Play Custom Stream URL"
            >
              <LinkIcon size={14} className="text-violet-400" />
              <span className="hidden md:inline">Custom Stream</span>
            </button>

            <button
              id="open-manifest-settings-btn"
              onClick={() => setIsManifestModalOpen(true)}
              className="px-3 py-2 bg-[#0e131f] hover:bg-[#151c2e] border border-white/10 text-zinc-300 hover:text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Manifest Provider Settings"
            >
              <Globe size={14} className="text-emerald-400" />
              <span className="hidden md:inline">Manifest</span>
            </button>

            <button
              id="refresh-feed-btn"
              onClick={() => loadAllData(manifestUrl)}
              disabled={isLoadingCatalog}
              className="p-2 bg-[#0e131f] hover:bg-[#151c2e] border border-white/10 text-zinc-400 hover:text-white rounded-xl text-xs transition-colors disabled:opacity-50"
              title="Refresh Stream Manifest"
            >
              <RotateCw size={15} className={isLoadingCatalog ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-8">
        {/* Error Notification if manifest failed */}
        {catalogError && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AlertCircle size={16} className="shrink-0" />
              <span>{catalogError}</span>
            </div>
            <button
              onClick={() => loadAllData(manifestUrl)}
              className="underline hover:text-white ml-4 font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {/* TOD Hero Spotlight Marquee (Only shown when not in theater mode and no match currently selected) */}
        {!isTheaterMode && spotlightItem && !selectedItem && (
          <section className="mb-2">
            <TodHeroSpotlight
              item={spotlightItem}
              onWatch={() => handleSelectItem(spotlightItem)}
              onAddToMultiView={() => handleAddToMultiView(spotlightItem)}
              isLive={spotlightItem.releaseInfo?.toLowerCase().includes('live') || spotlightItem.category === 'live'}
            />
          </section>
        )}

        {/* Video Player Section */}
        <section ref={playerStageRef} className="space-y-4">
          {isMultiViewOpen && selectedItem ? (
            <div className="space-y-4">
              <TodMultiView
                primaryItem={selectedItem}
                primarySources={sources}
                primarySourceIndex={activeSourceIndex}
                onSelectPrimarySource={(idx) => setActiveSourceIndex(idx)}
                secondaryItem={secondaryItem}
                secondarySources={secondarySources}
                secondarySourceIndex={activeSecondarySourceIndex}
                onSelectSecondarySource={(idx) => setActiveSecondarySourceIndex(idx)}
                availableItems={allUniqueItems.filter((it) => it.id !== selectedItem.id)}
                onSelectSecondaryItem={(item) => handleAddToMultiView(item)}
                onCloseMultiView={() => setIsMultiViewOpen(false)}
                onSwapScreens={handleSwapMultiView}
              />

              {/* Match Details & Feed Information for primary stream */}
              <MatchDetails
                item={selectedItem}
                sources={sources}
                activeSourceIndex={activeSourceIndex}
                onSelectSource={(idx) => setActiveSourceIndex(idx)}
                isFavorite={favorites.includes(selectedItem.id)}
                onToggleFavorite={toggleFavorite}
                onOpenMultiView={() => setIsMultiViewOpen(true)}
                onJumpToTimelineMinute={(min) => {
                  console.log('Jump to minute:', min);
                }}
              />
            </div>
          ) : selectedItem ? (
            <div className="space-y-4">
              <VideoPlayer
                title={selectedItem.name}
                subtitle={selectedItem.releaseInfo || selectedItem.category}
                sources={sources}
                activeSourceIndex={activeSourceIndex}
                onSelectSource={(idx) => setActiveSourceIndex(idx)}
                poster={selectedItem.background || selectedItem.poster}
                isLive={isCurrentItemLive}
                isTheaterMode={isTheaterMode}
                onToggleTheater={() => setIsTheaterMode(!isTheaterMode)}
              />

              {/* Match Details & Feed Information */}
              <MatchDetails
                item={selectedItem}
                sources={sources}
                activeSourceIndex={activeSourceIndex}
                onSelectSource={(idx) => setActiveSourceIndex(idx)}
                isFavorite={favorites.includes(selectedItem.id)}
                onToggleFavorite={toggleFavorite}
                onOpenMultiView={() => {
                  setIsMultiViewOpen(true);
                  if (!secondaryItem) {
                    const nextMatch = allUniqueItems.find((it) => it.id !== selectedItem.id);
                    if (nextMatch) handleAddToMultiView(nextMatch);
                  }
                }}
                onJumpToTimelineMinute={(min) => {
                  console.log('Jump to minute:', min);
                }}
              />
            </div>
          ) : (
            <div className="w-full aspect-video max-h-[50vh] rounded-3xl bg-[#0e131f] border border-white/10 flex flex-col items-center justify-center p-6 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-radial from-violet-600/10 via-transparent to-transparent pointer-events-none" />
              <div className="w-16 h-16 rounded-2xl bg-violet-600/15 text-violet-400 border border-violet-500/30 flex items-center justify-center mb-4 shadow-lg shadow-violet-600/20">
                <Tv size={32} />
              </div>
              <h3 className="text-lg font-bold text-white mb-1 tracking-tight">Select a match to start streaming</h3>
              <p className="text-xs text-zinc-400 max-w-md mb-6 leading-relaxed">
                Choose any live broadcast, upcoming fixture, or full match replay from the catalog below.
              </p>
              {spotlightItem && (
                <button
                  onClick={() => handleSelectItem(spotlightItem)}
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-lg shadow-violet-600/30 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sparkles size={14} className="text-cyan-300" />
                  <span>Stream Spotlight: {spotlightItem.name}</span>
                </button>
              )}
            </div>
          )}
        </section>

        {/* Catalog Navigation & Discovery */}
        <section className="space-y-4">
          {/* TOD Interactive Date Rail */}
          <div className="bg-[#0e131f] border border-white/10 rounded-2xl p-3 shadow-lg">
            <TodDateRail
              activeDateFilter={activeDateFilter}
              onSelectDateFilter={(filter) => setActiveDateFilter(filter)}
              counts={dateCounts}
            />
          </div>

          {/* League Tabs Component - Priority Top 5 Leagues */}
          <div className="bg-[#0e131f] border border-white/10 rounded-2xl p-3.5 backdrop-blur-xs shadow-sm">
            <LeagueTabs
              activeLeagueId={activeLeagueTab}
              onSelectLeague={(id) => setActiveLeagueTab(id)}
              leagueCounts={leagueCountsAcrossAll}
              totalAllCount={allUniqueItems.length}
            />
          </div>

          {/* Catalog / Feed Type Tabs */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-zinc-800/80">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
              {/* All Feeds Tab */}
              <button
                id="catalog-tab-all-feeds"
                onClick={() => {
                  setActiveCatalogTab('all_feeds');
                  setGenreFilter('All');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
                  activeCatalogTab === 'all_feeds'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                <Layers size={14} />
                <span>All Feeds</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-black/30">
                  {allUniqueItems.length}
                </span>
              </button>

              {/* Recaps & Highlights Tab */}
              <button
                id="catalog-tab-recaps"
                onClick={() => {
                  setActiveCatalogTab('sports_recaps');
                  setGenreFilter('All');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
                  activeCatalogTab === 'sports_recaps'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                <Film size={14} />
                <span>Recaps & Highlights</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-black/30">
                  {itemsByCatalog['sports_recaps']?.length || 0}
                </span>
              </button>

              {/* Football Fixtures Tab */}
              <button
                id="catalog-tab-football"
                onClick={() => {
                  setActiveCatalogTab('sports_football');
                  setGenreFilter('All');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
                  activeCatalogTab === 'sports_football'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                <Calendar size={14} />
                <span>Upcoming Football</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-black/30">
                  {itemsByCatalog['sports_football']?.length || 0}
                </span>
              </button>

              {/* Today Tab */}
              <button
                id="catalog-tab-today"
                onClick={() => {
                  setActiveCatalogTab('sports_today');
                  setGenreFilter('All');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
                  activeCatalogTab === 'sports_today'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                <Flame size={14} />
                <span>Today's Fixtures</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-black/30">
                  {itemsByCatalog['sports_today']?.length || 0}
                </span>
              </button>

              {/* Live Now Tab */}
              <button
                id="catalog-tab-live"
                onClick={() => {
                  setActiveCatalogTab('sports_live');
                  setGenreFilter('All');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
                  activeCatalogTab === 'sports_live'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                <Radio size={14} className={itemsByCatalog['sports_live']?.length ? 'animate-pulse' : ''} />
                <span>Live Now</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-black/30">
                  {itemsByCatalog['sports_live']?.length || 0}
                </span>
              </button>

              {/* Favorites Tab */}
              <button
                id="catalog-tab-favorites"
                onClick={() => {
                  setActiveCatalogTab('favorites');
                  setGenreFilter('All');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
                  activeCatalogTab === 'favorites'
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                <Star size={14} fill={activeCatalogTab === 'favorites' ? 'currentColor' : 'none'} />
                <span>Saved Matches</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-black/30">
                  {favorites.length}
                </span>
              </button>
            </div>

            {/* Quick Stats or Timezone Notice */}
            <div className="text-[11px] text-zinc-400 hidden lg:flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Manifest Connected ({manifest?.name || 'Sports Streams'}) · Timezone: GST</span>
            </div>
          </div>

          {/* Active League Filter Pill & Cross-Feed Alert */}
          {activeLeagueTab !== 'all' && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs">
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">Active League Filter:</span>
                {(() => {
                  const currentLeague = ALL_LEAGUES.find((l) => l.id === activeLeagueTab);
                  return (
                    <span
                      className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 border shadow-xs ${
                        currentLeague?.badgeStyle.bg || 'bg-zinc-800'
                      } ${currentLeague?.badgeStyle.text || 'text-white'} ${
                        currentLeague?.badgeStyle.border || 'border-zinc-700'
                      }`}
                    >
                      <span>{currentLeague?.flag}</span>
                      <span>{currentLeague?.name}</span>
                    </span>
                  );
                })()}
                <span className="text-zinc-500">
                  ({filteredItems.length} match{filteredItems.length === 1 ? '' : 'es'} in current view)
                </span>
              </div>

              <div className="flex items-center gap-2">
                {activeCatalogTab !== 'all_feeds' &&
                  filteredItems.length === 0 &&
                  leagueCountsAcrossAll[activeLeagueTab] > 0 && (
                    <button
                      onClick={() => setActiveCatalogTab('all_feeds')}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Layers size={13} />
                      <span>
                        Show all {leagueCountsAcrossAll[activeLeagueTab]} in All Feeds
                      </span>
                    </button>
                  )}
                <button
                  onClick={() => setActiveLeagueTab('all')}
                  className="px-2.5 py-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  Clear League Filter
                </button>
              </div>
            </div>
          )}

          {/* Secondary Filter Chips & View Mode Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 pb-2">
            {/* Status Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                id="status-filter-all"
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  statusFilter === 'all'
                    ? 'bg-zinc-200 text-zinc-950 shadow-xs'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850 border border-zinc-800'
                }`}
              >
                <span>All Matches</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${statusFilter === 'all' ? 'bg-zinc-300 text-zinc-950 font-bold' : 'bg-zinc-800 text-zinc-400'}`}>
                  {statusCounts.all}
                </span>
              </button>

              <button
                id="status-filter-live"
                onClick={() => setStatusFilter('live')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  statusFilter === 'live'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-zinc-900 text-zinc-400 hover:text-red-400 hover:bg-zinc-850 border border-zinc-800'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span>Live Now</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${statusFilter === 'live' ? 'bg-red-800 text-white font-bold' : 'bg-zinc-800 text-zinc-400'}`}>
                  {statusCounts.live}
                </span>
              </button>

              <button
                id="status-filter-upcoming"
                onClick={() => setStatusFilter('upcoming')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  statusFilter === 'upcoming'
                    ? 'bg-amber-500 text-black shadow-xs font-bold'
                    : 'bg-zinc-900 text-zinc-400 hover:text-amber-300 hover:bg-zinc-850 border border-zinc-800'
                }`}
              >
                <Clock size={12} />
                <span>Upcoming</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${statusFilter === 'upcoming' ? 'bg-amber-600 text-white font-bold' : 'bg-zinc-800 text-zinc-400'}`}>
                  {statusCounts.upcoming}
                </span>
              </button>

              <button
                id="status-filter-replays"
                onClick={() => setStatusFilter('replays')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  statusFilter === 'replays'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-zinc-900 text-zinc-400 hover:text-indigo-300 hover:bg-zinc-850 border border-zinc-800'
                }`}
              >
                <Film size={12} />
                <span>Recaps & Highlights</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${statusFilter === 'replays' ? 'bg-indigo-800 text-white font-bold' : 'bg-zinc-800 text-zinc-400'}`}>
                  {statusCounts.replays}
                </span>
              </button>

              {availableGenres.length > 2 && (
                <div className="flex items-center gap-1 ml-2 pl-2 border-l border-zinc-800">
                  <SlidersHorizontal size={12} className="text-zinc-500 mr-1 shrink-0" />
                  {availableGenres.slice(0, 4).map((genre) => (
                    <button
                      key={genre}
                      onClick={() => setGenreFilter(genre)}
                      className={`px-2 py-1 rounded text-[11px] font-medium whitespace-nowrap transition-colors ${
                        genreFilter === genre
                          ? 'bg-zinc-300 text-zinc-900 font-bold'
                          : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side: Sort & View Mode Toggle */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg text-xs text-zinc-300">
                <ArrowUpDown size={12} className="text-zinc-500" />
                <span className="text-[11px] text-zinc-500 hidden md:inline">Sort:</span>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer"
                >
                  <option value="default" className="bg-zinc-900 text-white">Default</option>
                  <option value="time" className="bg-zinc-900 text-white">Kickoff Time</option>
                  <option value="league" className="bg-zinc-900 text-white">League</option>
                  <option value="title" className="bg-zinc-900 text-white">Match Name (A-Z)</option>
                </select>
              </div>

              {/* View Switcher: Grid vs List */}
              <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
                <button
                  id="view-mode-grid-btn"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-zinc-800 text-white shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                  title="Card Grid View"
                >
                  <LayoutGrid size={14} />
                </button>
                <button
                  id="view-mode-list-btn"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === 'list'
                      ? 'bg-zinc-800 text-white shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                  title="Compact Schedule View"
                >
                  <List size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Items Grid or List */}
          {isLoadingCatalog ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-8">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-zinc-900 border border-zinc-800 aspect-16/11 animate-pulse p-4 flex flex-col justify-between"
                >
                  <div className="w-full h-32 bg-zinc-800/60 rounded-lg" />
                  <div className="space-y-2 mt-3">
                    <div className="w-3/4 h-4 bg-zinc-800/60 rounded" />
                    <div className="w-1/2 h-3 bg-zinc-800/40 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredItems.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredItems.map((item) => (
                  <MatchCard
                    key={item.id}
                    item={item}
                    isActive={selectedItem?.id === item.id}
                    isFavorite={favorites.includes(item.id)}
                    onSelect={(it) => handleSelectItem(it)}
                    onToggleFavorite={toggleFavorite}
                    onAddToMultiView={(it, e) => handleAddToMultiView(it, e)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredItems.map((item) => (
                  <MatchListRow
                    key={item.id}
                    item={item}
                    isActive={selectedItem?.id === item.id}
                    isFavorite={favorites.includes(item.id)}
                    onSelect={(it) => handleSelectItem(it)}
                    onToggleFavorite={toggleFavorite}
                    onAddToMultiView={(it, e) => handleAddToMultiView(it, e)}
                  />
                ))}
              </div>
            )
          ) : (
            <div className="py-16 text-center bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-8">
              <div className="w-12 h-12 rounded-full bg-zinc-800 text-zinc-500 flex items-center justify-center mx-auto mb-3">
                <Search size={20} />
              </div>
              <h4 className="text-base font-semibold text-zinc-200 mb-1">No matches found</h4>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-4">
                {searchQuery
                  ? `No matches matching "${searchQuery}". Try clearing your search.`
                  : activeLeagueTab !== 'all'
                  ? `No ${ALL_LEAGUES.find((l) => l.id === activeLeagueTab)?.name || 'league'} matches in this feed tab.`
                  : activeCatalogTab === 'sports_live'
                  ? 'No games are currently live right now. Check back at kickoff or browse upcoming matches!'
                  : activeCatalogTab === 'favorites'
                  ? 'You haven’t bookmarked any matches yet. Click the star on any match card to save it.'
                  : 'No items in this category.'}
              </p>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {activeLeagueTab !== 'all' && leagueCountsAcrossAll[activeLeagueTab] > 0 && activeCatalogTab !== 'all_feeds' && (
                  <button
                    onClick={() => setActiveCatalogTab('all_feeds')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors"
                  >
                    View in All Feeds ({leagueCountsAcrossAll[activeLeagueTab]})
                  </button>
                )}
                {(searchQuery || activeLeagueTab !== 'all' || genreFilter !== 'All') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setGenreFilter('All');
                      setActiveLeagueTab('all');
                    }}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-xl transition-colors"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 px-4 lg:px-8 py-6 text-xs text-zinc-400 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>High-Definition Sports Stream Player</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>HLS .m3u8 & MP4 Adaptive Streaming</span>
            <span>·</span>
            <button
              onClick={() => setIsSelfHostModalOpen(true)}
              className="text-amber-400 hover:underline flex items-center gap-1"
            >
              <Laptop size={12} />
              <span>Self-Host on PC</span>
            </button>
            <span>·</span>
            <button
              onClick={() => setIsShortcutsModalOpen(true)}
              className="text-zinc-400 hover:text-white hover:underline flex items-center gap-1"
            >
              <Keyboard size={12} />
              <span>Shortcuts (?)</span>
            </button>
            <span>·</span>
            <button
              onClick={() => setIsManifestModalOpen(true)}
              className="text-indigo-400 hover:underline"
            >
              Configured Manifest ({manifest?.name || 'Live Feeds'})
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SelfHostModal
        isOpen={isSelfHostModalOpen}
        onClose={() => setIsSelfHostModalOpen(false)}
      />

      <ShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

      <ManifestModal
        isOpen={isManifestModalOpen}
        onClose={() => setIsManifestModalOpen(false)}
        currentUrl={manifestUrl}
        manifest={manifest}
        onSaveUrl={handleSaveManifestUrl}
        isLoading={isLoadingCatalog}
      />

      <DirectStreamModal
        isOpen={isDirectStreamModalOpen}
        onClose={() => setIsDirectStreamModalOpen(false)}
        onPlayDirectStream={handlePlayDirectStream}
      />
    </div>
  );
}
