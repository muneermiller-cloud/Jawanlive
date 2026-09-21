import { StreamItemMeta } from '../types';

export interface LeagueDefinition {
  id: string;
  name: string;
  shortName: string;
  country: string;
  countryCode: string;
  flag: string;
  isTop5: boolean;
  isTournament?: boolean;
  priorityOrder: number;
  badgeStyle: {
    bg: string;
    text: string;
    border: string;
  };
  activeTabStyle: string;
  teams: string[];
  keywords: string[];
  cupNames?: string[];
}

/**
 * Top 5 European Leagues and their official domestic cup competitions
 */
export const TOP_5_LEAGUES: LeagueDefinition[] = [
  {
    id: 'premier_league',
    name: 'Premier League & Cups',
    shortName: 'Premier League',
    country: 'England',
    countryCode: 'GB',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    isTop5: true,
    priorityOrder: 1,
    badgeStyle: {
      bg: 'bg-purple-900/30',
      text: 'text-purple-300',
      border: 'border-purple-600/40',
    },
    activeTabStyle: 'bg-gradient-to-r from-purple-700 to-indigo-600 text-white shadow-purple-600/25',
    cupNames: ['FA Cup', 'Carabao Cup / EFL', 'Community Shield'],
    keywords: [
      'premier league',
      'epl',
      'english premier league',
      'fa cup',
      'the fa cup',
      'the emirates fa cup',
      'carabao cup',
      'carabao',
      'efl cup',
      'efl trophy',
      'community shield',
    ],
    teams: [
      'arsenal', 'aston villa', 'bournemouth', 'brentford', 'brighton', 'chelsea',
      'crystal palace', 'everton', 'fulham', 'ipswich', 'ipswich town', 'leicester',
      'leicester city', 'liverpool', 'manchester city', 'man city', 'manchester united',
      'man utd', 'newcastle', 'newcastle united', 'nottingham forest', 'southampton',
      'tottenham', 'tottenham hotspur', 'spurs', 'west ham', 'west ham united',
      'wolves', 'wolverhampton',
      // Top Championship / English Cup clubs
      'burnley', 'leeds', 'leeds united', 'luton', 'luton town', 'sheffield united',
      'sheffield utd', 'sunderland', 'blackburn', 'blackburn rovers', 'watford',
      'middlesbrough', 'norwich', 'norwich city', 'west brom', 'west bromwich albion',
      'coventry', 'coventry city', 'portsmouth', 'derby', 'derby county', 'stoke',
      'stoke city', 'swansea', 'swansea city', 'bristol city', 'preston', 'preston north end',
      'hull', 'hull city', 'millwall', 'qpr', 'queens park rangers', 'plymouth',
      'plymouth argyle', 'oxford united', 'cardiff', 'cardiff city', 'wrexham',
      'birmingham', 'birmingham city', 'reading', 'bolton'
    ],
  },
  {
    id: 'la_liga',
    name: 'La Liga & Copa del Rey',
    shortName: 'La Liga',
    country: 'Spain',
    countryCode: 'ES',
    flag: '🇪🇸',
    isTop5: true,
    priorityOrder: 2,
    badgeStyle: {
      bg: 'bg-amber-900/30',
      text: 'text-amber-300',
      border: 'border-amber-600/40',
    },
    activeTabStyle: 'bg-gradient-to-r from-amber-600 to-red-600 text-white shadow-amber-600/25',
    cupNames: ['Copa del Rey', 'Supercopa de España'],
    keywords: [
      'la liga',
      'laliga',
      'copa del rey',
      'copa de su majestad el rey',
      'supercopa de espana',
      'supercopa de españa',
      'supercopa',
      'primera division',
      'primera división',
    ],
    teams: [
      'alaves', 'alavés', 'athletic club', 'athletic bilbao', 'atletico madrid',
      'atlético madrid', 'atletico de madrid', 'barcelona', 'fc barcelona', 'barça',
      'betis', 'real betis', 'celta', 'celta de vigo', 'celta vigo', 'espanyol',
      'getafe', 'girona', 'las palmas', 'leganes', 'leganés', 'mallorca',
      'rcd mallorca', 'osasuna', 'rayo vallecano', 'real madrid', 'real sociedad',
      'real valladolid', 'valladolid', 'sevilla', 'valencia', 'villarreal',
      // Spanish Cup / Segunda clubs
      'almeria', 'almería', 'cadiz', 'cádiz', 'granada', 'elche', 'levante',
      'eibar', 'oviedo', 'real oviedo', 'racing santander', 'sporting gijon',
      'sporting gijón', 'zaragoza', 'real zaragoza', 'burgos', 'deportivo',
      'deportivo la coruna', 'deportivo de la coruña', 'huesca', 'cartagena',
      'eldense', 'mirandes', 'mirandés', 'tenerife', 'cordoba', 'córdoba',
      'malaga', 'málaga', 'albacete'
    ],
  },
  {
    id: 'serie_a',
    name: 'Serie A & Coppa Italia',
    shortName: 'Serie A',
    country: 'Italy',
    countryCode: 'IT',
    flag: '🇮🇹',
    isTop5: true,
    priorityOrder: 3,
    badgeStyle: {
      bg: 'bg-blue-900/30',
      text: 'text-blue-300',
      border: 'border-blue-600/40',
    },
    activeTabStyle: 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-blue-600/25',
    cupNames: ['Coppa Italia', 'Supercoppa Italiana'],
    keywords: [
      'serie a',
      'coppa italia',
      'coppa italia frecciarossa',
      'supercoppa italiana',
      'supercoppa',
    ],
    teams: [
      'atalanta', 'bologna', 'cagliari', 'como', 'empoli', 'fiorentina',
      'genoa', 'hellas verona', 'verona', 'inter', 'inter milan', 'internazionale',
      'juventus', 'lazio', 'lecce', 'milan', 'ac milan', 'monza', 'napoli',
      'parma', 'roma', 'as roma', 'torino', 'udinese', 'venezia',
      // Italian Cup / Serie B clubs
      'sassuolo', 'salernitana', 'frosinone', 'sampdoria', 'spezia', 'cremonese',
      'palermo', 'bari', 'brescia', 'cesena', 'catanzaro', 'pisa', 'modena',
      'reggiana', 'sudtirol', 'südtirol', 'carrarese', 'cosenza', 'cittadella'
    ],
  },
  {
    id: 'bundesliga',
    name: 'Bundesliga & DFB-Pokal',
    shortName: 'Bundesliga',
    country: 'Germany',
    countryCode: 'DE',
    flag: '🇩🇪',
    isTop5: true,
    priorityOrder: 4,
    badgeStyle: {
      bg: 'bg-rose-900/30',
      text: 'text-rose-300',
      border: 'border-rose-600/40',
    },
    activeTabStyle: 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-red-600/25',
    cupNames: ['DFB-Pokal', 'DFL-Supercup'],
    keywords: [
      'bundesliga',
      'dfb pokal',
      'dfb-pokal',
      'dfl supercup',
      'dfl-supercup',
      'dfb cup',
    ],
    teams: [
      'augsburg', 'fc augsburg', 'bayer leverkusen', 'leverkusen', 'bayern munich',
      'bayern münchen', 'bayern', 'bochum', 'vfl bochum', 'borussia dortmund',
      'dortmund', 'bvb', 'borussia monchengladbach', 'mönchengladbach', 'gladbach',
      'eintracht frankfurt', 'frankfurt', 'freiburg', 'sc freiburg', 'heidenheim',
      'hoffenheim', 'tsg hoffenheim', 'holstein kiel', 'kiel', 'mainz', 'mainz 05',
      'rb leipzig', 'leipzig', 'st. pauli', 'st pauli', 'fc st. pauli', 'stuttgart',
      'vfb stuttgart', 'union berlin', 'werder bremen', 'bremen', 'wolfsburg',
      'vfl wolfsburg',
      // German Cup / 2. Bundesliga clubs
      'köln', 'koln', '1. fc köln', 'hertha', 'hertha bsc', 'schalke', 'schalke 04',
      'fortuna düsseldorf', 'düsseldorf', 'dusseldorf', 'hamburg', 'hamburger sv',
      'hsv', 'hannover', 'hannover 96', 'nürnberg', 'nurnberg', 'fc nürnberg',
      'paderborn', 'karlsruher', 'karlsruher sc', 'kaiserslautern', 'darmstadt',
      'darmstadt 98', 'elversberg', 'magdeburg', 'braunschweig', 'preussen'
    ],
  },
  {
    id: 'ligue_1',
    name: 'Ligue 1 & Coupe de France',
    shortName: 'Ligue 1',
    country: 'France',
    countryCode: 'FR',
    flag: '🇫🇷',
    isTop5: true,
    priorityOrder: 5,
    badgeStyle: {
      bg: 'bg-emerald-900/30',
      text: 'text-emerald-300',
      border: 'border-emerald-600/40',
    },
    activeTabStyle: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-600/25',
    cupNames: ['Coupe de France', 'Trophée des Champions'],
    keywords: [
      'ligue 1',
      'coupe de france',
      'trophee des champions',
      'trophée des champions',
    ],
    teams: [
      'angers', 'auxerre', 'brest', 'stade brestois', 'le havre', 'lens',
      'rc lens', 'lille', 'losc lille', 'lyon', 'olympique lyonnais', 'marseille',
      'olympique de marseille', 'monaco', 'as monaco', 'montpellier', 'nantes',
      'fc nantes', 'nice', 'ogc nice', 'paris saint-germain', 'paris sg', 'psg',
      'reims', 'stade de reims', 'rennes', 'stade rennais', 'saint-etienne',
      'saint-étienne', 'strasbourg', 'rc strasbourg', 'toulouse',
      // French Cup / Ligue 2 clubs
      'metz', 'lorient', 'clermont', 'clermont foot', 'bordeaux', 'paris fc',
      'guingamp', 'caen', 'bastia', 'ajaccio', 'troyes', 'grenoble', 'rodez',
      'laval', 'pau', 'amiens', 'dunkerque', 'red star'
    ],
  },
];

/**
 * Major European & International Tournaments
 */
export const MAJOR_TOURNAMENTS: LeagueDefinition[] = [
  {
    id: 'champions_league',
    name: 'UEFA Champions League',
    shortName: 'Champions League',
    country: 'Europe',
    countryCode: 'EU',
    flag: '⭐',
    isTop5: false,
    isTournament: true,
    priorityOrder: 6,
    badgeStyle: {
      bg: 'bg-sky-900/30',
      text: 'text-sky-300',
      border: 'border-sky-600/40',
    },
    activeTabStyle: 'bg-gradient-to-r from-sky-600 to-indigo-700 text-white shadow-sky-600/25',
    keywords: [
      'champions league',
      'ucl',
      'uefa champions league',
      'uefa champions',
      'uefa super cup',
    ],
    teams: [
      'benfica', 'sporting cp', 'sporting lisbon', 'porto', 'ajax', 'psv',
      'psv eindhoven', 'feyenoord', 'celtic', 'shakhtar', 'shakhtar donetsk',
      'club brugge', 'salzburg', 'red bull salzburg', 'sturm graz', 'young boys',
      'crvena zvezda', 'red star belgrade', 'dinamo zagreb', 'sparta prague',
      'slovan bratislava'
    ],
  },
  {
    id: 'europa_league',
    name: 'UEFA Europa & Conference',
    shortName: 'Europa / Conf',
    country: 'Europe',
    countryCode: 'EU',
    flag: '🏆',
    isTop5: false,
    isTournament: true,
    priorityOrder: 7,
    badgeStyle: {
      bg: 'bg-orange-950/40',
      text: 'text-orange-400',
      border: 'border-orange-600/40',
    },
    activeTabStyle: 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-orange-600/25',
    keywords: [
      'europa league',
      'uel',
      'uefa europa league',
      'conference league',
      'uecl',
      'uefa conference league',
      'uefa conference',
      'uefa europa',
    ],
    teams: [
      'braga', 'galatasaray', 'fenerbahce', 'besiktas', 'olympiacos', 'paok',
      'panathinaikos', 'slavia prague', 'viktoria plzen', 'anderlecht',
      'bodo/glimt', 'bodø/glimt', 'malmo', 'malmö ff', 'union sg',
      'union saint-gilloise', 'rangers', 'twente'
    ],
  },
  {
    id: 'international_tournaments',
    name: 'International Tournaments',
    shortName: 'Tournaments',
    country: 'Global',
    countryCode: 'GLOBAL',
    flag: '🌍',
    isTop5: false,
    isTournament: true,
    priorityOrder: 8,
    badgeStyle: {
      bg: 'bg-teal-950/40',
      text: 'text-teal-300',
      border: 'border-teal-600/40',
    },
    activeTabStyle: 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-teal-600/25',
    keywords: [
      'fifa club world cup',
      'club world cup',
      'world cup',
      'fifa world cup',
      'uefa nations league',
      'nations league',
      'uefa euro',
      'euro 2024',
      'euro 2026',
      'copa america',
      'uefa qualifiers',
    ],
    teams: [],
  },
];

/**
 * All allowed competitions: Top 5 Leagues & Cups + Major European Tournaments.
 * Everything outside these competitions is strictly stripped and removed.
 */
export const ALL_ALLOWED_LEAGUES: LeagueDefinition[] = [
  ...TOP_5_LEAGUES,
  ...MAJOR_TOURNAMENTS,
];

// Alias for backwards compatibility
export const ALL_LEAGUES = ALL_ALLOWED_LEAGUES;
export const OTHER_LEAGUES = MAJOR_TOURNAMENTS;

export const DEFAULT_ALLOWED_LEAGUE: LeagueDefinition = TOP_5_LEAGUES[0];

/**
 * Internal detection: returns LeagueDefinition if matched, or null if outside allowed scope.
 */
export function detectLeague(
  name: string,
  genres?: string[],
  description?: string
): LeagueDefinition | null {
  const text = `${name} ${genres?.join(' ') || ''} ${description || ''}`.toLowerCase();

  // 1. Check Major Tournament keywords first (UCL, UEL, UECL, etc.)
  for (const tournament of MAJOR_TOURNAMENTS) {
    if (tournament.keywords.some((k) => text.includes(k))) {
      return tournament;
    }
  }

  // 2. Check Top 5 League & Domestic Cup keywords (FA Cup, Copa del Rey, etc.)
  for (const league of TOP_5_LEAGUES) {
    if (league.keywords.some((k) => text.includes(k))) {
      return league;
    }
  }

  // 3. Check Top 5 League team names
  for (const league of TOP_5_LEAGUES) {
    for (const team of league.teams) {
      const regex = new RegExp(`(^|[^a-z0-9])${team.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9]|$)`, 'i');
      if (regex.test(text)) {
        return league;
      }
    }
  }

  // 4. Check Tournament teams if any
  for (const tournament of MAJOR_TOURNAMENTS) {
    for (const team of tournament.teams) {
      const regex = new RegExp(`(^|[^a-z0-9])${team.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9]|$)`, 'i');
      if (regex.test(text)) {
        return tournament;
      }
    }
  }

  return null;
}

/**
 * Validates whether a match belongs to the Top 5 leagues, their domestic cups,
 * or major European/international tournaments.
 */
export function isAllowedCompetition(item: StreamItemMeta): boolean {
  if (!item || !item.name) return false;
  // Always permit custom user-added stream URLs
  if (item.id.startsWith('custom:')) return true;

  return detectLeague(item.name, item.genres, item.description) !== null;
}

/**
 * Classifies a match into its corresponding league.
 * Always returns a valid LeagueDefinition for UI styling purposes.
 */
export function getLeagueForMatch(
  name: string,
  genres?: string[],
  description?: string
): LeagueDefinition {
  return detectLeague(name, genres, description) || DEFAULT_ALLOWED_LEAGUE;
}

/**
 * Returns specific competition name and flag for card badges
 * (e.g. "FA Cup", "Carabao Cup", "Copa del Rey", "DFB-Pokal", "Champions League")
 */
export function getCompetitionBadge(
  name: string,
  genres?: string[],
  description?: string
): { label: string; flag: string; isCup: boolean } {
  const text = `${name} ${genres?.join(' ') || ''} ${description || ''}`.toLowerCase();

  // Major Tournaments
  if (text.includes('champions league') || text.includes('ucl')) {
    return { label: 'Champions League', flag: '⭐', isCup: true };
  }
  if (text.includes('europa league') || text.includes('uel')) {
    return { label: 'Europa League', flag: '🏆', isCup: true };
  }
  if (text.includes('conference league') || text.includes('uecl')) {
    return { label: 'Conference League', flag: '🏆', isCup: true };
  }

  // Domestic Cups
  if (text.includes('fa cup') || text.includes('the fa cup')) {
    return { label: 'FA Cup', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', isCup: true };
  }
  if (text.includes('carabao cup') || text.includes('carabao') || text.includes('efl cup')) {
    return { label: 'Carabao Cup', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', isCup: true };
  }
  if (text.includes('copa del rey')) {
    return { label: 'Copa del Rey', flag: '🇪🇸', isCup: true };
  }
  if (text.includes('supercopa')) {
    return { label: 'Supercopa', flag: '🇪🇸', isCup: true };
  }
  if (text.includes('coppa italia')) {
    return { label: 'Coppa Italia', flag: '🇮🇹', isCup: true };
  }
  if (text.includes('dfb-pokal') || text.includes('dfb pokal')) {
    return { label: 'DFB-Pokal', flag: '🇩🇪', isCup: true };
  }
  if (text.includes('coupe de france')) {
    return { label: 'Coupe de France', flag: '🇫🇷', isCup: true };
  }

  const league = getLeagueForMatch(name, genres, description);
  return { label: league.shortName, flag: league.flag, isCup: false };
}

/**
 * Filter items by league ID (or 'all' for all allowed competitions).
 * Non-top-5 and non-tournament items are completely excluded.
 */
export function filterItemsByLeague(items: StreamItemMeta[], leagueId: string): StreamItemMeta[] {
  const allowed = items.filter(isAllowedCompetition);

  if (!leagueId || leagueId === 'all') {
    return allowed;
  }

  return allowed.filter((item) => {
    const league = detectLeague(item.name, item.genres, item.description);
    return league?.id === leagueId;
  });
}

/**
 * Count how many allowed items in an array belong to each league.
 */
export function getLeagueItemCounts(items: StreamItemMeta[]): Record<string, number> {
  const allowed = items.filter(isAllowedCompetition);

  const counts: Record<string, number> = {
    all: allowed.length,
  };

  ALL_ALLOWED_LEAGUES.forEach((l) => {
    counts[l.id] = 0;
  });

  allowed.forEach((item) => {
    const league = detectLeague(item.name, item.genres, item.description);
    if (league) {
      counts[league.id] = (counts[league.id] || 0) + 1;
    }
  });

  return counts;
}

/**
 * Detects whether an item is a replay, recap, or highlight video.
 */
export function isRecapOrHighlight(item: StreamItemMeta): boolean {
  if (!item) return false;
  const name = (item.name || '').toLowerCase();
  const desc = (item.description || '').toLowerCase();
  const rel = (item.releaseInfo || '').toLowerCase();

  return (
    item.id.startsWith('recap:') ||
    item.genres?.includes('Recap') ||
    item.genres?.includes('Highlights') ||
    item.genres?.includes('Highlight') ||
    item.genres?.includes('Replay') ||
    !!item.runtime ||
    name.includes('highlight') ||
    name.includes('recap') ||
    name.includes('replay') ||
    name.includes('full match') ||
    name.includes('mini match') ||
    name.includes('all goals') ||
    desc.includes('highlights') ||
    desc.includes('full match') ||
    rel.includes('highlights') ||
    rel.includes('replay')
  );
}

/**
 * Checks if the video specifically represents highlights/goals rather than a full replay.
 */
export function isHighlightOnly(item: StreamItemMeta): boolean {
  if (!item) return false;
  const text = `${item.name} ${item.genres?.join(' ') || ''} ${item.description || ''}`.toLowerCase();
  return text.includes('highlight') || text.includes('all goals') || text.includes('mini match');
}

