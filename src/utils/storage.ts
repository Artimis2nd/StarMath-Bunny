import { LeaderboardEntry, PlayerStats } from '../types/game';

const STORAGE_KEYS = {
  STATS: 'starmath_true_roguelite_stats_v4',
  LEADERBOARD: 'starmath_true_roguelite_leaderboard_v4',
  ACTIVE_PILOT: 'starmath_active_pilot_v4',
  PLAYER_NAME: 'starmath_player_name_v4',
};

const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'lead_1',
    playerName: 'น้องดาวดวงใหม่ ⭐',
    pilotId: 'bunny',
    score: 12800,
    sectorCleared: 10,
    combo: 18,
    date: '2026-10-15',
  },
  {
    id: 'lead_2',
    playerName: 'กัปตันมิกกี้ 🚀',
    pilotId: 'kitten',
    score: 9500,
    sectorCleared: 8,
    combo: 14,
    date: '2026-10-16',
  },
  {
    id: 'lead_3',
    playerName: 'น้องไอซ์ซี่ 🐱',
    pilotId: 'bunny',
    score: 7200,
    sectorCleared: 6,
    combo: 11,
    date: '2026-10-16',
  },
  {
    id: 'lead_4',
    playerName: 'ฮีโร่โปโกะ 🐶',
    pilotId: 'puppy',
    score: 5400,
    sectorCleared: 5,
    combo: 9,
    date: '2026-10-17',
  },
];

export function getPlayerStats(): PlayerStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        warpTickets: parsed.warpTickets ?? 2, // 2 free warp tickets to start
        gachaCoins: parsed.gachaCoins ?? 3, // 3 free gacha coins to start
        unlockedCostumes: parsed.unlockedCostumes || ['bunny_classic', 'kitten_classic', 'puppy_classic'],
        activeCostumes: parsed.activeCostumes || {
          bunny: 'bunny_classic',
          kitten: 'kitten_classic',
          puppy: 'puppy_classic',
        },
        highestSectorReached: parsed.highestSectorReached ?? 1,
        totalRuns: parsed.totalRuns ?? 0,
        totalBossesDefeated: parsed.totalBossesDefeated ?? 0,
        highestCombo: parsed.highestCombo ?? 0,
      };
    }
  } catch {
    // fallback
  }

  return {
    warpTickets: 2,
    gachaCoins: 3,
    unlockedCostumes: ['bunny_classic', 'kitten_classic', 'puppy_classic'],
    activeCostumes: {
      bunny: 'bunny_classic',
      kitten: 'kitten_classic',
      puppy: 'puppy_classic',
    },
    highestSectorReached: 1,
    totalRuns: 0,
    totalBossesDefeated: 0,
    highestCombo: 0,
  };
}

export function savePlayerStats(stats: PlayerStats): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch {
    // storage fallback
  }
}

export function unlockCostume(costumeId: string): PlayerStats {
  const current = getPlayerStats();
  if (!current.unlockedCostumes.includes(costumeId)) {
    const updated: PlayerStats = {
      ...current,
      unlockedCostumes: [...current.unlockedCostumes, costumeId],
    };
    savePlayerStats(updated);
    return updated;
  }
  return current;
}

export function equipCostume(pilotId: string, costumeId: string): PlayerStats {
  const current = getPlayerStats();
  const updated: PlayerStats = {
    ...current,
    activeCostumes: {
      ...current.activeCostumes,
      [pilotId]: costumeId,
    },
  };
  savePlayerStats(updated);
  return updated;
}

export function addWarpTickets(qty: number): PlayerStats {
  const current = getPlayerStats();
  const updated = { ...current, warpTickets: current.warpTickets + qty };
  savePlayerStats(updated);
  return updated;
}

export function spendWarpTickets(qty: number): boolean {
  const current = getPlayerStats();
  if (current.warpTickets < qty) return false;
  const updated = { ...current, warpTickets: current.warpTickets - qty };
  savePlayerStats(updated);
  return true;
}

export function addGachaCoins(qty: number): PlayerStats {
  const current = getPlayerStats();
  const updated = { ...current, gachaCoins: current.gachaCoins + qty };
  savePlayerStats(updated);
  return updated;
}

export function spendGachaCoin(): boolean {
  const current = getPlayerStats();
  if (current.gachaCoins < 1) return false;
  const updated = { ...current, gachaCoins: current.gachaCoins - 1 };
  savePlayerStats(updated);
  return true;
}

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return DEFAULT_LEADERBOARD;
}

export function saveLeaderboardEntry(entry: Omit<LeaderboardEntry, 'id' | 'date'>): LeaderboardEntry[] {
  const current = getLeaderboard();
  const newEntry: LeaderboardEntry = {
    ...entry,
    id: 'lead_' + Date.now(),
    date: new Date().toISOString().split('T')[0],
  };

  const updated = [...current, newEntry]
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);

  try {
    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(updated));
  } catch {
    // storage fallback
  }

  return updated;
}

export function getSavedPlayerName(): string {
  return localStorage.getItem(STORAGE_KEYS.PLAYER_NAME) || 'นักบินน้อย ⭐';
}

export function savePlayerName(name: string): void {
  localStorage.setItem(STORAGE_KEYS.PLAYER_NAME, name);
}

export function getSavedPilotId(): 'bunny' | 'kitten' | 'puppy' {
  const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_PILOT);
  if (saved === 'bunny' || saved === 'kitten' || saved === 'puppy') {
    return saved;
  }
  return 'bunny';
}

export function savePilotId(pilotId: 'bunny' | 'kitten' | 'puppy'): void {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_PILOT, pilotId);
}
