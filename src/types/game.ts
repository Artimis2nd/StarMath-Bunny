export type DifficultyMode = 'EASY' | 'NORMAL' | 'HARD';

export interface DifficultyConfig {
  mode: DifficultyMode;
  name: string;
  thaiName: string;
  baseSeconds: number; // 60, 45, 30
  gachaRollsOnVictory: number; // 1, 1, 2
  color: string;
  badgeBg: string;
  badgeBorder: string;
  description: string;
}

export type StageRewardType =
  | 'HP_REFILL'
  | 'CUT_ASSIST'
  | 'TIME_BONUS'
  | 'NEW_COSTUME'
  | 'DUPLICATE_CONVERT_HP'
  | 'TICKETS';

export interface StageRewardItem {
  id: string;
  type: StageRewardType;
  title: string;
  description: string;
  icon: string;
  value?: number;
  costume?: Costume;
}

export type GameState =
  | 'MENU'
  | 'BATTLE_RUN'
  | 'BOSS_CLIMAX'
  | 'CHEST_REWARD'
  | 'GACHA_REWARD'
  | 'GAME_OVER'
  | 'WARDROBE'
  | 'SECTOR_WARP'
  | 'LEADERBOARD';

export interface Pilot {
  id: 'bunny' | 'kitten' | 'puppy';
  name: string;
  thaiName: string;
  avatarUrl: string;
  color: string;
}

export interface Costume {
  id: string;
  pilotId: 'bunny' | 'kitten' | 'puppy';
  name: string;
  emoji: string;
  title: string;
  imageUrl: string; // Full-body 2D anime character art in this costume
  badgeColor: string;
  attackName: string;
  attackEmoji: string;
  attackColor: string;
  bonusHp: number; // e.g. 3, 4, 5
  timeSeconds: number; // e.g. 60, 68, 70, 75
  cutAssistCharges: number; // e.g. 1, 2, 3
  shieldBonus: number; // e.g. 0 or 1
  unlocked: boolean;
  unlockCondition: string;
}

export interface MathProblem {
  id: string;
  num1: number;
  num2: number;
  answer: number;
  table: number; // +1, +2, etc.
  options: number[]; // 3 options
  correctIndex: number;
}

export interface SectorConfig {
  sector: number; // 1 to 10
  name: string;
  thaiName: string;
  targetQuota: number; // 6 to 10 questions
  themeColor: string;
  accentColor: string;
  bossName: string;
  bossEmoji: string;
  warpCostTickets: number; // Tickets needed to warp directly to this sector
}

export interface PlayerStats {
  warpTickets: number; // 🎫 Tickets to jump to higher sectors
  gachaCoins: number; // 🟡 Coins to roll the Gacha machine
  unlockedCostumes: string[]; // costume ids
  activeCostumes: Record<string, string>; // pilotId -> costumeId
  highestSectorReached: number; // 1 to 10
  totalRuns: number;
  totalBossesDefeated: number;
  highestCombo: number;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  pilotId: 'bunny' | 'kitten' | 'puppy';
  score: number;
  sectorCleared: number;
  combo: number;
  accuracy?: number;
  date: string;
}

export type DisplayModeSetting = 'AUTO' | 'PC' | 'MOBILE';
export type EffectiveDisplayMode = 'PC' | 'MOBILE';
