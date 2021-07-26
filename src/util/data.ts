import * as Strings from './strings';

export interface QueueObject {
  [key: string]: Strings.Queue;
}

export const QUEUE: QueueObject = {
  "424": "Casual_Siege",
  "469": "Team Deathmatch",
  "452": "Onslaught",
  "486": "Ranked Keyboard",
  "428": "Ranked Controller",
  "425": "Training Siege",
  "470": "Training Team Deathmatch",
  "453": "Training Onslaught",
  "445": "Test_Maps"
};

export interface PortalsObject {
  [key: string]: Strings.Portals;
}

export const PORTALS: PortalsObject = {
  "0": "Unknown",
  "1": "PC",
  "5": "Steam",
  "28": "Epic",
  "9": "PSN",
  "10": "XboxLive",
  "22": "Nintendo",
  "25": "Discord",
  "14": "Mixer",
  "12": "Facebook",
  "13": "Google"
};

export interface RanksObject {
  [key: string]: Strings.Ranks;
}

export const RANKS: RanksObject = {
  "0": "Qualifying",
  "1": "Bronze V",
  "2": "Bronze IV",
  "3": "Bronze III",
  "4": "Bronze II",
  "5": "Bronze I",
  "6": "Silver V",
  "7": "Silver IV",
  "8": "Silver III",
  "9": "Silver II",
  "10": "Silver I",
  "11": "Gold V",
  "12": "Gold IV",
  "13": "Gold III",
  "14": "Gold II",
  "15": "Gold I",
  "16": "Platinum V",
  "17": "Platinum IV",
  "18": "Platinum III",
  "19": "Platinum II",
  "20": "Platinum I",
  "21": "Diamond V",
  "22": "Diamond IV",
  "23": "Diamond III",
  "24": "Diamond II",
  "25": "Diamond I",
  "26": "Master",
  "27": "Grandmaster"
};

export interface ProfileStatesObject {
  [key: string]: Strings.ProfileStates;
}

export const PROFILE_STATES: ProfileStatesObject = {
  "0": "Offline",
  "1": "In Lobby",
  "2": "Champion Selection",
  "3": "In Match",
  "4": "Online",
  "5": "Unknown"
}

export interface ChampionsObject {
  [key: string]: Strings.Champions;
}


export const CHAMPIONS: ChampionsObject = {
  "2205": "Androxus",
  "2404": "Ash",
  "2512": "Atlas",
  "2073": "Barik",
  "2281": "BombKing",
  "2147": "Buck",
  "2092": "Cassie",
  "2533": "Corvus",
  "2495": "Dredge",
  "2277": "Drogoz",
  "2094": "Evie",
  "2071": "Fernando",
  "2491": "Furia",
  "2093": "Grohk",
  "2254": "Grover",
  "2509": "Imani",
  "2348": "Inara",
  "2517": "Io",
  "2431": "Jenos",
  "2479": "Khan",
  "2249": "Kinessa",
  "2493": "Koga",
  "2362": "Lex",
  "2417": "Lian",
  "2338": "Maeve",
  "2288": "Makoa",
  "2303": "MalDamba",
  "2481": "Moji",
  "2540": "Octavia",
  "2056": "Pip",
  "2528": "Raum",
  "2542": "Rei",
  "2149": "Ruckus",
  "2372": "Seris",
  "2307": "ShaLin",
  "2057": "Skye",
  "2438": "Strix",
  "2472": "Talus",
  "2477": "Terminus",
  "2529": "Tiberius",
  "2322": "Torvald",
  "2314": "Tyra",
  "2541": "Vatu",
  "2285": "Viktor",
  "2480": "Vivian",
  "2536": "Vora",
  "2393": "Willo",
  "2538": "Yagorath",
  "2267": "Ying",
  "2420": "Zhin"
};

export interface ChampionRoleObject {
  [key: string]: Strings.ChampionRole;
}

export const CHAMPION_ROLE: ChampionRoleObject = {
  "Damage": "Damage",
  "Flank": "Flank",
  "Support": "Support",
  "Tank": "Tank",
};