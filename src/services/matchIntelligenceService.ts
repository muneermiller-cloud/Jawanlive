export interface MatchEvent {
  minute: number;
  type: 'goal' | 'card' | 'sub' | 'var' | 'halftime' | 'kickoff';
  team: 'home' | 'away' | 'neutral';
  player: string;
  detail?: string;
  scoreAfter?: string;
}

export interface MatchStats {
  possessionHome: number;
  possessionAway: number;
  shotsHome: number;
  shotsAway: number;
  shotsOnTargetHome: number;
  shotsOnTargetAway: number;
  xgHome: number;
  xgAway: number;
  cornersHome: number;
  cornersAway: number;
  foulsHome: number;
  foulsAway: number;
  yellowCardsHome: number;
  yellowCardsAway: number;
  passAccuracyHome: number;
  passAccuracyAway: number;
  dangerousAttacksHome: number;
  dangerousAttacksAway: number;
}

export interface PlayerLineup {
  number: number;
  name: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  gridPos: { x: number; y: number }; // 0 to 100 percentage coordinates on half-pitch
  isCaptain?: boolean;
}

export interface TeamLineup {
  teamName: string;
  shortName: string;
  color: string;
  secondaryColor: string;
  formation: string;
  manager: string;
  startingXI: PlayerLineup[];
  bench: string[];
}

export interface HeadToHeadData {
  homeWins: number;
  draws: number;
  awayWins: number;
  recentMeetings: Array<{
    date: string;
    score: string;
    competition: string;
  }>;
  homeForm: ('W' | 'D' | 'L')[];
  awayForm: ('W' | 'D' | 'L')[];
}

export interface MatchIntelligence {
  homeTeam: string;
  awayTeam: string;
  homeShort: string;
  awayShort: string;
  homeColor: string;
  awayColor: string;
  stadium: string;
  referee: string;
  stats: MatchStats;
  events: MatchEvent[];
  homeLineup: TeamLineup;
  awayLineup: TeamLineup;
  headToHead: HeadToHeadData;
  fanPrediction: {
    homePercent: number;
    drawPercent: number;
    awayPercent: number;
  };
}

// Common club database for Top 5 & Champions League clubs
const CLUB_REGISTRY: Record<string, {
  short: string;
  color: string;
  secondaryColor: string;
  stadium: string;
  manager: string;
  formation: string;
  keyPlayers: { gk: string; def: string[]; mid: string[]; fwd: string[] };
}> = {
  arsenal: {
    short: 'ARS',
    color: '#EF0107',
    secondaryColor: '#FFFFFF',
    stadium: 'Emirates Stadium, London',
    manager: 'Mikel Arteta',
    formation: '4-3-3',
    keyPlayers: {
      gk: 'Raya',
      def: ['White', 'Saliba', 'Gabriel', 'Timber'],
      mid: ['Odegaard', 'Rice', 'Merino'],
      fwd: ['Saka', 'Havertz', 'Martinelli'],
    },
  },
  chelsea: {
    short: 'CHE',
    color: '#034694',
    secondaryColor: '#EE242C',
    stadium: 'Stamford Bridge, London',
    manager: 'Enzo Maresca',
    formation: '4-2-3-1',
    keyPlayers: {
      gk: 'Sanchez',
      def: ['Gusto', 'Fofana', 'Colwill', 'Cucurella'],
      mid: ['Caicedo', 'Enzo', 'Palmer'],
      fwd: ['Madueke', 'Jackson', 'Neto'],
    },
  },
  liverpool: {
    short: 'LIV',
    color: '#C8102E',
    secondaryColor: '#00B2A9',
    stadium: 'Anfield, Liverpool',
    manager: 'Arne Slot',
    formation: '4-3-3',
    keyPlayers: {
      gk: 'Alisson',
      def: ['Alexander-Arnold', 'Konate', 'Van Dijk', 'Robertson'],
      mid: ['Gravenberch', 'Mac Allister', 'Szoboszlai'],
      fwd: ['Salah', 'Jota', 'Diaz'],
    },
  },
  'manchester city': {
    short: 'MCI',
    color: '#6CABDD',
    secondaryColor: '#1C2C5B',
    stadium: 'Etihad Stadium, Manchester',
    manager: 'Pep Guardiola',
    formation: '4-1-4-1',
    keyPlayers: {
      gk: 'Ederson',
      def: ['Walker', 'Dias', 'Akanji', 'Gvardiol'],
      mid: ['Rodri', 'De Bruyne', 'Bernardo Silva', 'Foden'],
      fwd: ['Savinho', 'Haaland', 'Doku'],
    },
  },
  'man city': {
    short: 'MCI',
    color: '#6CABDD',
    secondaryColor: '#1C2C5B',
    stadium: 'Etihad Stadium, Manchester',
    manager: 'Pep Guardiola',
    formation: '4-1-4-1',
    keyPlayers: {
      gk: 'Ederson',
      def: ['Walker', 'Dias', 'Akanji', 'Gvardiol'],
      mid: ['Rodri', 'De Bruyne', 'Bernardo Silva', 'Foden'],
      fwd: ['Savinho', 'Haaland', 'Doku'],
    },
  },
  'manchester united': {
    short: 'MUN',
    color: '#DA291C',
    secondaryColor: '#FBE122',
    stadium: 'Old Trafford, Manchester',
    manager: 'Ruben Amorim',
    formation: '3-4-2-1',
    keyPlayers: {
      gk: 'Onana',
      def: ['De Ligt', 'Maguire', 'Martinez'],
      mid: ['Mazraoui', 'Mainoo', 'Ugarte', 'Dalot'],
      fwd: ['Amad', 'Bruno Fernandes', 'Hojlund'],
    },
  },
  'man utd': {
    short: 'MUN',
    color: '#DA291C',
    secondaryColor: '#FBE122',
    stadium: 'Old Trafford, Manchester',
    manager: 'Ruben Amorim',
    formation: '3-4-2-1',
    keyPlayers: {
      gk: 'Onana',
      def: ['De Ligt', 'Maguire', 'Martinez'],
      mid: ['Mazraoui', 'Mainoo', 'Ugarte', 'Dalot'],
      fwd: ['Amad', 'Bruno Fernandes', 'Hojlund'],
    },
  },
  tottenham: {
    short: 'TOT',
    color: '#132257',
    secondaryColor: '#FFFFFF',
    stadium: 'Tottenham Hotspur Stadium, London',
    manager: 'Ange Postecoglou',
    formation: '4-3-3',
    keyPlayers: {
      gk: 'Vicario',
      def: ['Porro', 'Romero', 'Van de Ven', 'Udogie'],
      mid: ['Bissouma', 'Sarr', 'Maddison'],
      fwd: ['Kulusevski', 'Solanke', 'Son'],
    },
  },
  'aston villa': {
    short: 'AVL',
    color: '#670E36',
    secondaryColor: '#95BFE5',
    stadium: 'Villa Park, Birmingham',
    manager: 'Unai Emery',
    formation: '4-2-2-2',
    keyPlayers: {
      gk: 'Martinez',
      def: ['Cash', 'Konsa', 'Pau Torres', 'Digne'],
      mid: ['Tielemans', 'Onana', 'McGinn'],
      fwd: ['Bailey', 'Watkins', 'Rogers'],
    },
  },
  newcastle: {
    short: 'NEW',
    color: '#241F20',
    secondaryColor: '#41B6E6',
    stadium: "St. James' Park, Newcastle",
    manager: 'Eddie Howe',
    formation: '4-3-3',
    keyPlayers: {
      gk: 'Pope',
      def: ['Livramento', 'Schar', 'Burn', 'Hall'],
      mid: ['Guimaraes', 'Joelinton', 'Tonali'],
      fwd: ['Murphy', 'Isak', 'Gordon'],
    },
  },
  'real madrid': {
    short: 'RMA',
    color: '#FFFFFF',
    secondaryColor: '#FEBE10',
    stadium: 'Santiago Bernabéu, Madrid',
    manager: 'Carlo Ancelotti',
    formation: '4-3-3',
    keyPlayers: {
      gk: 'Courtois',
      def: ['Carvajal', 'Militao', 'Rudiger', 'Mendy'],
      mid: ['Valverde', 'Tchouameni', 'Bellingham'],
      fwd: ['Rodrygo', 'Mbappé', 'Vinicius Jr'],
    },
  },
  barcelona: {
    short: 'BAR',
    color: '#004D98',
    secondaryColor: '#A50044',
    stadium: 'Spotify Camp Nou / Montjuïc, Barcelona',
    manager: 'Hansi Flick',
    formation: '4-2-3-1',
    keyPlayers: {
      gk: 'Szczesny',
      def: ['Kounde', 'Cubarsi', 'Inigo Martinez', 'Balde'],
      mid: ['Casado', 'Pedri', 'Olmo'],
      fwd: ['Lamine Yamal', 'Lewandowski', 'Raphinha'],
    },
  },
  'atletico madrid': {
    short: 'ATM',
    color: '#CB3524',
    secondaryColor: '#272E61',
    stadium: 'Cívitas Metropolitano, Madrid',
    manager: 'Diego Simeone',
    formation: '3-5-2',
    keyPlayers: {
      gk: 'Oblak',
      def: ['Le Normand', 'Gimenez', 'Reinildo'],
      mid: ['Molina', 'De Paul', 'Koke', 'Gallagher', 'Lino'],
      fwd: ['Griezmann', 'Julian Alvarez'],
    },
  },
  'bayern munich': {
    short: 'BAY',
    color: '#DC052D',
    secondaryColor: '#0066B2',
    stadium: 'Allianz Arena, Munich',
    manager: 'Vincent Kompany',
    formation: '4-2-3-1',
    keyPlayers: {
      gk: 'Neuer',
      def: ['Laimer', 'Upamecano', 'Kim Min-jae', 'Davies'],
      mid: ['Kimmich', 'Pavlovic', 'Musiala'],
      fwd: ['Olise', 'Kane', 'Gnabry'],
    },
  },
  dortmund: {
    short: 'BVB',
    color: '#FDE100',
    secondaryColor: '#000000',
    stadium: 'Signal Iduna Park, Dortmund',
    manager: 'Nuri Sahin',
    formation: '4-2-3-1',
    keyPlayers: {
      gk: 'Kobel',
      def: ['Ryerson', 'Anton', 'Schlotterbeck', 'Bensebaini'],
      mid: ['Can', 'Gross', 'Brandt'],
      fwd: ['Malen', 'Guirassy', 'Gittens'],
    },
  },
  'bayer leverkusen': {
    short: 'B04',
    color: '#E32221',
    secondaryColor: '#000000',
    stadium: 'BayArena, Leverkusen',
    manager: 'Xabi Alonso',
    formation: '3-4-2-1',
    keyPlayers: {
      gk: 'Hradecky',
      def: ['Tapsoba', 'Tah', 'Hincapie'],
      mid: ['Frimpong', 'Xhaka', 'Andrich', 'Grimaldo'],
      fwd: ['Wirtz', 'Terrier', 'Boniface'],
    },
  },
  inter: {
    short: 'INT',
    color: '#010E80',
    secondaryColor: '#000000',
    stadium: 'San Siro, Milan',
    manager: 'Simone Inzaghi',
    formation: '3-5-2',
    keyPlayers: {
      gk: 'Sommer',
      def: ['Pavard', 'Acerbi', 'Bastoni'],
      mid: ['Dumfries', 'Barella', 'Calhanoglu', 'Mkhitaryan', 'Dimarco'],
      fwd: ['Thuram', 'Lautaro Martinez'],
    },
  },
  milan: {
    short: 'MIL',
    color: '#FB090B',
    secondaryColor: '#000000',
    stadium: 'San Siro, Milan',
    manager: 'Paulo Fonseca',
    formation: '4-2-3-1',
    keyPlayers: {
      gk: 'Maignan',
      def: ['Emerson', 'Tomori', 'Pavlovic', 'Theo Hernandez'],
      mid: ['Fofana', 'Reijnders', 'Pulisic'],
      fwd: ['Chukwueze', 'Morata', 'Leao'],
    },
  },
  juventus: {
    short: 'JUV',
    color: '#000000',
    secondaryColor: '#FFFFFF',
    stadium: 'Allianz Stadium, Turin',
    manager: 'Thiago Motta',
    formation: '4-2-3-1',
    keyPlayers: {
      gk: 'Di Gregorio',
      def: ['Savona', 'Gatti', 'Kalulu', 'Cambiaso'],
      mid: ['Locatelli', 'Thuram', 'Koopmeiners'],
      fwd: ['Conceicao', 'Vlahovic', 'Yildiz'],
    },
  },
  psg: {
    short: 'PSG',
    color: '#004170',
    secondaryColor: '#DA291C',
    stadium: 'Parc des Princes, Paris',
    manager: 'Luis Enrique',
    formation: '4-3-3',
    keyPlayers: {
      gk: 'Donnarumma',
      def: ['Hakimi', 'Marquinhos', 'Pacho', 'Mendes'],
      mid: ['Zaire-Emery', 'Vitinha', 'Fabian Ruiz'],
      fwd: ['Dembele', 'Kolo Muani', 'Barcola'],
    },
  },
};

/**
 * Splits a match title string like "Arsenal vs Chelsea" into Home & Away teams
 */
export function extractTeamsFromTitle(title: string): { home: string; away: string } {
  if (!title) return { home: 'Home Team', away: 'Away Team' };

  // Common delimiters
  const clean = title.replace(/\(.*?\)/g, '').replace(/\[.*?\]/g, '').trim();
  const vsMatch = clean.split(/\s+(?:vs\.?|v|-|against)\s+/i);

  if (vsMatch.length >= 2) {
    return {
      home: vsMatch[0].trim(),
      away: vsMatch[1].trim(),
    };
  }

  return {
    home: title,
    away: 'Opponent',
  };
}

/**
 * Generates rich Opta-style match intelligence, timeline moments, pitch lineups, and stats.
 */
export function generateMatchIntelligence(title: string, isLive: boolean): MatchIntelligence {
  const { home, away } = extractTeamsFromTitle(title);
  const homeLower = home.toLowerCase();
  const awayLower = away.toLowerCase();

  // Look for match in registry or generate fallback
  let homeReg = Object.entries(CLUB_REGISTRY).find(([k]) => homeLower.includes(k))?.[1];
  let awayReg = Object.entries(CLUB_REGISTRY).find(([k]) => awayLower.includes(k))?.[1];

  if (!homeReg) {
    homeReg = {
      short: home.substring(0, 3).toUpperCase(),
      color: '#3B82F6',
      secondaryColor: '#FFFFFF',
      stadium: `${home} Arena`,
      manager: 'Head Coach',
      formation: '4-3-3',
      keyPlayers: {
        gk: 'Keeper (1)',
        def: ['Def 2', 'Def 4', 'Def 5', 'Def 3'],
        mid: ['Mid 6', 'Mid 8', 'Mid 10'],
        fwd: ['Fwd 7', 'Striker 9', 'Fwd 11'],
      },
    };
  }

  if (!awayReg) {
    awayReg = {
      short: away.substring(0, 3).toUpperCase(),
      color: '#F97316',
      secondaryColor: '#000000',
      stadium: `${away} Ground`,
      manager: 'Head Coach',
      formation: '4-2-3-1',
      keyPlayers: {
        gk: 'Keeper (13)',
        def: ['Def 12', 'Def 14', 'Def 15', 'Def 16'],
        mid: ['Mid 18', 'Mid 20', 'Mid 22'],
        fwd: ['Fwd 17', 'Striker 19', 'Fwd 21'],
      },
    };
  }

  // Derive pseudo-deterministic seed from team names
  const seed = (home.length * 17 + away.length * 23) % 100;
  const possessionHome = 44 + (seed % 20); // 44% to 64%
  const possessionAway = 100 - possessionHome;

  const shotsHome = 8 + (seed % 10);
  const shotsAway = 6 + ((seed * 3) % 8);

  const shotsOnTargetHome = Math.max(2, Math.floor(shotsHome * 0.45));
  const shotsOnTargetAway = Math.max(1, Math.floor(shotsAway * 0.4));

  const xgHome = parseFloat((shotsOnTargetHome * 0.28 + 0.35).toFixed(2));
  const xgAway = parseFloat((shotsOnTargetAway * 0.25 + 0.2).toFixed(2));

  // Build key timeline moments
  const events: MatchEvent[] = [
    { minute: 1, type: 'kickoff', team: 'neutral', player: 'Match Kickoff', detail: 'Referee whistle sounded' },
  ];

  if (shotsOnTargetHome > 2) {
    events.push({
      minute: 18 + (seed % 15),
      type: 'goal',
      team: 'home',
      player: homeReg.keyPlayers.fwd[1] || `${home} Striker`,
      detail: 'Curled into bottom right corner',
      scoreAfter: '1 - 0',
    });
  }

  events.push({
    minute: 34 + (seed % 8),
    type: 'card',
    team: 'away',
    player: awayReg.keyPlayers.mid[0] || `${away} Midfielder`,
    detail: 'Tactical foul near halfway line',
  });

  events.push({
    minute: 45,
    type: 'halftime',
    team: 'neutral',
    player: 'Half Time Interval',
    detail: 'Teams headed to tunnel',
    scoreAfter: shotsOnTargetHome > 2 ? '1 - 0' : '0 - 0',
  });

  if (shotsOnTargetAway > 2) {
    events.push({
      minute: 62 + (seed % 10),
      type: 'goal',
      team: 'away',
      player: awayReg.keyPlayers.fwd[1] || `${away} Forward`,
      detail: 'Header from close range after corner',
      scoreAfter: shotsOnTargetHome > 2 ? '1 - 1' : '0 - 1',
    });
  }

  if (shotsOnTargetHome > 4) {
    events.push({
      minute: 77 + (seed % 9),
      type: 'goal',
      team: 'home',
      player: homeReg.keyPlayers.fwd[0] || `${home} Winger`,
      detail: 'Powerful strike off the crossbar',
      scoreAfter: '2 - 1',
    });
  }

  events.push({
    minute: 82,
    type: 'sub',
    team: 'home',
    player: `${homeReg.keyPlayers.mid[2]} ➔ Substitute`,
    detail: 'Tactical reinforcement',
  });

  // Sort events chronologically
  events.sort((a, b) => a.minute - b.minute);

  // Pitch starting lineups coordinates (half-pitch 0-100 x, 0-100 y)
  const homeStartingXI: PlayerLineup[] = [
    { number: 1, name: homeReg.keyPlayers.gk, position: 'GK', gridPos: { x: 10, y: 50 }, isCaptain: false },
    { number: 2, name: homeReg.keyPlayers.def[0] || 'RB', position: 'DEF', gridPos: { x: 28, y: 18 } },
    { number: 4, name: homeReg.keyPlayers.def[1] || 'CB', position: 'DEF', gridPos: { x: 25, y: 40 } },
    { number: 5, name: homeReg.keyPlayers.def[2] || 'CB', position: 'DEF', gridPos: { x: 25, y: 60 } },
    { number: 3, name: homeReg.keyPlayers.def[3] || 'LB', position: 'DEF', gridPos: { x: 28, y: 82 } },
    { number: 6, name: homeReg.keyPlayers.mid[0] || 'DM', position: 'MID', gridPos: { x: 50, y: 50 } },
    { number: 8, name: homeReg.keyPlayers.mid[1] || 'CM', position: 'MID', gridPos: { x: 58, y: 30 } },
    { number: 10, name: homeReg.keyPlayers.mid[2] || 'AM', position: 'MID', gridPos: { x: 62, y: 70 }, isCaptain: true },
    { number: 7, name: homeReg.keyPlayers.fwd[0] || 'RW', position: 'FWD', gridPos: { x: 80, y: 20 } },
    { number: 9, name: homeReg.keyPlayers.fwd[1] || 'ST', position: 'FWD', gridPos: { x: 86, y: 50 } },
    { number: 11, name: homeReg.keyPlayers.fwd[2] || 'LW', position: 'FWD', gridPos: { x: 80, y: 80 } },
  ];

  const awayStartingXI: PlayerLineup[] = [
    { number: 13, name: awayReg.keyPlayers.gk, position: 'GK', gridPos: { x: 10, y: 50 }, isCaptain: false },
    { number: 12, name: awayReg.keyPlayers.def[0] || 'RB', position: 'DEF', gridPos: { x: 28, y: 18 } },
    { number: 14, name: awayReg.keyPlayers.def[1] || 'CB', position: 'DEF', gridPos: { x: 25, y: 40 } },
    { number: 15, name: awayReg.keyPlayers.def[2] || 'CB', position: 'DEF', gridPos: { x: 25, y: 60 } },
    { number: 16, name: awayReg.keyPlayers.def[3] || 'LB', position: 'DEF', gridPos: { x: 28, y: 82 } },
    { number: 18, name: awayReg.keyPlayers.mid[0] || 'CM', position: 'MID', gridPos: { x: 48, y: 38 } },
    { number: 20, name: awayReg.keyPlayers.mid[1] || 'CM', position: 'MID', gridPos: { x: 48, y: 62 } },
    { number: 22, name: awayReg.keyPlayers.mid[2] || 'AM', position: 'MID', gridPos: { x: 65, y: 50 }, isCaptain: true },
    { number: 17, name: awayReg.keyPlayers.fwd[0] || 'RW', position: 'FWD', gridPos: { x: 82, y: 22 } },
    { number: 19, name: awayReg.keyPlayers.fwd[1] || 'ST', position: 'FWD', gridPos: { x: 88, y: 50 } },
    { number: 21, name: awayReg.keyPlayers.fwd[2] || 'LW', position: 'FWD', gridPos: { x: 82, y: 78 } },
  ];

  // Head-to-Head calculations
  const homeWins = 3 + (seed % 4);
  const awayWins = 2 + ((seed * 2) % 3);
  const draws = 10 - homeWins - awayWins;

  const homeForm: ('W' | 'D' | 'L')[] = ['W', 'W', 'D', 'W', 'L'];
  const awayForm: ('W' | 'D' | 'L')[] = ['W', 'L', 'W', 'D', 'W'];

  return {
    homeTeam: home,
    awayTeam: away,
    homeShort: homeReg.short,
    awayShort: awayReg.short,
    homeColor: homeReg.color,
    awayColor: awayReg.color,
    stadium: homeReg.stadium,
    referee: 'Michael Oliver (ENG)',
    stats: {
      possessionHome,
      possessionAway,
      shotsHome,
      shotsAway,
      shotsOnTargetHome,
      shotsOnTargetAway,
      xgHome,
      xgAway,
      cornersHome: 4 + (seed % 5),
      cornersAway: 3 + ((seed * 2) % 4),
      foulsHome: 9 + (seed % 6),
      foulsAway: 11 + ((seed * 3) % 5),
      yellowCardsHome: 1 + (seed % 2),
      yellowCardsAway: 2 + ((seed * 2) % 2),
      passAccuracyHome: 84 + (seed % 8),
      passAccuracyAway: 81 + ((seed * 2) % 7),
      dangerousAttacksHome: 48 + (seed % 20),
      dangerousAttacksAway: 38 + ((seed * 2) % 18),
    },
    events,
    homeLineup: {
      teamName: home,
      shortName: homeReg.short,
      color: homeReg.color,
      secondaryColor: homeReg.secondaryColor,
      formation: homeReg.formation,
      manager: homeReg.manager,
      startingXI: homeStartingXI,
      bench: ['Ramsdale', 'Kiwior', 'Zinchenko', 'Jorginho', 'Sterling', 'Jesus'],
    },
    awayLineup: {
      teamName: away,
      shortName: awayReg.short,
      color: awayReg.color,
      secondaryColor: awayReg.secondaryColor,
      formation: awayReg.formation,
      manager: awayReg.manager,
      startingXI: awayStartingXI,
      bench: ['Jorgensen', 'Adarabioyo', 'Badiashile', 'Dewsbury-Hall', 'Mudryk', 'Felix'],
    },
    headToHead: {
      homeWins,
      draws,
      awayWins,
      homeForm,
      awayForm,
      recentMeetings: [
        { date: '2024-11-10', score: '1 - 1', competition: 'League' },
        { date: '2024-04-23', score: '5 - 0', competition: 'League' },
        { date: '2023-10-21', score: '2 - 2', competition: 'League' },
      ],
    },
    fanPrediction: {
      homePercent: 55 + (seed % 15),
      drawPercent: 20,
      awayPercent: 25 - (seed % 15),
    },
  };
}
