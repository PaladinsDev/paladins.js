import { PORTALS, QUEUE } from './data';
import { ProfileStates } from "./enumerations";
import * as Strings from "./strings";

interface Champion {
  Ability1: string;
  Ability2: string;
  Ability3: string;
  Ability4: string;
  Ability5: string;
  AbilityId1: number;
  AbilityId2: number;
  AbilityId3: number;
  AbilityId4: number;
  AbilityId5: number;
  Ability_1: Ability;
  Ability_2: Ability;
  Ability_3: Ability;
  Ability_4: Ability;
  Ability_5: Ability;
  ChampionAbility1_URL: string;
  ChampionAbility2_URL: string;
  ChampionAbility3_URL: string;
  ChampionAbility4_URL: string;
  ChampionAbility5_URL: string;
  ChampionCard_URL: string;
  ChampionIcon_URL: string;
  Cons: string;
  Health: number;
  Lore: string;
  Name: Strings.Champions;
  Name_English: Strings.Champions;
  OnFreeRotation: string;
  OnFreeWeeklyRotation: string;
  Pantheon: Pantheon;
  Pros: string;
  Roles: Roles;
  Speed: number;
  Title: string;
  Type: string;
  abilityDescription1: string;
  abilityDescription2: string;
  abilityDescription3: string;
  abilityDescription4: string;
  abilityDescription5: string;
  id: number;
  latestChampion: LatestChampion;
  ret_msg: string | null;
}

interface Ability {
  Description: string;
  Id: number;
  Summary: string;
  URL: string;
  damageType: DamageType;
  rechargeSeconds: number;
}

enum DamageType {
  AoE = "AoE",
  Direct = "Direct",
  Physical = "Physical",
  True = "True",
}

enum Pantheon {
  Empty = "",
  Norse = "Norse",
}

enum Roles {
  PaladinsDamage = "Paladins Damage",
  PaladinsFlanker = "Paladins Flanker",
  PaladinsFrontLine = "Paladins Front Line",
  PaladinsSupport = "Paladins Support",
}

enum LatestChampion {
  N = "n",
  Y = "y",
}

interface ChampionCard {
  active_flag_activation_schedule: ActiveFlag;
  active_flag_lti: ActiveFlag;
  card_description: string;
  card_id1: number;
  card_id2: number;
  card_name: string;
  card_name_english: string;
  championCard_URL: string;
  championIcon_URL: string;
  championTalent_URL: null | string;
  champion_id: number;
  champion_name: string;
  exclusive: Exclusive;
  rank: number;
  rarity: Rarity;
  recharge_seconds: number;
  ret_msg: string | null;
}

enum ActiveFlag {
  Y = "y",
  N = "n"
}

enum Exclusive {
  Y = "y",
  N = "n"
}

enum Rarity {
  Common = "Common",
  Legendary = "Legendary",
}

interface PlayerChampionRank {
  Assists: number;
  Deaths: number;
  Gold: number;
  Kills: number;
  LastPlayed: string;
  Losses: number;
  MinionKills: number;
  Minutes: number;
  Rank: number;
  Wins: number;
  Worshippers: number;
  champion: string;
  champion_id: string;
  player_id: string;
  ret_msg: string | null;
}

interface MatchIDByQueue {
  Active_Flag: ActiveFlag;
  Entry_Datetime: string;
  Match: string;
  ret_msg: string | null;
}

interface ChampionSkin {
  champion_id: number;
  champion_name: string;
  rarity: string;
  ret_msg: string | null;
  skin_id1: number;
  skin_id2: number;
  skin_name: string;
  skin_name_english: string;
}

interface Item {
  Description: string;
  DeviceName: string;
  IconId: number;
  ItemId: number;
  Price: number;
  ShortDesc: string;
  champion_id: number;
  itemIcon_URL: string;
  item_type: ItemType;
  recharge_seconds: number;
  ret_msg: string | null;
  talent_reward_level: number;
}

enum ItemType {
  BurnCardDamageVendor = "Burn Card Damage Vendor",
  BurnCardDefenseVendor = "Burn Card Defense Vendor",
  BurnCardHealingVendor = "Burn Card Healing Vendor",
  BurnCardUtilityVendor = "Burn Card Utility Vendor",
  CardVendorRank1Epic = "Card Vendor Rank 1 Epic",
  CardVendorRank1Rare = "Card Vendor Rank 1 Rare",
  InventoryVendorChampionCards = "Inventory Vendor - Champion Cards",
  InventoryVendorTalents = "Inventory Vendor - Talents",
  InventoryVendorTalentsDefault = "Inventory Vendor - Talents Default",
  ZDeprecatedCardVendorRank4 = "zDeprecated Card Vendor Rank 4",
}

interface Player {
  ActivePlayerId: number;
  AvatarId: number;
  AvatarURL: string;
  Created_Datetime: string;
  HoursPlayed: number;
  Id: number;
  Last_Login_Datetime: string;
  Leaves: number;
  Level: number;
  LoadingFrame: string;
  Losses: number;
  MasteryLevel: number;
  MergedPlayers: null;
  MinutesPlayed: number;
  Name: string;
  Personal_Status_Message: string;
  Platform: string;
  RankedConquest: Ranked;
  RankedController: Ranked;
  RankedKBM: Ranked;
  Region: string;
  TeamId: number;
  Team_Name: string;
  Tier_Conquest: number;
  Tier_RankedController: number;
  Tier_RankedKBM: number;
  Title: string;
  Total_Achievements: number;
  Total_Worshippers: number;
  Total_XP: number;
  Wins: number;
  hz_gamer_tag: null;
  hz_player_name: string;
  ret_msg: string | null;
}

interface Ranked {
  Leaves: number;
  Losses: number;
  Name: string;
  Points: number;
  PrevRank: number;
  Rank: number;
  Season: number;
  Tier: number;
  Trend: number;
  Wins: number;
  player_id: null;
  ret_msg: string | null;
}

interface PlayerIDByName {
  Name: string;
  player_id: number;
  portal: string;
  portal_id: string;
  privacy_flag: string;
  ret_msg: string | null;
}

interface PlayerRelationship {
  account_id: string;
  friend_flags: string;
  name: string;
  player_id: string;
  portal_id: string;
  ret_msg: string | null;
  status: Status;
}

enum Status {
  Friend = "Friend",
}

interface PlayerLoadout {
  ChampionId: number;
  ChampionName: string;
  DeckId: number;
  DeckName: string;
  LoadoutItems: LoadoutItem[];
  playerId: number;
  playerName: string;
  ret_msg: string | null;
}

interface LoadoutItem {
  ItemId: number;
  ItemName: string;
  Points: number;
}

interface PlayerStatus {
  Match?: number;
  match_queue_id?: number;
  personal_status_message?: null;
  ret_msg?: null;
  status: ProfileStates;
  status_string?: string;
}

interface PlayerMatchHistory {
  ActiveId1: number;
  ActiveId2: number;
  ActiveId3: number;
  ActiveId4: number;
  ActiveLevel1: number;
  ActiveLevel2: number;
  ActiveLevel3: number;
  ActiveLevel4: number;
  Active_1: string;
  Active_2: string;
  Active_3: string;
  Active_4: Active4;
  Assists: number;
  Champion: string;
  ChampionId: number;
  Creeps: number;
  Damage: number;
  Damage_Bot: number;
  Damage_Done_In_Hand: number;
  Damage_Mitigated: number;
  Damage_Structure: number;
  Damage_Taken: number;
  Damage_Taken_Magical: number;
  Damage_Taken_Physical: number;
  Deaths: number;
  Distance_Traveled: number;
  Gold: number;
  Healing: number;
  Healing_Bot: number;
  Healing_Player_Self: number;
  ItemId1: number;
  ItemId2: number;
  ItemId3: number;
  ItemId4: number;
  ItemId5: number;
  ItemId6: number;
  ItemLevel1: number;
  ItemLevel2: number;
  ItemLevel3: number;
  ItemLevel4: number;
  ItemLevel5: number;
  ItemLevel6: number;
  Item_1: string;
  Item_2: string;
  Item_3: string;
  Item_4: string;
  Item_5: string;
  Item_6: string;
  Killing_Spree: number;
  Kills: number;
  Level: number;
  Map_Game: string;
  Match: number;
  Match_Queue_Id: number;
  Match_Time: string;
  Minutes: number;
  Multi_kill_Max: number;
  Objective_Assists: number;
  Queue: string;
  Region: string;
  Skin: string;
  SkinId: number;
  Surrendered: number;
  TaskForce: number;
  Team1Score: number;
  Team2Score: number;
  Time_In_Match_Seconds: number;
  Wards_Placed: number;
  Win_Status: WinStatus;
  Winning_TaskForce: number;
  playerId: number;
  playerName: string;
  ret_msg: string | null;
}

enum Active4 {
  Empty = "",
  Haven = "Haven",
  LifeRIP = "Life Rip",
  MoraleBoost = "Morale Boost",
  Nimble = "Nimble",
  Resilience = "Resilience",
}

enum WinStatus {
  Loss = "Loss",
  Win = "Win",
}

interface PlayerQueueStat {
  Assists: number;
  Champion: string;
  ChampionId: number;
  Deaths: number;
  Gold: number;
  Kills: number;
  LastPlayed: string;
  Losses: number;
  Matches: number;
  Minutes: number;
  Queue: string;
  Wins: number;
  player_id: string;
  ret_msg: string | null;
}

interface MatchModePlayerDetail {
  Account_Level: number;
  ActiveId1: number;
  ActiveId2: number;
  ActiveId3: number;
  ActiveId4: number;
  ActiveLevel1: number;
  ActiveLevel2: number;
  ActiveLevel3: number;
  ActiveLevel4: number;
  ActivePlayerId: string;
  Assists: number;
  BanId1: number;
  BanId2: number;
  BanId3: number;
  BanId4: number;
  Ban_1: null;
  Ban_2: null;
  Ban_3: null;
  Ban_4: null;
  Camps_Cleared: number;
  ChampionId: number;
  Damage_Bot: number;
  Damage_Done_In_Hand: number;
  Damage_Done_Magical: number;
  Damage_Done_Physical: number;
  Damage_Mitigated: number;
  Damage_Player: number;
  Damage_Taken: number;
  Damage_Taken_Magical: number;
  Damage_Taken_Physical: number;
  Deaths: number;
  Distance_Traveled: number;
  Entry_Datetime: string;
  Final_Match_Level: number;
  Gold_Earned: number;
  Gold_Per_Minute: number;
  Healing: number;
  Healing_Bot: number;
  Healing_Player_Self: number;
  ItemId1: number;
  ItemId2: number;
  ItemId3: number;
  ItemId4: number;
  ItemId5: number;
  ItemId6: number;
  ItemLevel1: number;
  ItemLevel2: number;
  ItemLevel3: number;
  ItemLevel4: number;
  ItemLevel5: number;
  ItemLevel6: number;
  Item_Active_1: string;
  Item_Active_2: string;
  Item_Active_3: string;
  Item_Active_4: string;
  Item_Purch_1: string;
  Item_Purch_2: string;
  Item_Purch_3: string;
  Item_Purch_4: string;
  Item_Purch_5: string;
  Item_Purch_6: string;
  Killing_Spree: number;
  Kills_Bot: number;
  Kills_Double: number;
  Kills_Fire_Giant: number;
  Kills_First_Blood: number;
  Kills_Gold_Fury: number;
  Kills_Penta: number;
  Kills_Phoenix: number;
  Kills_Player: number;
  Kills_Quadra: number;
  Kills_Siege_Juggernaut: number;
  Kills_Single: number;
  Kills_Triple: number;
  Kills_Wild_Juggernaut: number;
  League_Losses: number;
  League_Points: number;
  League_Tier: number;
  League_Wins: number;
  Map_Game: string;
  Mastery_Level: number;
  Match: number;
  Match_Duration: number;
  MergedPlayers?: MergedPlayer[];
  Minutes: number;
  Multi_kill_Max: number;
  Objective_Assists: number;
  PartyId: number;
  Platform: string;
  Rank_Stat_League: number;
  Reference_Name: string;
  Region: string;
  Skin: string;
  SkinId: number;
  Structure_Damage: number;
  Surrendered: number;
  TaskForce: number;
  Team1Score: number;
  Team2Score: number;
  TeamId: number;
  Team_Name: string;
  Time_In_Match_Seconds: number;
  Towers_Destroyed: number;
  Wards_Placed: number;
  Win_Status: WinStatus;
  Winning_TaskForce: number;
  hasReplay: HasReplay;
  hz_gamer_tag: null;
  hz_player_name: null;
  match_queue_id: number;
  name: string;
  playerId: string;
  playerName: string;
  playerPortalId: keyof (typeof PORTALS);
  playerPortalUserId: null | string;
  ret_msg: string | null;
}

interface MergedPlayer {
  merge_datetime: string;
  playerId: string;
  portalId: string;
}

enum WinStatus {
  Loser = "Loser",
  Winner = "Winner",
}

enum HasReplay {
  Y = "y",
  N = "n",
}

interface ActiveMatchDetail {
  Account_Champions_Played: number;
  Account_Level: number;
  ChampionId: number;
  ChampionLevel: number;
  ChampionName: string;
  Mastery_Level: number;
  Match: number;
  Queue: keyof (typeof QUEUE);
  Skin?: string;
  SkinId?: number;
  Tier: number;
  mapGame?: string;
  playerCreated?: string;
  playerId: number;
  playerName: string;
  playerPortalId: keyof (typeof PORTALS);
  playerPortalUserId: null | string;
  playerRegion?: string;
  ret_msg: string;
  taskForce: number;
  tierLosses: number;
  tierWins: number;
}

interface BountyItem {
  active: Active;
  bounty_item_id1: number;
  bounty_item_id2: number;
  bounty_item_name: string;
  champion_id: number;
  champion_name: string;
  final_price: string;
  initial_price: string;
  ret_msg: string | null;
  sale_end_datetime: string;
  sale_type: SaleType;
}

enum Active {
  Y = "y",
  N = "n",
}

enum SaleType {
  Increasing = "Increasing",
  Decreasing = "Decreasing",
}

interface DataUsage {
  Active_Sessions: number;
  Concurrent_Sessions: number;
  Request_Limit_Daily: number;
  Session_Cap: number;
  Session_Time_Limit: number;
  Total_Requests_Today: number;
  Total_Sessions_Today: number;
  ret_msg: string | null;
}

interface SearchPlayer {
  Name: string;
  hz_player_name: string;
  player_id: string;
  portal_id: string;
  privacy_flag: string;
  ret_msg: string | null;
  portal_name: string;
}

export type GetChampions = Champion[]
export type GetChampionCards = ChampionCard[]
export type GetPlayerChampionRanks = PlayerChampionRank[]
export type GetMatchIDSByQueue = MatchIDByQueue[]
export type GetChampionSkins = ChampionSkin[]
export type GetItems = Item[]
export type GetPlayer = Player
export type GetPlayerBatch = Player[]
export type GetPlayerIDByName = PlayerIDByName
export type GetPlayerRelationships = PlayerRelationship[]
export type GetPlayerLoadouts = PlayerLoadout[]
export type GetPlayerStatus = PlayerStatus
export type GetPlayerMatchHistory = PlayerMatchHistory
export type GetPlayerQueueStats = PlayerQueueStat[];
export type GetMatchModeDetailsBatch = {
  // key is the matchId
  [key: string]: MatchModePlayerDetail[]
}
export type GetMatchDetails = MatchModePlayerDetail[]
export type GetActiveMatchDetails = ActiveMatchDetail[]
export type GetBountyItems = BountyItem[]
export type GetDataUsage = DataUsage | DataUsage[]
export type SearchPlayers = SearchPlayer[]